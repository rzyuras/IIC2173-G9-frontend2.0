import axios from 'axios';

// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://rvvfas273i.execute-api.us-east-2.amazonaws.com/dev';

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
        const response = await axios.get(`${BASE_URL}/flights/?${params}`, { headers });
        if (response.data.flights && Array.isArray(response.data.flights)) {
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
        console.error("Error: details", error)
        throw error;
    }
}

export const getRecommendations = async ( token ) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await axios.get(`${BASE_URL}/flights/recommendations`, { headers });
        return response.data.flights;
    } catch (error) {
        console.error("Error: details", error)
        throw error;
    }
}

export const postFlightRequest = async (token, flightId, quantity, latitude, longitude, name) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            // 'type': "our_group_purchase",
            'flight_id': flightId,
            'quantity': quantity,
            'latitudeIp': latitude,
            'longitudeIp': longitude,
            'name': name
        };
        console.log(data);
        const response = await axios.post(`${BASE_URL}/flights/request/`, data, { headers });
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
        const response = await axios.get(`${BASE_URL}/purchase`, {headers});
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
    }
}

export const commitTransaction = async(token, token_ws, purchaseUuid) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'ws_token': token_ws,
            'purchase_uuid': purchaseUuid
        };
        const response = await axios.post(`${BASE_URL}/flights/commit`, data, {headers});
        return response.data;
    } catch (error) {
        console.error("Failed to commit transaction:", error);
        throw error;
    }
}
