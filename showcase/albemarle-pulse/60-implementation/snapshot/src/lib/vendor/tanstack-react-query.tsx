"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type QueryClientOptions = {
  defaultOptions?: {
    queries?: Record<string, unknown>;
  };
};

export class QueryClient {
  defaultOptions: QueryClientOptions["defaultOptions"];

  constructor(options: QueryClientOptions = {}) {
    this.defaultOptions = options.defaultOptions ?? {};
  }
}

const QueryClientContext = createContext<QueryClient | null>(null);

export function QueryClientProvider({
  children,
  client,
}: {
  children: ReactNode;
  client: QueryClient;
}) {
  return <QueryClientContext.Provider value={client}>{children}</QueryClientContext.Provider>;
}

type UseQueryOptions<TData> = {
  queryKey: readonly unknown[];
  queryFn: () => Promise<TData>;
  initialData?: TData;
  refetchInterval?: number | false;
};

type UseQueryResult<TData> = {
  data: TData | undefined;
  error: unknown;
  isLoading: boolean;
  isFetching: boolean;
  status: "pending" | "success" | "error";
};

export function useQuery<TData>({
  queryKey,
  queryFn,
  initialData,
  refetchInterval = false,
}: UseQueryOptions<TData>): UseQueryResult<TData> {
  if (!useContext(QueryClientContext)) {
    throw new Error("QueryClientProvider is required");
  }

  const queryFnRef = useRef(queryFn);
  const dataRef = useRef<TData | undefined>(initialData);
  const initialDataRef = useRef<TData | undefined>(initialData);
  const [data, setData] = useState<TData | undefined>(initialData);
  const [error, setError] = useState<unknown>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(initialData === undefined);
  const queryKeyHash = JSON.stringify(queryKey);

  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    initialDataRef.current = initialData;
  }, [initialData]);

  useEffect(() => {
    let cancelled = false;

    async function loadData(isBackground: boolean) {
      if (!isBackground) {
        setIsLoading(dataRef.current === undefined);
      }

      setIsFetching(true);

      try {
        const nextData = await queryFnRef.current();

        if (!cancelled) {
          setData(nextData);
          setError(null);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(caughtError);
        }
      } finally {
        if (!cancelled) {
          setIsFetching(false);
          setIsLoading(false);
        }
      }
    }

    void loadData(initialDataRef.current !== undefined);

    if (!refetchInterval) {
      return () => {
        cancelled = true;
      };
    }

    const timer = window.setInterval(() => {
      void loadData(true);
    }, refetchInterval);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [queryKeyHash, refetchInterval]);

  return {
    data,
    error,
    isLoading,
    isFetching,
    status: error ? "error" : isLoading ? "pending" : "success",
  };
}
