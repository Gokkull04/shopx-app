import React, { useState } from "react";
import { uploadEbook } from "../integration"; // Adjust the path if necessary
import Web3 from "web3"; // Add this line if Web3 is used in this file

const SellingPage = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await uploadEbook(title, author, price, file);
      // Handle successful upload (e.g., show a success message)
    } catch (error) {
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price in Wei"
        required
      />
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Upload Ebook</button>
    </form>
  );
};

export default SellingPage;
