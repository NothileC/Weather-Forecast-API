// Import the necessary libraries
const cors = require('cors');
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');


// Load environment variables from a .env file into process.env
dotenv.config();


// Create an Express application
const app = express();
const port = 3001;


// Use CORS middleware
app.use(cors());
// Retrieve the OpenWeatherMap API key from environment variables
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;


/**
 * GET /weather
 *
 * This endpoint returns the current weather for a given city.
 * The city name is provided as a query parameter.
 *
 * Example: GET /weather?city=London
 */
app.get('/weather', async (req, res) => {
    // Extract the 'city' query parameter from the request
    const city = req.query.city;


    // If no city is provided, send a 400 Bad Request response
    if (!city) {
        return res.status(400).send("City parameter is required");
    }


    try {
        // Make a request to the OpenWeatherMap API for the specified city
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });


        // Extract relevant data from the API response
        const weatherData = response.data;
        res.json({
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon
        });


    } catch (error) {
        // If an error occurs, log it and send a 500 Internal Server Error response
        console.error("Error retrieving weather data:", error);
        res.status(500).send("Error retrieving weather data");
    }
});


// Start the Express server
app.listen(port, () => {
    console.log(`Weather API listening at http://localhost:${port}`);
});
