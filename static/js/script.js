async function fetchWeather() {
    const response = await fetch('/api/weather');
    const weatherData = await response.json();
    
    const weatherInfoDiv = document.getElementById('weather-data');
    weatherInfoDiv.innerHTML = '';  // Clear previous data

    for (const location in weatherData) {
        const data = weatherData[location];
        if (data.error) {
            weatherInfoDiv.innerHTML += `<p>${data.error}</p>`;
        } else {
            weatherInfoDiv.innerHTML += `
                <h3>${location}</h3>
                <p>Temperature: ${data.temp} °C</p>
                <p>Feels Like: ${data.feels_like} °C</p>
                <p>Condition: ${data.condition}</p>
            `;
        }
    }
}

// Set user-configurable temperature threshold
const TEMP_THRESHOLD = 35; // Example threshold in Celsius
let consecutiveAlerts = 0; // Count of consecutive alerts

// Request permission for notifications
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Function to show notification
function showNotification(city, temp) {
    if (Notification.permission === "granted") {
        new Notification(`Alert! ${city} temperature is ${temp}°C`, {
            body: "Temperature exceeds the configured threshold!",
            icon: "path/to/icon.png" // Add a relevant icon path
        });
    }
}

// Example function to check weather data and trigger alerts
function checkWeatherData() {
    // This function should be called after fetching new weather data
    Object.keys(weatherData).forEach(city => {
        const data = weatherData[city];
        if (data.temp > TEMP_THRESHOLD) {
            consecutiveAlerts++;
            showNotification(city, data.temp);
            if (consecutiveAlerts >= 2) {
                console.log(`Alert: ${city} has exceeded the temperature threshold for ${consecutiveAlerts} consecutive updates.`);
            }
        } else {
            consecutiveAlerts = 0; // Reset count if below threshold
        }
    });
}

// Call this function after updating the weather data
setInterval(() => {
    // Assume fetchWeatherData updates the weatherData object
    fetchWeatherData().then(() => {
        checkWeatherData();
    });
}, 5000); // Call every 5 seconds

setTimeout(() => {
    location.reload();
}, 5000);

// Fetch weather data on page load
document.addEventListener('DOMContentLoaded', fetchWeather);
