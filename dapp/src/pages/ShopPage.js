import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Navbar from "../components/Navbar"; // Import the Navbar component

const ShopPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null); // Track which card is expanded
  const [purchasedBooks, setPurchasedBooks] = useState([]); // Track purchased books
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve eBooks from local storage
    const storedEbooks = JSON.parse(localStorage.getItem("ebooks")) || [];
    setEbooks(storedEbooks);
  }, []);

  const handleSellEbook = () => {
    navigate("/sell"); // Navigate to the Sell eBook form page
  };

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index); // Toggle card expansion
  };

  const handleBuyNow = (ebook) => {
    // Simulate the purchase of the book
    setPurchasedBooks([...purchasedBooks, ebook.ipfsHash]); // Add the purchased book's IPFS hash
    alert(`You've successfully purchased "${ebook.title}".`);
  };

  const isBookPurchased = (ipfsHash) => {
    return purchasedBooks.includes(ipfsHash); // Check if the book is purchased
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* eBooks Section */}
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Available eBooks</h2>
          <button
            onClick={handleSellEbook}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Sell eBook
          </button>
        </div>

        {ebooks.length === 0 ? (
          <p>No eBooks available for sale.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook, index) => (
              <div
                key={index}
                className={`bg-white p-4 shadow-md rounded-lg transition-transform duration-300 ${
                  expandedCard === index ? "transform scale-105" : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                <h3 className="text-xl font-semibold mb-2">{ebook.title}</h3>
                <p className="text-gray-600 mb-2">{ebook.author}</p>
                <p className="text-gray-600 mb-4">Price: {ebook.price} USD</p>

                {/* Show Buy Now button only if the book is not purchased */}
                {expandedCard === index && !isBookPurchased(ebook.ipfsHash) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the card click
                      handleBuyNow(ebook);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Buy Now
                  </button>
                )}

                {/* Show the IPFS link only if the book is purchased */}
                {isBookPurchased(ebook.ipfsHash) && expandedCard === index && (
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${ebook.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mt-2 block"
                  >
                    View eBook
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
