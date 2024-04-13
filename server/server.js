const express = require('express');
const xrpl = require('xrpl');

const app = express();
app.use(express.json()); // For parsing application/json

// POST endpoint to handle the claim action
app.post('/claim', async (req, res) => {
    const { fromAddress, secret, toAddress, amount } = req.body;

    try {
        const result = await processXRPTransaction(fromAddress, secret, toAddress, amount);
        res.json({ success: true, message: 'Transaction completed successfully.', details: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process transaction', error: error.message });
    }
});

// Function to process XRP transactions
async function processXRPTransaction(fromAddress, secret, toAddress, amount) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    const wallet = xrpl.Wallet.fromSeed(secret);

    const payment = {
        "TransactionType": "Payment",
        "Account": fromAddress,
        "Destination": toAddress,
        "Amount": xrpl.xrpToDrops(amount),
        "Fee": "12"
    };

    const prepared = await client.autofill(payment);
    const signed = wallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    await client.disconnect();
    return result;
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
