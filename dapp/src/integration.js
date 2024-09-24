import Web3 from "web3";
import axios from "axios";
import abi from "./abi/abi.json"; // Adjust the path if necessary

// Smart contract address (Replace with your contract's address)
const contractAddress = "0xd54cb54e0daF0dB6D7d27F618e8Fd84106eaA901";

// Create a Web3 instance connected to the user's Ethereum wallet
const web3 = new Web3(window.ethereum);

// Initialize the contract with ABI and contract address
const ebookMarketplace = new web3.eth.Contract(abi, contractAddress);

// Pinata API credentials for IPFS uploads
const pinataApiKey = "f3843a194d7de233892f";
const pinataApiSecret =
  "a61050e82584b678744dafc64f2989dccca401546ac92bcdda5bc53127fcafca";
const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";

/**
 * Function to upload a file to Pinata (IPFS) and return the IPFS hash
 * @param {File} file - The file to be uploaded to IPFS
 * @returns {string} - The IPFS hash of the uploaded file
 */
const uploadFileToPinata = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(pinataEndpoint, formData, {
      maxBodyLength: Infinity,
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataApiSecret,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.IpfsHash; // Return the IPFS hash
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw error;
  }
};

/**
 * Function to upload an eBook to the blockchain with metadata stored on IPFS
 * @param {string} title - Title of the eBook
 * @param {string} author - Author of the eBook
 * @param {string} price - Price of the eBook in Wei (Ether unit)
 * @param {File} file - The eBook file to upload
 */
export const uploadEbook = async (title, author, price, file) => {
  try {
    // Upload file to IPFS and get the hash
    const ipfsHash = await uploadFileToPinata(file);

    // Get the user's Ethereum account address
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Upload eBook metadata to the blockchain
    const result = await ebookMarketplace.methods
      .uploadEbook(title, author, price, ipfsHash)
      .send({
        from: accounts[0],
      });

    return result; // Return the transaction result
  } catch (error) {
    console.error("Error uploading eBook:", error);
    throw error;
  }
};

/**
 * Function to purchase an eBook by its ID
 * @param {number} ebookId - The ID of the eBook to purchase
 */
export const purchaseEbook = async (ebookId) => {
  try {
    // Get the user's Ethereum account address
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Get eBook price from the contract
    const ebook = await ebookMarketplace.methods.ebooks(ebookId).call();

    // Purchase the eBook by sending the transaction
    const result = await ebookMarketplace.methods.purchaseEbook(ebookId).send({
      from: accounts[0],
      value: ebook.price, // Send the amount in Wei (Ether)
    });

    return result; // Return the transaction result
  } catch (error) {
    console.error("Error purchasing eBook:", error);
    throw error;
  }
};

/**
 * Function to view an eBook by its ID (retrieves the IPFS hash)
 * @param {number} ebookId - The ID of the eBook to view
 * @returns {string} - The IPFS hash of the eBook file
 */
export const viewEbook = async (ebookId) => {
  try {
    // Get the user's Ethereum account address
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Retrieve the IPFS hash of the eBook from the contract
    const ipfsHash = await ebookMarketplace.methods
      .viewEbook(ebookId)
      .call({ from: accounts[0] });

    return ipfsHash; // Return the IPFS hash of the eBook
  } catch (error) {
    console.error("Error viewing eBook:", error);
    throw error;
  }
};

/**
 * Function to get the list of available eBooks from the contract
 * @returns {Array} - The list of eBooks with their metadata
 */
export const getEbooks = async () => {
  try {
    // Get the total number of eBooks available
    const ebookCount = await ebookMarketplace.methods.ebookCount().call();

    let books = [];
    for (let i = 1; i <= ebookCount; i++) {
      const ebook = await ebookMarketplace.methods.ebooks(i).call();
      books.push(ebook);
    }

    return books; // Return the list of eBooks
  } catch (error) {
    console.error("Error fetching eBooks:", error);
    throw error;
  }
};
