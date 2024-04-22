import axios from 'axios';

const BASE_URL = 'https://wtfmzvwh4b.execute-api.us-east-1.amazonaws.com';

export const getAllFlights = async (token, filters = {}, pageNumber = 1) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const params = new URLSearchParams({
            ...filters,
            page: pageNumber.toString(),
            // count: '25'  // Assuming each page contains 25 flights; adjust as needed
        }).toString();
        
        console.log("API URL:", `${BASE_URL}/flights/?${params}`);
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
        console.log("TOKEN:", token);
        console.log("API URL:", `${BASE_URL}/flights/${flightId}`);
        const response = await axios.get(`${BASE_URL}/flights/${flightId}`, { headers });
        console.log("Get Details response:", response.data)
        return response.data;
    } catch (error) {
        console.error("Error: details", error)
        throw error;
    }
}

export const postFlightRequest = async (token, flightId, quantity) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'type': "our_group_purchase",
            'flight_id': flightId,
            'quantity': quantity
        };
        console.log("API URL:", `${BASE_URL}/flights/request/`);
        const response = await axios.post(`${BASE_URL}/flights/request/`, data, { headers });
        console.log("Flight request response:", response);
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}

export const getPurchase = async (token) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await axios.get(`${BASE_URL}/purchases`, {headers});
        console.log("Flight request response:", response);
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
    }
}