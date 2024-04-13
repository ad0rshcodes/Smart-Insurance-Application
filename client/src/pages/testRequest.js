import axios from "axios";

async function postClaim() {
  try {
    const response = await axios.post("http://127.0.0.1:5000/api/check-claim", {
      confirmation_number: "a4170c47-9f86-4582-9844-39e63a06d82e",
    });
    console.log(response.data);
  } catch (error) {
    console.error(
      "Error making request:",
      error.response ? error.response.data : error.message
    );
  }
}

postClaim();
