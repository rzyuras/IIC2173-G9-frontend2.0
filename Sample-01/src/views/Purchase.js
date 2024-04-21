import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFlightDetails } from '../api/flights';
import Picker from "../components/QuantityPicker"

function Purchase() {
    const [flight, setFlight] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const fetchedDetails = await getFlightDetails(id);
                setFlight(fetchedDetails);
            } catch (error) {
                console.error('Failed to fetch flight details:', error);
            }
        };

        fetchDetails();
    }, [id]);

    if (!flight) return <div>Loading...</div>;

    return (
        <div>
            <h1>Flight Details</h1>
            <p>{flight.airline} - {flight.origin} to {flight.destination}</p>
            <p>Departure: {flight.departureTime} - Arrival: {flight.arrivalTime}</p>
            <p>Price: ${flight.price}</p>
            <Picker></Picker>
            <button className='btn'>Comprar</button>
        </div>
    );
}

export default Purchase;
