from datetime import date
import requests
import os
import json
from flask import Flask
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://127.0.0.1:5500")

# Load environment variables
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
        emit('log', {"message": "Failed to obtain access token"})
        return None

def load_fake_flight_data(confirmation_number):
    """Loads fake flight data from a JSON file by confirmation number."""
    try:
        with open('fake_flight_data.json', 'r') as file:
            flight_data = json.load(file)
        # Assuming the JSON structure directly matches your provided example
        if flight_data['confirmation_number'] == confirmation_number:
            return flight_data
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
        emit('log', {"message": "Failed to fetch flight status"})
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
        emit('log', {"message": "Failed to fetch flight delay prediction"})
        return {}

def check_in_links(airline_code, token):
    """ Retrieves check-in links for the given airline from Amadeus API """
    url = f"{BASE_URL_V2}/reference-data/urls/checkin-links"
    params = {"airlineCode": airline_code}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        emit('log', {"message": "Failed to retrieve check-in links"})
        return {}
def flight_offers_search(origin, destination, departure_date, token):
    """ Searches for flight offers """
    if departure_date < date.today().isoformat():
        emit('log', {"message": "Departure date cannot be in the past."})
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
        emit('log', {"message": "Failed to search for flight offers", "details": response.json()})
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
        emit('log', {"message": "Failed to confirm flight offer price", "details": response.json()})
        return {}

def flight_price_analysis(origin, destination, departure_date, token):
    """ Analyzes flight prices for a specific itinerary """
    if departure_date < date.today().isoformat():
        emit('log', {"message": "Departure date cannot be in the past for price analysis."})
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
        emit('log', {"message": "Failed to analyze flight prices", "details": response.json()})
        return {}
@socketio.on('check_claim')
def handle_check_claim(data):
    """
    Handles claim checks via WebSocket by processing a confirmation number to determine
    if the associated flight data warrants a reimbursement. Emits results back to the client.
    
    Parameters:
        data (dict): Data received from the client, must include 'confirmation_number'.
    
    Emits:
        - 'response': Error message if the required data or conditions aren't met.
        - 'claim_result': The result of the claim check containing details and reimbursement status.
    """
    confirmation_number = data.get('confirmation_number')
    if not confirmation_number:
        emit('response', {"error": "Confirmation number is required"})
        return
    
    token = get_access_token()
    if not token:
        emit('response', {"error": "Failed to authenticate with API provider"})
        return
    
    fake_flight_data = load_fake_flight_data(confirmation_number)
    if not fake_flight_data:
        emit('response', {"error": "No flight data found"})
        return
    
    result = main_check_claim(fake_flight_data)
    emit('claim_result', result)

def main_check_claim(fake_flight_data):
    """
    Determines the reimbursement status based on flight data.
    
    Args:
        fake_flight_data (dict): The flight data loaded from the system.

    Returns:
        dict: A dictionary with detailed flight information and reimbursement status.
    """
    status = fake_flight_data.get('status', 'Active')
    reimbursement_needed = "Reimbursement Approved" if status == 'Cancelled' else "No Reimbursement Needed"
    return {
        "flightDetails": fake_flight_data,
        "reimbursementStatus": reimbursement_needed
    }

@socketio.on('check_reimbursement')
def handle_check_reimbursement(data):
    confirmation_number = data.get('confirmation_number')
    if not confirmation_number:
        emit('reimbursement_check_result', {'error': 'Confirmation number is required'})
        return
    # Load data, assumed to be a function that fetches data based on the confirmation number
    flight_data = load_fake_flight_data(confirmation_number)
    if not flight_data:
        emit('reimbursement_check_result', {'error': 'No flight data found'})
        return
    # Determine if the ticket can be reimbursed
    can_be_reimbursed = flight_data['status'] == 'Cancelled'
    # Emit the result as a boolean
    emit('reimbursement_check_result', {'canBeReimbursed': can_be_reimbursed})
    


