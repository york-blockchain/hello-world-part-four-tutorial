import React from "react";
import { useEffect, useState } from "react";
// import {
//   connectWallet,
//   updateMessage,
//   loadCurrentMessage,
//   getCurrentWalletConnected,
// } from "./util/interact.js";
import alchemylogo from "./alchemylogo.svg";
import { Network, Alchemy, Contract } from "alchemy-sdk";


const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: alchemyKey, // Replace with your Alchemy API Key.
  network: Network.ETH_GOERLI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const contractABI = require("./contract-abi.json");
const contractAddress = "0x6f3f635A9762B47954229Ea479b4541eAF402A6A";

const HelloWorld = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage, setNewMessage] = useState("");
  const [helloWorldContractInstance,setHelloWorldContractInstance] = useState();

  // called only once
  useEffect(async () => {
    const ethersProvider = await alchemy.config.getProvider();
    const helloWorldContractInstance = new Contract(contractAddress, contractABI, ethersProvider)
    // const message = await loadCurrentMessage(helloWorldContractInstance);
    setMessage(message);
    // addSmartContractListener();
    setHelloWorldContractInstance(helloWorldContractInstance)
    // const { address, status } = await getCurrentWalletConnected();

    // setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addSmartContractListener() {
    // helloWorldContractInstance.events.UpdatedMessages({}, (error, data) => {
    //   if (error) {
    //     setStatus("😥 " + error.message);
    //   } else {
    //     setMessage(data.returnValues[1]);
    //     setNewMessage("");
    //     setStatus("🎉 Your message has been updated!");
    //   }
    // });
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    // const walletResponse = await connectWallet();
    // setStatus(walletResponse.status);
    // setWallet(walletResponse.address);
  };

  const onUpdatePressed = async () => {
    // const { status } = await updateMessage(helloWorldContractInstance,walletAddress, newMessage);
    setStatus(status);
  };

  //the UI of our component
  return (
    <div id="container">
      <img id="logo" src={alchemylogo}></img>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>

        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
      </div>
    </div>
  );
};

export default HelloWorld;
