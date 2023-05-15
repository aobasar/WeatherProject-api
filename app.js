// Security
require('dotenv').config();

// Import required modules
const express = require('express')
const https = require('node:https')
const bodyParser = require('body-parser')

// Create an Express app
const app = express()
const port = 3001 || process.env.PORT

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define a route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + "/style.css")
})

// Define a route to handle POST requests
app.post('/', (req, res) => {
    let query = req.body.cityName
    if (query === '') {
        query = 'San Diego'
    }
    const apiKey = process.env.apiKey
    const unit = 'imperial'
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
            res.write(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OpenWeatherMap - Weather Api Demo</title>
                <link rel="stylesheet" href="style.css" />
            </head>
            <body>`);
            res.write('<div class="result">')
            res.write('🌡️ The temperature in <h1>' + weatherCity + '<img border="0" valign="middle" src="' + weatherIcon + '">' + temp + '° Fahrenheit')
            res.write('</h1><h2>The weather is currently ' + weatherDescription + '</h2>')
            res.write(' <input type="button" class="back" value="👈" onclick="history.back()">')
            res.write(`</div></body></html>`);
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
