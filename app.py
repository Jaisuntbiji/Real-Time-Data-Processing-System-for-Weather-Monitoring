from flask import Flask, render_template
import requests
import time
from threading import Thread
from collections import defaultdict

app = Flask(__name__)

# OpenWeatherMap API configuration
API_KEY = 'c997d98c6dae5009377ab0ff39c9c51a'  # Replace with your OpenWeatherMap API key
CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad']
WEATHER_DATA = {}
DAILY_SUMMARY = defaultdict(lambda: defaultdict(list))  # To hold daily weather data

# Function to fetch weather data
def fetch_weather_data():
    while True:
        for city in CITIES:
            try:
                url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}'
                response = requests.get(url)
                data = response.json()

                if response.status_code == 200:
                    main = data['weather'][0]['main']
                    temp = data['main']['temp'] - 273.15  # Convert Kelvin to Celsius
                    feels_like = data['main']['feels_like'] - 273.15
                    dt = data['dt']

                    # Store the data
                    WEATHER_DATA[city] = {
                        'main': main,
                        'temp': round(temp, 2),
                        'feels_like': round(feels_like, 2),
                        'dt': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(dt))
                    }

                    # Roll up data for daily summary
                    date_key = time.strftime('%Y-%m-%d', time.localtime(dt))
                    DAILY_SUMMARY[date_key][city].append((temp, main))
                else:
                    print(f"Error fetching data for {city}: {data['message']}")

            except Exception as e:
                print(f"Error fetching data for {city}: {str(e)}")
        
        time.sleep(5)  # Wait for 5 minutes

# Start a background thread to fetch weather data
Thread(target=fetch_weather_data, daemon=True).start()

@app.route('/')
def index():
    return render_template('index.html', weather_data=WEATHER_DATA)

@app.route('/daily_summary')
def daily_summary():
    # Calculate daily aggregates
    summary = []
    for date, cities in DAILY_SUMMARY.items():
        for city, weather_data in cities.items():
            temps = [data[0] for data in weather_data]
            dominant_condition = max(set([data[1] for data in weather_data]), key=[data[1] for data in weather_data].count)
            average_temp = sum(temps) / len(temps)
            max_temp = max(temps)
            min_temp = min(temps)

            summary.append({
                'date': date,
                'city': city,
                'average_temp': round(average_temp, 2),
                'max_temp': max_temp,
                'min_temp': min_temp,
                'dominant_condition': dominant_condition
            })
            
    return render_template('daily_summary.html', summary=summary)

if __name__ == '__main__':
    app.run(debug=True)
