import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { uploadEbook } from "../integration"; // Adjust the path if necessary
import Web3 from "web3"; // Make sure Web3 is imported
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const SellingPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await uploadEbook(title, author, price, file);
      toast.success("Ebook uploaded successfully!"); // Show success message
      navigate("/shop"); // Redirect to the shop page
    } catch (error) {
      toast.error("Error uploading ebook. Please try again."); // Show error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold text-center mb-4">Upload Ebook</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price in Wei"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Upload Ebook
          </button>
        </form>
      </div>
      <ToastContainer /> {/* Include ToastContainer for toast notifications */}
    </div>
  );
};

export default SellingPage;
