// src/pages/SellingPage.js
import React, { useState } from "react";
import { uploadFileToPinata } from "../utils/pinataUpload"; // Import Pinata upload function
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const SellingPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      toast.error("Please upload a PDF file."); // Display error toast
      return;
    }

    try {
      // Upload PDF file to Pinata
      const ipfsHash = await uploadFileToPinata(pdfFile);

      // Log IPFS hash in the console
      console.log("Uploaded IPFS Hash:", ipfsHash);

      // Save eBook details to local storage
      const newEbook = {
        title,
        author,
        price,
        ipfsHash, // Store the IPFS hash
      };

      const storedEbooks = JSON.parse(localStorage.getItem("ebooks")) || [];
      storedEbooks.push(newEbook);
      localStorage.setItem("ebooks", JSON.stringify(storedEbooks));

      // Show success toast
      toast.success("eBook successfully registered for selling!");

      // Optionally navigate to the shop page after successful submission
      setTimeout(() => {
        navigate("/shop");
      }, 2000); // Navigate after 2 seconds
    } catch (error) {
      toast.error("Error uploading file to Pinata.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sell Your eBook</h1>
        <button
          onClick={() => navigate("/shop")}
          className="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-200"
        >
          Go to Shop
        </button>
      </nav>

      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
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
      </div>

      {/* Toastify container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default SellingPage;
