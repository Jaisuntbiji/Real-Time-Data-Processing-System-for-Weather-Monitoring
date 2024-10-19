def parse_weather_data(data):
    main = data['main']
    weather = data['weather'][0]
    temp_celsius = main['temp'] - 273.15
    feels_like = main['feels_like'] - 273.15
    condition = weather['main']
    # Store data or trigger alerts
