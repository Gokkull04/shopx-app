import Web3 from "web3";
import axios from "axios";
import abi from "./abi/abi.json"; // Adjust the path if necessary

// Smart contract address (replace with your deployed contract's address)
const contractAddress = "0xA8f5250Ad95D2Fb615CeA919eFC6dD626A341920";

// Create a Web3 instance connected to the user's Ethereum wallet
export const web3 = new Web3(window.ethereum);

// Initialize the contract with ABI and contract address
export const ebookMarketplace = new web3.eth.Contract(abi, contractAddress);

// Pinata API credentials for IPFS uploads
const pinataApiKey = "397af0dae223c5bd028c";
const pinataApiSecret =
  "ab50151c7c15ec8b45df1d9634f7ada374feb271fa4791e17f2c4184cf39f667";
const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";

// Function to upload a file to Pinata
export const uploadFileToPinata = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(pinataEndpoint, formData, {
    maxContentLength: Infinity,
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataApiSecret,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.IpfsHash; // Return the IPFS hash
};

// Function to upload eBook metadata to the blockchain
export const uploadEbookToBlockchain = async (
  title,
  author,
  price,
  ipfsHash,
  userAddress
) => {
  const priceInWei = Web3.utils.toWei(price.toString(), "ether"); // Ensure price is in Wei
  const result = await ebookMarketplace.methods
    .uploadEbook(title, author, priceInWei, ipfsHash)
    .send({ from: userAddress });
  return result; // Return the transaction result
};

// Function to load eBooks from the blockchain
export const loadEbooksFromBlockchain = async () => {
  const ebookCount = await ebookMarketplace.methods.ebookCount().call();
  const ebooks = [];

  for (let i = 1; i <= ebookCount; i++) {
    const ebook = await ebookMarketplace.methods.getEbookDetails(i).call();
    ebooks.push({
      id: i,
      title: ebook.title,
      author: ebook.author,
      price: Web3.utils.fromWei(ebook.price, "ether"), // Convert price from Wei to Ether
      owner: ebook.owner,
    });
  }

  return ebooks; // Return the array of eBooks
};

// Function to purchase an eBook
export const purchaseEbook = async (ebookId, price, userAddress) => {
  const priceInWei = Web3.utils.toWei(price.toString(), "ether"); // Ensure price is in Wei
  const transaction = await ebookMarketplace.methods
    .purchaseEbook(ebookId)
    .send({ from: userAddress, value: priceInWei });

  return transaction; // Return the transaction details
};

// Function to load purchased books for a user
export const loadPurchasedBooks = async (userAddress) => {
  const purchasedBooks = await ebookMarketplace.methods
    .getPurchasedBooks(userAddress)
    .call();
  const ebooks = [];

  for (const ebookId of purchasedBooks) {
    const ebook = await ebookMarketplace.methods
      .getEbookDetails(ebookId)
      .call();
    ebooks.push({
      id: ebookId,
      title: ebook.title,
      author: ebook.author,
      price: Web3.utils.fromWei(ebook.price, "ether"), // Convert price from Wei to Ether
      owner: ebook.owner,
    });
  }

  return ebooks; // Return the array of purchased eBooks
};

// Function to retrieve the IPFS hash of a purchased eBook
export const getEbookIPFSHash = async (ebookId, userAddress) => {
  const ipfsHash = await ebookMarketplace.methods
    .getEbookIPFSHash(ebookId)
    .call({ from: userAddress });
  return ipfsHash; // Return the IPFS hash
};
