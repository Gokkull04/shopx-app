// src/pages/ShopPage.js
import React, { useEffect, useState } from "react";

const ShopPage = () => {
  const [ebooks, setEbooks] = useState([]);

  useEffect(() => {
    // Retrieve eBooks from local storage
    const storedEbooks = JSON.parse(localStorage.getItem("ebooks")) || [];
    setEbooks(storedEbooks);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 text-white">
        <h1 className="text-2xl font-bold">ShopX</h1>
      </nav>

      {/* eBooks Section */}
      <div className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6">Available eBooks</h2>

        {ebooks.length === 0 ? (
          <p>No eBooks available for sale.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook, index) => (
              <div key={index} className="bg-white p-4 shadow-md rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{ebook.title}</h3>
                <p className="text-gray-600 mb-2">{ebook.author}</p>
                <p className="text-gray-600 mb-4">Price: {ebook.price} USD</p>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${ebook.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View eBook
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
