import React, { useEffect, useState } from "react";
import { web3, loadEbooksFromBlockchain, purchaseEbook } from "../integration"; // Make sure paths are correct
import { formatEther, parseEther } from "ethers"; // Adjust imports for ethers.js

const ShopPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Get user's Ethereum account
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        // Load all eBooks from the blockchain
        const books = await loadEbooksFromBlockchain();
        setEbooks(books);
        setLoading(false);
      } catch (error) {
        console.error("Error loading blockchain data: ", error);
        setLoading(false);
      }
    };

    if (window.ethereum) {
      loadBlockchainData();
    } else {
      console.error("Non-Ethereum browser detected. Install MetaMask.");
    }
  }, []);

  const handlePurchase = async (ebookId, price) => {
    try {
      // Convert price to a string before passing to parseEther
      const priceInWei = parseEther(price.toString()); // Ensure price is a string

      // Estimate gas for the purchase transaction
      const estimatedGas = await web3.eth.estimateGas({
        from: account,
        to: "0xca17FCd6Da778275A2cF72E85487005b7d6F3507", // Replace with your contract address
        value: priceInWei,
      });

      // Calculate the gas price
      const gasPrice = await web3.eth.getGasPrice();
      const totalCost = priceInWei.add(estimatedGas * gasPrice); // Total cost in wei

      // Get user's balance
      const balance = await web3.eth.getBalance(account);
      if (parseFloat(balance) < parseFloat(totalCost)) {
        setErrorMessage(
          "Insufficient funds to cover eBook price and gas fees."
        );
        return;
      }

      // Proceed with purchasing the eBook
      await purchaseEbook(ebookId, priceInWei, account);
      alert("eBook purchased successfully!");
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
