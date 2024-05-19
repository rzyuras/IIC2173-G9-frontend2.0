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

export const buyFlight = async( token, flightId, quantity ) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'flight_id': flightId,
            'quantity': quantity
        }
        const response = await axios.post(`${BASE_URL}/transaction/create`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Failed to buy ticket:", error);
        throw error;
    }
}

export const commitTransaction = async( token ) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await axios.post(`${BASE_URL}/transaction/commit`, {headers});
        return response.data;
    } catch (error) {
        console.error("Failed to commit transaction:", error);
        throw error;
    }
}
