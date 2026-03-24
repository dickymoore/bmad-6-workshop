import { QueryClient } from "@/lib/vendor/tanstack-react-query";

export function createDashboardQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15_000,
      },
    },
  });
}
