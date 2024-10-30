import React, { useEffect, useState } from "react";
import { loadEbooksFromBlockchain, purchaseEbook, web3 } from "../integration"; // Adjust import paths as needed
import { formatEther, parseEther } from "ethers"; // Ensure ethers.js import is correct

const ShopPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Request user's Ethereum account
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        // Load all eBooks from the blockchain
        const books = await loadEbooksFromBlockchain();
        setEbooks(books);
      } catch (error) {
        console.error("Error loading blockchain data: ", error);
        setErrorMessage("Error loading blockchain data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (window.ethereum) {
      loadBlockchainData();
    } else {
      console.error("Non-Ethereum browser detected. Please install MetaMask.");
      setErrorMessage("Please install MetaMask to use this dApp.");
      setLoading(false);
    }
  }, []);

  const handlePurchase = async (ebookId, price) => {
    try {
      const priceInWei = parseEther(price.toString()); // Convert price to Wei

      // Proceed with purchasing the eBook
      const transactionHash = await purchaseEbook(ebookId, priceInWei, account);
      alert(
        `eBook purchased successfully! Transaction Hash: ${transactionHash}`
      );
    } catch (error) {
      console.error("Error purchasing eBook: ", error);
      setErrorMessage("Error purchasing eBook: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="shop-page">
      <h1 className="text-3xl font-bold mb-6">Shop eBooks</h1>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ebooks.length > 0 ? (
          ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="ebook-card bg-white p-4 shadow-md rounded-lg"
            >
              <h2 className="text-xl font-bold">{ebook.title}</h2>
              <p>Author: {ebook.author}</p>
              <p>Price: {formatEther(ebook.price)} ETH</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handlePurchase(ebook.id, ebook.price)}
              >
                Buy Now
              </button>
            </div>
          ))
        ) : (
          <p>No eBooks available for purchase at this time.</p>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
