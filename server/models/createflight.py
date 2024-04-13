import json
import random
import uuid

def generate_flight_data():
    # Generate basic flight information
    airports = ['JFK', 'LAX', 'CDG', 'LHR', 'DXB', 'HND']
    airlines = ['AA', 'DL', 'BA', 'EK', 'LH']
    origin = random.choice(airports)
    destination = random.choice([ap for ap in airports if ap != origin])
    airline_code = random.choice(airlines)
    flight_number = f"{airline_code}{random.randint(100, 999)}"
    flight_date = "2023-06-01"
    booking_id = str(uuid.uuid4())

    # Simulate flight offer details
    flight_offers = [{
        'id': str(uuid.uuid4()),
        'source': 'GDS',
        'instantTicketingRequired': False,
        'nonHomogeneous': False,
        'oneWay': False,
        'lastTicketingDate': '2023-05-31',
        'numberOfBookableSeats': 9,
        'itineraries': [{
            'duration': 'PT13H37M',
            'segments': [{
                'departure': {
                    'iataCode': origin,
                    'terminal': '1',
                    'at': f"{flight_date}T10:00:00"
                },
                'arrival': {
                    'iataCode': destination,
                    'terminal': '1',
                    'at': f"{flight_date}T20:00:00"
                },
                'carrierCode': airline_code,
                'number': flight_number,
                'aircraft': {
                    'code': '773'
                },
                'operating': {
                    'carrierCode': airline_code
                },
                'duration': 'PT10H',
                'id': str(uuid.uuid4()),
                'numberOfStops': 0,
                'blacklistedInEU': False
            }]
        }]
    }]
    # Simulate price details and analysis
    price_details = {
        'total': '450.00',
        'currency': 'USD'
    }

    # Simulate additional attributes related to flight status
    status = 'Cancelled'  # Or 'Scheduled' depending on the simulation needs
    cancellation_reason = random.choice(['Weather conditions', 'Technical issues']) if status == 'Cancelled' else ""

    # Construct the complete flight data dictionary
    flight_data = {
        'confirmation_number': booking_id,
        'flight_number': flight_number,
        'airline_code': airline_code,
        'flight_date': flight_date,
        'flight_offers': flight_offers,
        'price_details': price_details,
        'status': status,
        'cancellation_reason': cancellation_reason
    }

    # Save to a JSON file to mimic database storage
    with open('fake_flight_data.json', 'w') as f:
        json.dump(flight_data, f, indent=4)
    
    return booking_id

def main():
    booking_id = generate_flight_data()
    print(f"Generated fake flight order with booking ID: {booking_id}")

if __name__ == "__main__":
    main()
