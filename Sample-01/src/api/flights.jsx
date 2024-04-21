import axios from 'axios';

const BASE_URL = 'https://5p6lx04ir7.execute-api.us-east-2.amazonaws.com/etapa1';
// const BASE_URL = 'https://matiasoliva.me';

export const getAllFlights = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/flights/`);
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

export const getFlightDetails = async (flightId) => {
    try {
        const response = await axios.get(`${BASE_URL}/flights/${flightId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

/*export const flightRequest = async (data) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${BASE_URL}/flights/request-purchase/`,
            headers: {
              'Authorization': `Bearer ${token}`
            },
            data: data
          });
        console.log("Flight request response:", response);
        return response.data;
    } catch (error) {
        console.error("Failed to request flight:", error);
    }
}*/
