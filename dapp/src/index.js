// index.js or App.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Your main App component
import './index.css'
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID", // Replace with your actual project ID
  chains: [sepolia],
  ssr: true,
});

const Root = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
