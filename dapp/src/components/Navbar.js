// Navbar.js
import React from "react";
import { useAccount } from "wagmi"; // Import the useAccount hook
import Button from "./Button"; // Adjust the import path if necessary

const Navbar = () => {
  const { isConnected, address } = useAccount(); // Get connection status and address

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">eBook Marketplace</h1>
      <div className="flex items-center">
        {isConnected ? (
          <span>
            Connected:{" "}
            {address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Unknown Address"}
          </span>
        ) : (
          <Button /> // Show the ConnectButton
        )}
      </div>
    </nav>
  );
};

export default Navbar;
