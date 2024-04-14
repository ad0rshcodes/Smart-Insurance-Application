const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

// Base URLs
const BASE_URL_V1 = "https://test.api.amadeus.com/v1";
const BASE_URL_V2 = "https://test.api.amadeus.com/v2";

async function getAccessToken() {
  try {
    const response = await fetch(`${BASE_URL_V1}/security/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: API_KEY,
        client_secret: API_SECRET,
        grant_type: "client_credentials",
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to obtain access token:", error);
    return null;
  }
}

async function loadFakeFlightData(confirmationNumber) {
  try {
    const response = await fetch("fake_flight_data.json");
    const flightData = await response.json();
    if (flightData.confirmation_number === confirmationNumber) {
      return flightData;
    }
  } catch (error) {
    console.error("Error loading fake flight data:", error);
    return null;
  }
}

async function flightStatus(flightNumber, airlineCode, date, token) {
  const url = `${BASE_URL_V2}/schedule/flights`;
  const params = new URLSearchParams({
    carrierCode: airlineCode,
    flightNumber: flightNumber,
    scheduledDepartureDate: date,
  });
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await fetch(`${url}?${params}`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch flight status:", error);
    return {};
  }
}

async function flightDelayPrediction(
  airlineCode,
  flightNumber,
  origin,
  date,
  token
) {
  const url = `${BASE_URL_V1}/travel/predictions/flight-delay`;
  const params = new URLSearchParams({
    carrierCode: airlineCode,
    flightNumber: flightNumber,
    originLocationCode: origin,
    date: date,
  });
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  try {
    const response = await fetch(`${url}?${params}`, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch flight delay prediction:", error);
    return {};
  }
}

// Add other functions as needed

export {
  getAccessToken,
  loadFakeFlightData,
  flightStatus,
  flightDelayPrediction,
};
