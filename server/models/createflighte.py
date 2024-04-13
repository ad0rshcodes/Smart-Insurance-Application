import json
import random
import uuid
from datetime import datetime, timedelta

def generate_random_date():
    start_date = datetime.strptime("2023-06-01", "%Y-%m-%d")
    random_date = start_date + timedelta(days=random.randint(0, 29))  # Corrected to ensure 30 days range including start
    return random_date.strftime("%Y-%m-%d")

def generate_flight_data():
    airports = ['JFK', 'LAX', 'CDG', 'LHR', 'DXB', 'HND']
    airlines = ['AA', 'DL', 'BA', 'EK', 'LH']
    origin = random.choice(airports)
    destination = random.choice([ap for ap in airports if ap != origin])
    airline_code = random.choice(airlines)
    flight_number = f"{airline_code}{random.randint(100, 999)}"
    flight_date = generate_random_date()
    booking_id = str(uuid.uuid4())

    flight_offers = [{
        'id': str(uuid.uuid4()),
        'source': 'GDS',
        'instantTicketingRequired': False,
        'nonHomogeneous': False,
        'oneWay': random.choice([True, False]),
        'lastTicketingDate': (datetime.strptime(flight_date, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d"),
        'numberOfBookableSeats': random.randint(1, 10),
        'itineraries': [{
            'duration': 'PT' + str(random.randint(5, 15)) + 'H' + str(random.randint(0, 59)) + 'M',
            'segments': [{
                'departure': {
                    'iataCode': origin,
                    'terminal': str(random.randint(1, 5)),
                    'at': f"{flight_date}T{random.randint(10, 12)}:00:00"
                },
                'arrival': {
                    'iataCode': destination,
                    'terminal': str(random.randint(1, 5)),
                    'at': f"{flight_date}T{random.randint(18, 20)}:00:00"
                },
                'carrierCode': airline_code,
                'number': flight_number,
                'aircraft': {'code': '773'},
                'operating': {'carrierCode': airline_code},
                'duration': 'PT' + str(random.randint(8, 14)) + 'H',
                'id': str(uuid.uuid4()),
                'numberOfStops': random.randint(0, 2),
                'blacklistedInEU': random.choice([True, False])
            }]
        }]
    }]
    price_details = {
        'total': f"{random.randint(200, 1000)}.00",
        'currency': 'USD'
    }
    statuses = ['Cancelled', 'Scheduled', 'Delayed']
    status = random.choice(statuses)
    cancellation_reason = random.choice(['Weather conditions', 'Technical issues']) if status == 'Cancelled' else ""

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

    try:
        with open('fake_flight_data.json', 'w') as f:
            json.dump(flight_data, f, indent=4)
    except Exception as e:
        print(f"Failed to write to file: {e}")

    return booking_id

def main():
    booking_id = generate_flight_data()
    print(f"Generated fake flight order with booking ID: {booking_id}")

if __name__ == "__main__":
    main()
