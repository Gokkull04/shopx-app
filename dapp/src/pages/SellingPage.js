// src/pages/SellingPage.js
import React, { useState } from "react";
import { uploadFileToPinata } from "../utils/pinataUpload"; // Import Pinata upload function

const SellingPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      alert("Please upload a PDF file.");
      return;
    }

    try {
      // Upload PDF file to Pinata
      const hash = await uploadFileToPinata(pdfFile);
      setIpfsHash(hash);

      // Save eBook details to local storage
      const newEbook = {
        title,
        author,
        price,
        ipfsHash: hash,
      };

      const storedEbooks = JSON.parse(localStorage.getItem("ebooks")) || [];
      storedEbooks.push(newEbook);
      localStorage.setItem("ebooks", JSON.stringify(storedEbooks));

      alert("File uploaded successfully! IPFS Hash: " + hash);
    } catch (error) {
      alert("Error uploading file to Pinata.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Sell Your eBook</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              eBook Title
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              eBook Author
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Price
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Upload eBook (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              className="w-full p-2 border border-gray-300 rounded-lg"
              onChange={(e) => setPdfFile(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Upload and Sell
          </button>
        </form>

        {ipfsHash && (
          <div className="mt-8 bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-semibold">Uploaded File IPFS Hash:</p>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {ipfsHash}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellingPage;
