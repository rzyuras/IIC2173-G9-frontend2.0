import axios from 'axios';

const BASE_URL = 'https://mq50pywwrh.execute-api.us-east-2.amazonaws.com/prod2';

export const getAllFlights = async (token, filters = {}, pageNumber = 1) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const params = new URLSearchParams({
            ...filters,
            page: pageNumber.toString(),
            count: '25'  // Assuming each page contains 25 flights; adjust as needed
        }).toString();
        
        const response = await axios.get(`${BASE_URL}/flights/?${params}`, { headers });
        console.log("API Response:", response.data);  // Log the full API response
        if (response.data.flights && Array.isArray(response.data.flights)) {
            console.log("Flights Array:", response.data.flights);  // Confirming it's an array
            return response.data.flights;  // Return just the flights array
        } else {
            console.error("Error: Flights data is not an array!");
            return [];  // Return an empty array as a fallback
        }
    } catch (error) {
        console.error("Failed to fetch flights:", error);
        return [];  // Return an empty array on error
    }
}

export const getFlightDetails = async (token, flightId) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await axios.get(`${BASE_URL}/flights/${flightId}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}
