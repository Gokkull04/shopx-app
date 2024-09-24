import React, { useState, useEffect } from "react";
import { purchaseEbook, viewEbook } from "../integration"; // Only import the required functions
import Web3 from "web3";

const ShopPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [account, setAccount] = useState("");

  // Function to load user's purchased books when the wallet is connected
  const loadPurchasedBooks = async (ebookMarketplace, userAccount) => {
    try {
      const ebookCount = await ebookMarketplace.methods.ebookCount().call();
      let purchasedBooks = [];

      // Check for each eBook if the user has purchased it
      for (let i = 1; i <= ebookCount; i++) {
        const isPurchased = await ebookMarketplace.methods
          .hasPurchased(i, userAccount)
          .call(); // Assuming 'hasPurchased' method exists
        if (isPurchased) {
          purchasedBooks.push(i);
        }
      }

      setPurchasedBooks(purchasedBooks);
    } catch (error) {
      console.error("Error loading purchased books:", error);
    }
  };

  // Function to load all available eBooks from the contract
  const loadEbooks = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contractAddress = "0xd54cb54e0daF0dB6D7d27F618e8Fd84106eaA901";
      const abi = require("../abi/abi.json"); // Assuming abi is correctly placed
      const ebookMarketplace = new web3.eth.Contract(abi, contractAddress);

      const ebookCount = await ebookMarketplace.methods.ebookCount().call();
      let books = [];

      for (let i = 1; i <= ebookCount; i++) {
        const ebook = await ebookMarketplace.methods.ebooks(i).call();
        books.push(ebook);
      }

      setEbooks(books);

      // Load user's purchased books if account is available
      if (account) {
        await loadPurchasedBooks(ebookMarketplace, account);
      }
    } catch (error) {
      console.error("Error loading eBooks:", error);
    }
  };

  // Handle wallet connection and fetch the user's account
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]); // Set the connected account
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.requestAccounts();
          setAccount(accounts[0]); // Automatically set the account

          // Load eBooks and purchased books
          await loadEbooks();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        alert("Please install MetaMask.");
      }
    };

    fetchData();
  }, []);

  const handlePurchaseEbook = async (ebookId, ebookPrice) => {
    try {
      await purchaseEbook(ebookId);
      setPurchasedBooks([...purchasedBooks, ebookId]); // Mark the eBook as purchased
      alert("eBook purchased successfully!");
    } catch (error) {
      console.error("Error purchasing eBook:", error);
      alert("Failed to purchase eBook.");
    }
  };

  const handleViewEbook = async (ebookId) => {
    try {
      const ipfsHash = await viewEbook(ebookId);
      const ebookURL = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      window.open(ebookURL, "_blank"); // Open the eBook in a new tab
    } catch (error) {
      console.error("Error viewing eBook:", error);
      alert("Failed to view eBook.");
    }
  };

  const isEbookPurchased = (ebookId) => {
    return purchasedBooks.includes(ebookId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4">Available eBooks</h2>

        {ebooks.length === 0 ? (
          <p>No eBooks available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ebooks.map((ebook, index) => (
              <div
                key={index}
                className="bg-white p-4 shadow-md rounded-lg flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">{ebook.title}</h3>
                  <p className="text-gray-600 mb-2">By: {ebook.author}</p>
                  <p className="text-gray-600 mb-4">
                    Price: {Web3.utils.fromWei(ebook.price, "ether")} ETH
                  </p>
                </div>

                {/* Show Buy Now or View eBook button */}
                {isEbookPurchased(index + 1) ? (
                  <button
                    onClick={() => handleViewEbook(index + 1)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    View eBook
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchaseEbook(index + 1, ebook.price)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Buy Now
                  </button>
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
