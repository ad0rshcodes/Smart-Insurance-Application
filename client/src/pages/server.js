const xrpl = require("xrpl");

async function transferXRP(fromAddress, secret, toAddress, amount) {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  // Wallet from the secret to sign transactions
  const wallet = xrpl.Wallet.fromSeed(secret);

  // Prepare the transaction
  const payment = {
    TransactionType: "Payment",
    Account: fromAddress,
    Destination: toAddress,
    Amount: xrpl.xrpToDrops(amount), // Amount in drops (1 XRP = 1,000,000 drops)
  };

  // Autofill the transaction to get the current sequence number for the account
  const preparedTx = await client.autofill(payment);
  // Sign the transaction with the wallet's secret
  const signedTx = wallet.sign(preparedTx);
  // Submit the signed blob to the ledger
  const response = await client.submitAndWait(signedTx.tx_blob);

  // Check for the result in the response
  if (response.result.meta.TransactionResult === "tesSUCCESS") {
    console.log(`Transaction succeeded: ${response.result.tx_json.hash}`);
  } else {
    console.log(
      `Transaction failed: ${response.result.meta.TransactionResult}`
    );
  }

  await client.disconnect();
}

module.exports = { transferXRP };

