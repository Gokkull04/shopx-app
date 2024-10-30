import React, { useState } from "react";
import {
  uploadFileToPinata,
  uploadEbookToBlockchain,
  web3,
} from "../integration";
import { useNavigate } from "react-router-dom";

const SellEbook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("0.001");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
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

      // Upload file to IPFS via Pinata
      const ipfsHash = await uploadFileToPinata(file);
      console.log("IPFS Hash:", ipfsHash);

      // Request user's wallet address
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userAddress = accounts[0];

      // Upload eBook metadata to the blockchain
      const result = await uploadEbookToBlockchain(
        title,
        author,
        web3.utils.toWei(price, "ether"),
        ipfsHash,
        userAddress
      );

      setTransactionHash(result.transactionHash);
      navigate("/shop");
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
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
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
