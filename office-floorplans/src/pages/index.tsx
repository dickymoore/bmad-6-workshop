import Link from "next/link";
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
      <h1>Floorplan Demo</h1>
      <p>Navigate to see the interactive office floorplans.</p>
      <Link href="/demo-floorplans">Go to demo</Link>
    </div>
  );
};

export default HomePage;
