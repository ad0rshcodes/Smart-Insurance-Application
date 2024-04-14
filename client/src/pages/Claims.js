import io from 'socket.io-client';
import { xrpl } from 'xrpl';  // Assuming you're using an NPM package for XRPL

// Socket connection for server communication
const socket = io('http://127.0.0.1:5000');

// Function to submit the insurance policy purchase and initiate payment
async function submitPurchase(policyId) {
    const policyDetails = getPolicyDetails(policyId);
    if (!policyDetails) {
        console.error('Policy details not found.');
        return;
    }

    try {
        // Simulate fetching user's wallet details linked previously
        const userWallet = getUserWalletDetails(); 
        const xrplClient = new xrpl.Client("wss://s1.ripple.com"); // Connect to XRPL public server
        await xrplClient.connect();

        // Prepare the transaction
        const preparedTx = await xrplClient.autofill({
            "TransactionType": "Payment",
            "Account": userWallet.address,
            "Amount": xrpl.xrpToDrops(policyDetails.price),  // Convert XRP to drops
            "Destination": policyDetails.payeeAddress
        });

        // Sign the transaction
        const signedTx = xrplClient.sign(preparedTx, userWallet.secret);

        // Submit the transaction
        const txResult = await xrplClient.submitAndWait(signedTx.tx_blob);
        console.log(txResult);

        // Emit confirmation result to the server
        socket.emit('purchase_confirmation', {
            policyId: policyId,
            transactionId: txResult.transaction.hash,
            status: txResult.result.meta.TransactionResult
        });

        if (txResult.result.meta.TransactionResult === 'tesSUCCESS') {
            alert('Payment successful and policy confirmed!');
        } else {
            throw new Error('Transaction failed with status: ' + txResult.result.meta.TransactionResult);
        }
    } catch (error) {
        console.error('Error during XRPL transaction:', error);
        alert('Failed to process payment: ' + error.message);
    }
}

// Helper functions
function getPolicyDetails(policyId) {
    // This would typically fetch policy details from the backend or a local store
    return sample_policies.find(p => p.id === policyId);
}

function getUserWalletDetails() {
    // Fetch and return user's linked wallet details
    return { address: 'rEXAMPLEADDRESS', secret: 'sEXAMPLESECRET' };
}

document.getElementById('confirmPurchaseBtn').addEventListener('click', function() {
    const policyId = document.getElementById('policyIdInput').value;
    submitPurchase(policyId);
});
