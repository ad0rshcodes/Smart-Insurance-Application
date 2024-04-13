from datetime import date
import requests
import os
import json

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv('API_KEY')
API_SECRET = os.getenv('API_SECRET')

# Base URLs
BASE_URL_V1 = "https://test.api.amadeus.com/v1"
BASE_URL_V2 = "https://test.api.amadeus.com/v2"

def get_access_token():
    """ Retrieves an access token from Amadeus API """
    url = f"{BASE_URL_V1}/security/oauth2/token"
    payload = {
        "client_id": API_KEY,
        "client_secret": API_SECRET,
        "grant_type": "client_credentials"
    }
    response = requests.post(url, data=payload)
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        print("Failed to obtain access token")
        return None

def load_fake_flight_data(confirmation_number):
    """ Loads fake flight data from a JSON file by confirmation number """
    try:
        with open('fake_flight_data.json', 'r') as file:
            flight_data = json.load(file)
        
        # Check if flight_data is a list of flights or a single flight dictionary
        if isinstance(flight_data, dict):  # If it's a single dictionary
            if flight_data['confirmation_number'] == confirmation_number:
                return flight_data
        elif isinstance(flight_data, list):  # If it's a list of dictionaries
            for flight in flight_data:
                if flight['confirmation_number'] == confirmation_number:
                    return flight

        print("No matching flight found for the given confirmation number.")
        return None
    except FileNotFoundError:
        print("Flight data file not found.")
        return None
    except json.JSONDecodeError:
        print("Error decoding JSON from the file.")
        return None
    except KeyError:
        print("Invalid data format in JSON file.")
        return None

def flight_status(flight_number, airline_code, date, token):
    """ Fetches the flight status """
    url = f"{BASE_URL_V2}/schedule/flights"
    params = {
        'carrierCode': airline_code,
        'flightNumber': flight_number,
        'scheduledDepartureDate': date
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to fetch flight status:", response.json())
        return {}
def flight_delay_prediction(airline_code, flight_number, origin, date, token):
    url = f"{BASE_URL_V1}/travel/predictions/flight-delay"
    params = {
        'carrierCode': airline_code,
        'flightNumber': flight_number,
        'originLocationCode': origin,
        'date': date
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to fetch flight delay prediction:", response.json())
        return {}


def extract_numeric_flight_number(flight_number):
    import re
    numeric_part = re.findall(r'\d+', flight_number)
    return numeric_part[0] if numeric_part else None


def check_in_links(airline_code, token):
    """ Retrieves check-in links for the given airline from Amadeus API """
    url = f"{BASE_URL_V2}/reference-data/urls/checkin-links"
    params = {"airlineCode": airline_code}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to retrieve check-in links:", response.json())
        return {}

def flight_offers_search(origin, destination, departure_date, token):
    """ Searches for flight offers """
    if departure_date < date.today().isoformat():
        print("Departure date cannot be in the past.")
        return {}
    url = f"{BASE_URL_V2}/shopping/flight-offers"
    params = {
        'originLocationCode': origin,
        'destinationLocationCode': destination,
        'departureDate': departure_date,
        'adults': 1
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to search for flight offers:", response.json())
        return {}

def flight_offers_price(offer_id, token):
    """ Confirms the price for the selected flight offer """
    url = f"{BASE_URL_V1}/shopping/flight-offers/pricing"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"data": {"type": "flight-offers-pricing", "flightOffers": [{"id": offer_id}]}}
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to confirm flight offer price:", response.json())
        return {}

def flight_price_analysis(origin, destination, departure_date, token):
    """ Analyzes flight prices for a specific itinerary """
    if departure_date < date.today().isoformat():
        print("Departure date cannot be in the past for price analysis.")
        return {}
    url = f"{BASE_URL_V1}/analytics/itinerary-price-metrics"
    params = {
        'originIATA': origin,
        'destinationIATA': destination,
        'departureDate': departure_date
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to analyze flight prices:", response.json())
        return {}

        
def main():
    token = get_access_token()
    if not token:
        print("Failed to obtain an access token.")
        return

    print("Enter the confirmation number for the flight order:")
    confirmation_number = input().strip()
    fake_flight_data = load_fake_flight_data(confirmation_number)

    if not fake_flight_data:
        print("No flight order found for the given confirmation number.")
        return

    # Extract necessary details from fake_flight_data
    flight_number = ''.join(filter(str.isdigit, fake_flight_data['flight_number']))
    flight_date = fake_flight_data['flight_date']
    airline_code = fake_flight_data['airline_code']
    origin = fake_flight_data['flight_offers'][0]['itineraries'][0]['segments'][0]['departure']['iataCode']
    destination = fake_flight_data['flight_offers'][0]['itineraries'][0]['segments'][0]['arrival']['iataCode']
    departure_date = fake_flight_data['flight_date']

    # Adjust date checking for APIs that cannot handle past dates
    today_date = date.today().isoformat()
    query_date = departure_date if departure_date >= today_date else today_date

    # API calls to check real-time status, delay prediction, and other details
    status = flight_status(flight_number, airline_code, query_date, token) if query_date >= today_date else {}
    delay_prediction = flight_delay_prediction(airline_code, flight_number, origin, flight_date, token) if flight_date >= today_date else {}
    check_in_info = check_in_links(airline_code, token)
    offers = flight_offers_search(origin, destination, query_date, token)
    price_details = flight_offers_price(offers['data'][0]['id'], token) if 'data' in offers and offers['data'] else {}
    price_analysis = flight_price_analysis(origin, destination, query_date, token)

    print("Fake Flight Order Details:", fake_flight_data)
    print("Flight Status:", status)
    print("Delay Prediction:", delay_prediction)
    print("Check-in Links:", check_in_info)
    print("Flight Offers:", offers)
    print("Price Details:", price_details)
    print("Price Analysis:", price_analysis)

    should_issue_reimbursement = False
    reasons = []

    if fake_flight_data['status'] == 'Cancelled':
        should_issue_reimbursement = True
        reasons.append('flight cancellation.')

    if delay_prediction.get('data') and any(pred['probability'] > 0.75 for pred in delay_prediction.get('data', [])):
        should_issue_reimbursement = True
        reasons.append('high probability of significant delay.')

    if not check_in_info.get('data'):
        should_issue_reimbursement = True
        reasons.append('no check-in links available, indicating possible operational issues.')

    if should_issue_reimbursement:
        print("Reimbursement should be issued due to: " + ", ".join(reasons))
    else:
        print("No reimbursement necessary based on the data analyzed.")

if __name__ == "__main__":
    main()
