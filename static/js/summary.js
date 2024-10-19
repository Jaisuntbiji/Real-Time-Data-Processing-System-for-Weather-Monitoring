document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/daily_summary_data')
    .then(response => response.json())
    .then(data => {
        const summaryTableBody = document.getElementById('summary-table-body');
        data.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.location}</td>
                <td>${entry.avg_temp} °C</td>
                <td>${entry.max_temp} °C</td>
                <td>${entry.min_temp} °C</td>
                <td>${entry.dominant_condition}</td>
            `;
            summaryTableBody.appendChild(row);
        });
    });

    // Fetch alerts if necessary
    fetchWeatherAlerts();
});

function fetchWeatherAlerts() {
    fetch('/api/weather_alerts')
    .then(response => response.json())
    .then(alertData => {
        const alertInfo = document.getElementById('alert-info');
        if (alertData.alert_triggered) {
            alertInfo.innerHTML = `Alert: ${alertData.message}`;
        } else {
            alertInfo.innerHTML = 'No alerts triggered yet.';
        }
    });
}

