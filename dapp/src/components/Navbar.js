import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button"

const Navbar = () => {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    // Implement wallet connect logic here
    alert("Connect Wallet functionality coming soon!");
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-2xl font-bold">ShopX</h1>
      <div className="flex items-center">
        <Button />
      </div>
    </nav>
  );
};

export default Navbar;
