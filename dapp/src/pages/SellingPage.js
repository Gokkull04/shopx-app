import React, { useState } from "react";
import {
  uploadFileToPinata,
  uploadEbookToBlockchain,
  web3, // Ensure web3 is imported here
} from "../integration";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SellEbook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("0.001"); // Set a lower default price in ETH
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    // Validate file size (max 10MB for example)
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("File size must be less than 10MB.");
      setFile(null);
    } else {
      setFile(selectedFile);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !author || !price || !file) {
      setErrorMessage("Please fill in all fields and upload a file.");
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");

      // Upload the file to Pinata and get the IPFS hash
      const ipfsHash = await uploadFileToPinata(file);
      console.log("IPFS Hash:", ipfsHash);

      // Get the user's Ethereum wallet address
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];

      // Estimate gas for the transaction
      const estimatedGas = await web3.eth.estimateGas({
        from: userAddress,
        to: "0xca17FCd6Da778275A2cF72E85487005b7d6F3507", // Replace with your contract address
        value: web3.utils.toWei(price, "ether"), // Amount in wei
      });

      // Calculate the gas price (optional, can be a fixed value too)
      const gasPrice = await web3.eth.getGasPrice();
      const totalCost = estimatedGas * gasPrice; // Total gas cost in wei

      // Get user's balance
      const balance = await web3.eth.getBalance(userAddress);
      if (parseFloat(balance) < totalCost) {
        setErrorMessage("Insufficient funds to cover gas fees.");
        return;
      }

      // Upload eBook metadata to the blockchain
      const result = await uploadEbookToBlockchain(
        title,
        author,
        web3.utils.toWei(price, "ether"), // Convert price to wei
        ipfsHash,
        userAddress
      );
      setTransactionHash(result.transactionHash);

      // Redirect to the Shop page after successful upload
      navigate("/shop"); // Change the path to your shop page
    } catch (error) {
      console.error("Error uploading eBook: ", error);
      setErrorMessage("Error uploading eBook: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-bold mb-6">Sell Your eBook</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter eBook title"
            required
          />
        </div>
        <div>
          <label className="block font-bold">Author</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter eBook author"
            required
          />
        </div>
        <div>
          <label className="block font-bold">Price (in ETH)</label>
          <input
            type="number"
            step="0.0001"
            className="w-full border border-gray-300 p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price in ETH"
            required
          />
        </div>
        <div>
          <label className="block font-bold">Upload eBook File</label>
          <input
            type="file"
            className="w-full p-2"
            onChange={handleFileChange}
            required
          />
        </div>
        {errorMessage && (
          <div className="text-red-500 font-bold">{errorMessage}</div>
        )}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Sell eBook"}
          </button>
        </div>
      </form>

      {transactionHash && (
        <div className="mt-4">
          <h2 className="font-bold">Transaction Successful!</h2>
          <p>
            Your eBook has been uploaded. Transaction Hash:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`} // Correct network link for Sepolia
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              {transactionHash}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SellEbook;
