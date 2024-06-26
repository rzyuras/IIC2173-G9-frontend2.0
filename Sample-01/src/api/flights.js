import axios from 'axios';

//const BASE_URL = 'http://localhost:3000';
//const BASE_URL = 'https://rvvfas273i.execute-api.us-east-2.amazonaws.com/dev';
const BASE_URL = 'https://xs3bvwfj-3000.brs.devtunnels.ms';

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
        return response.data;
    } catch (error) {
        console.error("Error: details", error)
        throw error;
    }
}

export const postFlightRequest = async (token, flightId, quantity, latitude, longitude, name, purchase_type) => {
    try {

        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'flight_id': flightId,
            'quantity': quantity,
            'latitudeIp': latitude,
            'longitudeIp': longitude,
            'name': name,
            'purchase_type': purchase_type
        };
        console.log(data);
        const response = await axios.post(`${BASE_URL}/flights/request/`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
        throw error; // Re-throw the error to handle it in the calling code
    }
}

export const postAdminFlightRequest = async (token, flightId, quantity, latitude, longitude, name) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'flight_id': flightId,
            'quantity': quantity,
            'latitudeIp': latitude,
            'longitudeIp': longitude,
            'name': name
        };
        console.log(data);
        const response = await axios.post(`${BASE_URL}/flights/admin/request/`, data, { headers });
        console.log("admin response:", response);
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

export const commitTransaction = async(token, token_ws, userEmail, purchaseUuid) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'ws_token': token_ws,
            'userEmail': userEmail,
            'purchase_uuid': purchaseUuid
        };
        const response = await axios.post(`${BASE_URL}/flights/commit`, data, {headers});
        return response.data;
    } catch (error) {
        console.error("Failed to commit transaction:", error);
        throw error;
    }
}

export const getAuctions = async (token) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await axios.get(`${BASE_URL}/flights/auctions`, {headers});
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
    }
}

export const getExchangeRequests = async (token) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await axios.get(`${BASE_URL}/flights/auctions`, {headers});
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
    }
}

export const postAuction = async (token, flightId, quantity, group_id) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'flight_id': parseInt(flightId, 10),
            'quantity': quantity,
            'group_id': group_id
        };
        console.log(data);
        const response = await axios.post(`${BASE_URL}/flights/auctions`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
        throw error;
    }
}

export const postExchangeRequest = async (token, myFlight, chosenFlight, quantity) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'flight_id': myFlight, //nuestro vuelo
            'quantity': quantity, //nuestra cantidad seleccionada
            'auction_id': chosenFlight //subasta del otro grupo
        };
        console.log(data);
        const response = await axios.post(`${BASE_URL}/flights/auctions/proposal`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
        throw error;
    }
}

export const postExchangeResponse = async (token, proposal_id, answer) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const data = {
            'proposal_id': proposal_id,
            'response': answer
        };
        console.log(data);
        const response = await axios.post(`${BASE_URL}/flights/auctions/response`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
        throw error;
    }
}