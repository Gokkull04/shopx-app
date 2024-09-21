import React, { useState, useEffect } from "react";
import {
  uploadEbook,
  uploadFileToIPFS,
  initWeb3,
  purchaseEbook,
  getEbookDetails,
  web3,
  ebookContract,
} from "../integration";

const SellingPage = () => {
  const [formValues, setFormValues] = useState({
    title: "",
    author: "",
    price: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ebookList, setEbookList] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      await initWeb3();
      fetchEbookList();
    };
    initialize();
  }, []);

  const fetchEbookList = async () => {
    try {
      const count = await ebookContract.methods.ebookCount().call();
      let ebooks = [];
      for (let i = 0; i < count; i++) {
        const ebook = await getEbookDetails(i);
        ebooks.push(ebook);
      }
      setEbookList(ebooks);
    } catch (error) {
      console.error("Error fetching eBook list:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormValues({
      ...formValues,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { title, author, price, file } = formValues;

    if (!title || !author || !price || !file) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const ipfsHash = await uploadFileToIPFS(file);
      await uploadEbook(title, author, price, ipfsHash);
      alert("Ebook uploaded successfully!");
      setFormValues({
        title: "",
        author: "",
        price: "",
        file: null,
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("There was an error uploading the eBook. Please try again.");
    }

    setLoading(false);
  };

  const handlePurchase = async (ebookId, price) => {
    try {
      await purchaseEbook(ebookId, price);
      alert("Ebook purchased successfully!");
    } catch (error) {
      alert("Error purchasing eBook. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Sell Your eBook</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title:</label>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Author:</label>
          <input
            type="text"
            name="author"
            value={formValues.author}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Price (in ETH):</label>
          <input
            type="number"
            name="price"
            value={formValues.price}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Upload eBook File:</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded ${
            loading && "opacity-50"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload eBook"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Available eBooks</h2>
      <div>
        {ebookList.length > 0 ? (
          <ul>
            {ebookList.map((ebook, index) => (
              <li key={index} className="mb-4">
                <h3 className="text-xl font-bold">{ebook.title}</h3>
                <p>Author: {ebook.author}</p>
                <p>Price: {web3.utils.fromWei(ebook.price, "ether")} ETH</p>
                <button
                  onClick={() => handlePurchase(index, ebook.price)}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Buy eBook
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No eBooks available.</p>
        )}
      </div>
    </div>
  );
};

export default SellingPage;
