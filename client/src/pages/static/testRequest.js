import io from 'socket.io-client';

// Create a connection to your server
const socket = io('http://127.0.0.1:5000');

function postClaim() {
    // Emit 'check_claim' event with confirmation number
    socket.emit('check_claim', {
        confirmation_number: "a4170c47-9f86-4582-9844-39e63a06d82e"
    });

    // Listen for 'claim_result' from the server
    socket.once('claim_result', (data) => {
        console.log('Claim result:', data);
        if (data.reimbursementStatus === "Reimbursement Approved") {
            alert("Reimbursement is approved for this ticket.");
        } else {
            alert("No reimbursement necessary for this ticket.");
        }
    });

    // Listen for any error messages sent from the server
    socket.once('response', (error) => {
        console.error('Error from server:', error);
    });
}

function checkReimbursementEligibility() {
    const confNumber = document.getElementById('confNumber').value; // Assuming an input field with ID 'confNumber'
    if (confNumber) {
        // Emit 'check_reimbursement' event with confirmation number
        socket.emit('check_reimbursement', { confirmation_number: confNumber });

        // Listen for the reimbursement check result from the server
        socket.once('reimbursement_check_result', (response) => {
            if (response.error) {
                console.error('Error:', response.error);
                alert(response.error);
            } else {
                console.log('Reimbursement needed:', response.canBeReimbursed);
                alert("Reimbursement eligibility: " + (response.canBeReimbursed ? "Approved" : "Not approved"));
            }
        });
    } else {
        alert('Please enter a confirmation number.');
    }
}

// Call the function to start the claim process
postClaim();

// Optionally, bind the reimbursement check to a button or another event
document.getElementById('checkReimbursementButton').addEventListener('click', checkReimbursementEligibility);
