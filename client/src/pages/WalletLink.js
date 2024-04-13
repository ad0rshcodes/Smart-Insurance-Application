import React, { useState } from "react";
import { Client, validate } from "xrpl";
import "../styles/WalletLink.css";

const WalletLink = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const verifyWalletAddress = (walletAddress) => {
    try {
      const isValidAddress = validate.isValidClassicAddress(walletAddress);
      return isValidAddress;
    } catch (error) {
      console.error("Error verifying wallet address:", error);
      return false;
    }
  };

  const checkWalletOnXRPL = async (walletAddress) => {
    const client = new Client("wss://s1.ripple.com");
    await client.connect();

    try {
      const accountInfo = await client.request({
        command: "account_info",
        account: walletAddress,
      });
      const accountExists = !!accountInfo.result.account_data;
      return accountExists;
    } catch (error) {
      console.error("Error checking wallet on XRPL:", error);
      return false;
    } finally {
      await client.disconnect();
    }
  };

  const handleLinkWallet = async (walletAddress) => {
    // checks if wallet address is valid (syntax)
    /*const isValidAddress = verifyWalletAddress(walletAddress);
    if (!isValidAddress) {
      alert("Invalid XRPL wallet address.");
      return;
    }*/
    // check if wallet exists
    /*const walletExistsOnXRPL = await checkWalletOnXRPL(walletAddress);
    if (!walletExistsOnXRPL) {
      alert("Wallet address not found on the XRPL.");
      return;
    }*/
    // Link the wallet to the user's account in your system
    // Save the wallet address to your database, etc.
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLinkWallet(walletAddress);
  };

  return (
    <body>
      <header>
        <h1>Add Your Wallet</h1>
      </header>
      <div class="container">
        <section class="content">
          <h2>How does it work?</h2>
          <p>
            By adding your wallet, you enable a seamless connection between your
            XRPL wallet and our services. This integration allows for automated
            transactions and verifications directly linked to your account.
            Ensure your wallet supports XRPL to be compatible with our platform.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your XRPL wallet address"
              required
            />
            <button type="submit">Link Wallet</button>
          </form>
        </section>
      </div>
    </body>
  );
};

export default WalletLink;
