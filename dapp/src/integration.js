import Web3 from "web3";
import axios from "axios";
import abi from "./abi/abi.json"; // Adjust the path if necessary

const contractAddress = "0xd54cb54e0daF0dB6D7d27F618e8Fd84106eaA901";
const web3 = new Web3(window.ethereum);
const ebookMarketplace = new web3.eth.Contract(abi, contractAddress);

// Pinata API credentials
const pinataApiKey = "f3843a194d7de233892f";
const pinataApiSecret =
  "a61050e82584b678744dafc64f2989dccca401546ac92bcdda5bc53127fcafca";
const pinataEndpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";

const uploadFileToPinata = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(pinataEndpoint, formData, {
    maxBodyLength: Infinity,
    headers: {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataApiSecret,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.IpfsHash; // Return the IPFS hash
};

export const uploadEbook = async (title, author, price, file) => {
  try {
    const ipfsHash = await uploadFileToPinata(file);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const result = await ebookMarketplace.methods
      .uploadEbook(title, author, price, ipfsHash)
      .send({
        from: accounts[0],
      });

    return result;
  } catch (error) {
    console.error("Error uploading ebook:", error);
    throw error;
  }
};

export const purchaseEbook = async (ebookId) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const ebook = await ebookMarketplace.methods.ebooks(ebookId).call();
  const result = await ebookMarketplace.methods.purchaseEbook(ebookId).send({
    from: accounts[0],
    value: ebook.price,
  });

  return result;
};

export const viewEbook = async (ebookId) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const ipfsHash = await ebookMarketplace.methods
    .viewEbook(ebookId)
    .call({ from: accounts[0] });
  return ipfsHash;
};
