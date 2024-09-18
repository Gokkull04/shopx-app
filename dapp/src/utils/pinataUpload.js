// src/utils/pinataUpload.js
import axios from "axios";

const pinataApiKey = "f3843a194d7de233892f";
const pinataSecretApiKey =
  "a61050e82584b678744dafc64f2989dccca401546ac92bcdda5bc53127fcafca";

export const uploadFileToPinata = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // Create FormData object and append the file
  let data = new FormData();
  data.append("file", file);

  // Set up the request headers with your Pinata API key
  const pinataHeaders = {
    headers: {
      "Content-Type": `multipart/form-data`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  };

  try {
    // Make the request to Pinata
    const response = await axios.post(url, data, pinataHeaders);
    console.log("IPFS Hash:", response.data.IpfsHash); // Pinata IPFS hash
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw error;
  }
};