@socketio.on('initiate_check')
def handle_initiate_check(data):
    """
    Initiates a comprehensive check of flight data based on a provided confirmation number.
    This includes retrieving and analyzing various aspects of flight details to make informed decisions
    on potential reimbursements and to provide a detailed overview of the flight status to the client.
    
    Parameters:
        data (dict): Data received from the client, must include 'confirmation_number'.
    
    Emits:
        - 'response': Error messages if the required data or conditions aren't met.
        - 'flight_data': Detailed flight information for the client.
        - 'analysis_results': Results from various checks including status and potential delays.
        - 'reimbursement_decision': A summary indicating if reimbursement is required.
    """
    confirmation_number = data.get('confirmation_number')
    if not confirmation_number:
        emit('response', {"error": "No confirmation number provided"})
        return

    token = get_access_token()
    if not token:
        emit('response', {"error": "Failed to obtain an access token."})
        return

    fake_flight_data = load_fake_flight_data(confirmation_number)
    if not fake_flight_data:
        emit('response', {"error": "No flight order found for the given confirmation number."})
        return

    # Emit basic flight data immediately after validation
    emit('flight_data', fake_flight_data)

    # Process further detailed checks
    results = process_flight_checks(fake_flight_data, token)
    emit('analysis_results', results)

    # Determine and emit the final decision on reimbursement
    final_decision = determine_reimbursement(fake_flight_data)
    emit('reimbursement_decision', {"status": final_decision})

def process_flight_checks(flight_data, token):
    """
    Conducts detailed checks on various aspects of flight data such as status, delays, and offers.
    
    Args:
        flight_data (dict): The flight data to be checked.
        token (str): Authentication token for API access.

    Returns:
        dict: Results of various flight-related analyses.
    """
    flight_number = ''.join(filter(str.isdigit, flight_data['flight_number']))
    airline_code = flight_data['airline_code']
    origin = flight_data['flight_offers'][0]['itineraries'][0]['segments'][0]['departure']['iataCode']
    destination = flight_data['flight_offers'][0]['itineraries'][0]['segments'][0]['arrival']['iataCode']
    query_date = max(flight_data['flight_date'], date.today().isoformat())

    # Retrieve flight-related data using various API calls
    status = flight_status(flight_number, airline_code, query_date, token)
    delay_prediction = flight_delay_prediction(airline_code, flight_number, origin, query_date, token)
    check_in_info = check_in_links(airline_code, token)
    offers = flight_offers_search(origin, destination, query_date, token)
    price_details = flight_offers_price(offers['data'][0]['id'], token) if 'data' in offers and offers['data'] else {}
    price_analysis = flight_price_analysis(origin, destination, query_date, token)

    return {
        "Flight Status": status,
        "Delay Prediction": delay_prediction,
        "Check-in Links": check_in_info,
        "Flight Offers": offers,
        "Price Details": price_details,
        "Price Analysis": price_analysis
    }
def determine_reimbursement(flight_data):
    """
    Determines if a flight qualifies for reimbursement based on status and other criteria.
    
    Args:
        flight_data (dict): Data about the flight.

    Returns:
        str: A message indicating whether reimbursement should be issued or not.
    """
    reasons = []
    if flight_data['status'] == 'Cancelled':
        reasons.append('flight cancellation')

    delay_data = flight_data.get('delayPrediction', {}).get('data', [])
    if any(pred.get('probability', 0) > 0.75 for pred in delay_data):
        reasons.append('high probability of significant delay')

    if not flight_data.get('checkInInfo', {}).get('data'):
        reasons.append('no check-in links available, indicating possible operational issues')

    if reasons:
        return "Reimbursement should be issued due to: " + ", ".join(reasons)
    else:
        return "No reimbursement necessary based on the data analyzed."

if __name__ == "__main__":
    socketio.run(app, debug=True)
