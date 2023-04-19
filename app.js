// Import required modules
const express = require('express')
const https = require('node:https')
const bodyParser = require('body-parser')

// Create an Express app
const app = express()
const port = 3000

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define a route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

// Define a route to handle POST requests
app.post('/', (req, res) => {
    const query = req.body.cityName
    const apiKey = 'ba24c6018ddd72041749018d0c1b1ef8'
    const unit = 'metric'
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey + '&units=' + unit + '';

    // Make a GET request to the OpenWeatherMap API
    https.get(url, (apiResponse) => {
        console.log(apiResponse.statusCode);

        // Handle the response data
        apiResponse.on("data", function (data) {
            const weatherData = JSON.parse(data)

            // Extract the weather data from the API response
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const weatherCity = weatherData.name
            var weatherIcon = weatherData.weather[0].icon
            weatherIcon = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"

            // Send an HTML response to the client
            res.type('html')
            res.write('<body bgcolor="#f5f5f5">');
            res.write('<img border="1" src="' + weatherIcon + '">');
            res.write('<p>☁️The weather is currently ' + weatherDescription + '</p>')
            res.write('<h1>')
            res.write('🌡️The temperature in ' + weatherCity + ' is ' + temp + ' degrees Celcius')
            res.write('</h1>')
            res.send()
        })

    })

})

// Start the Express app and listen for incoming requests
app.listen(port, () => {
    console.log("Server listening on PORT", port);
})

// List of imported modules
/* 
express
https (native)
json.parse
*/ 
