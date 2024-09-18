// src/pages/ShopPage.js
import React from "react";

const ShopPage = () => {
  // Assuming the eBook data will come from the state or API
  const eBooks = [
    { id: 1, title: "The Art of Programming", price: "$20" },
    { id: 2, title: "Learn React Quickly", price: "$25" },
    { id: 3, title: "Mastering JavaScript", price: "$30" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-500 py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
                  <div className="text-white text-2xl font-bold">ShopX</div>
                  <div className="flex gap-8">
                      <h1 className="text-white text-lg">Show eBook</h1>
                      <h1 className="text-white text-lg">Sell eBook</h1>
                  </div>
          <button className="bg-white text-blue-500 py-2 px-4 rounded-lg font-semibold">
            Buy Now
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="container mx-auto py-10 flex-grow">
        <h2 className="text-3xl font-bold text-gray-700 mb-8">
          Available eBooks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eBooks.map((book) => (
            <div key={book.id} className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {book.title}
              </h3>
              <p className="text-lg text-gray-600 mt-2">{book.price}</p>
              <button className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-500 py-6 mt-12">
        <div className="container mx-auto text-center text-white">
          © 2024 ShopX - All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ShopPage;
