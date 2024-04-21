import axios from 'axios';

const BASE_URL = 'https://5p6lx04ir7.execute-api.us-east-2.amazonaws.com/etapa2';

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
        const response = await axios({
            method: 'post',
            url: `${BASE_URL}/flights/request-purchase/`,
            headers: {
              'Authorization': `Bearer ${token}`
            },
            data: {
                'flight-id': flightId,
                'quantity': quantity
            }
          });
        console.log("Flight request response:", response);
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
    }
}

export const getPurchases = async (token) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/purchase/`,
            headers: {
              'Authorization': `Bearer ${token}`
            },
            data: {}
          });
        console.log("Flight request response:", response);
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
    }
}