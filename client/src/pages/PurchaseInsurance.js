import { Client, Wallet, xrpToDrops } from 'xrpl';

async function buyInsurance(policyDetails, customerWallet) {
    const client = new Client("wss://s.altnet.rippletest.net:51233"); // Connect to the XRPL test net
    await client.connect();

    try {
        // Prepare the payment transaction
        const payment = {
            TransactionType: "Payment",
            Account: customerWallet.classicAddress,
            Amount: xrpToDrops(policyDetails.price), // Convert XRP to drops
            Destination: policyDetails.insuranceProviderAddress,
            Fee: "12", // Set the transaction fee (in drops)
            Sequence: await client.nextSequenceNumber(customerWallet.classicAddress)
        };

        // Sign the transaction
        const signed = customerWallet.sign(payment);

        // Submit the transaction
        const result = await client.submitAndWait(signed.tx_blob);
        console.log(result);

        if (result.result.meta.TransactionResult === "tesSUCCESS") {
            console.log("Insurance purchased successfully!");
            return true;
        } else {
            console.error("Failed to purchase insurance:", result.result.meta.TransactionResult);
            return false;
        }
    } catch (error) {
        console.error("Error purchasing insurance:", error);
        return false;
    } finally {
        await client.disconnect();
    }
}

// Example usage
const customerWallet = Wallet.fromSeed('s...');
const policyDetails = {
    price: "10", // XRP
    insuranceProviderAddress: 'r...'
};

buyInsurance(policyDetails, customerWallet).then(purchased => {
    if (purchased) {
        console.log("Insurance purchase confirmed!");
    } else {
        console.log("Insurance purchase failed.");
    }
});
