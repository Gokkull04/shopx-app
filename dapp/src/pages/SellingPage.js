// src/pages/SellingPage.js
import React, { useState } from "react";

function SellingPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    pdfFile: null, // Adding PDF file state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData({
        ...formData,
        pdfFile: file,
      });
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.pdfFile) {
      alert("Please upload a PDF file.");
      return;
    }

    // Prepare form data to send
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("author", formData.author);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("pdfFile", formData.pdfFile); // Append PDF file

    // You can now send formDataToSubmit to the server using fetch or axios
    console.log(formDataToSubmit);
    alert("eBook has been listed for sale with the PDF!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Sell Your eBook
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter eBook title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter author name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Set a price"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Describe your eBook"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            List eBook for Sale
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellingPage;
