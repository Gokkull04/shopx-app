// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to ShopX</h1>
      <p className="text-xl mb-8">
        Your one-stop shop for buying and selling eBooks
      </p>
      <Link
        to="/shop"
        className="px-8 py-3 bg-yellow-400 rounded-lg text-gray-800 font-semibold hover:bg-yellow-300 transition duration-300"
      >
        Shop books
      </Link>
    </div>
  );
}

export default Home;
