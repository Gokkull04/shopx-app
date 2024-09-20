import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ShopPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [enlargedIndex, setEnlargedIndex] = useState(null); // Track which card is enlarged
  const [purchasedIndex, setPurchasedIndex] = useState(null); // Track which eBook is purchased
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve eBooks from local storage
    const storedEbooks = JSON.parse(localStorage.getItem("ebooks")) || [];
    setEbooks(storedEbooks);
  }, []);

  const handleSellEbook = () => {
    navigate("/sell"); // Navigate to the Sell eBook form page
  };

  const handleConnectWallet = () => {
    // Implement wallet connect logic here (like Web3 integration)
    alert("Connect Wallet functionality coming soon!");
  };

  const handleCardClick = (index) => {
    setEnlargedIndex(index); // Set the clicked card to enlarged
  };

  const handleBuyNow = (index) => {
    setPurchasedIndex(index); // Set the book as purchased
    console.log(`Book purchased. IPFS Hash: ${ebooks[index].ipfsHash}`); // Log the IPFS hash to console
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">ShopX</h1>
        <button
          onClick={handleConnectWallet}
          className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          Connect Wallet
        </button>
      </nav>

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
                className={`bg-white p-4 shadow-md rounded-lg transition-all duration-300 ${
                  enlargedIndex === index ? "scale-105" : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                <h3 className="text-xl font-semibold mb-2">{ebook.title}</h3>
                <p className="text-gray-600 mb-2">{ebook.author}</p>
                <p className="text-gray-600 mb-4">Price: {ebook.price} USD</p>

                {/* If the card is clicked, show the Buy Now button */}
                {enlargedIndex === index && purchasedIndex === null && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(index);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Buy Now
                  </button>
                )}

                {/* If the book is purchased, show the IPFS link */}
                {purchasedIndex === index && (
                  <p className="mt-2 text-green-500">Book Purchased!</p>
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
