import Web3 from "web3";
import ebookABI from "./abi/abi.json";
import { create } from "ipfs-http-client";

// Initialize IPFS
const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

// Declare variables for web3 and contract
let web3;
let ebookContract;

// Function to initialize web3 and the contract
export const initWeb3 = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.error(
        "Non-Ethereum browser detected. You should consider using MetaMask!"
      );
      return;
    }

    // Replace with your deployed contract address
    ebookContract = new web3.eth.Contract(ebookABI, "0xYourContractAddress");
  } catch (error) {
    console.error("Error initializing web3:", error);
  }
};

// Function to upload an eBook to IPFS
export const uploadFileToIPFS = async (file) => {
  try {
    const added = await ipfs.add(file);
    return added.path; // Return the IPFS hash
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
};

// Function to upload an eBook to the blockchain
export const uploadEbook = async (title, author, price, ipfsHash) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await ebookContract.methods
      .uploadEbook(title, author, web3.utils.toWei(price, "ether"), ipfsHash)
      .send({ from: accounts[0] });
    console.log("eBook uploaded successfully");
  } catch (error) {
    console.error("Error uploading eBook:", error);
    throw error;
  }
};

// Function to purchase an eBook
export const purchaseEbook = async (ebookId, price) => {
  try {
    const accounts = await web3.eth.getAccounts();
    await ebookContract.methods
      .purchaseEbook(ebookId)
      .send({ from: accounts[0], value: price });
    console.log("eBook purchased successfully");
  } catch (error) {
    console.error("Error purchasing eBook:", error);
    throw error;
  }
};

// Function to get details of an eBook
export const getEbookDetails = async (ebookId) => {
  try {
    const details = await ebookContract.methods.getEbookDetails(ebookId).call();
    return {
      title: details.title,
      author: details.author,
      price: details.price,
      ipfsHash: details.ipfsHash,
      seller: details.seller,
    };
  } catch (error) {
    console.error("Error fetching eBook details:", error);
    throw error;
  }
};

// Export initialized web3 and ebookContract
export { web3, ebookContract };
