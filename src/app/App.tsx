import React from "react";
import RoutesApp from "./routes.tsx";
import Providers from "./providers";

export const App = () => {
  return (
    <Providers>
      <RoutesApp />
    </Providers>
  );
};