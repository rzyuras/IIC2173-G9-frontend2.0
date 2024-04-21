import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//import { getFlightDetails } from '../api/flights';
import Picker from "../components/QuantityPicker"
import PopUp from "../components/PopUp";

function Purchase() {
    const [flight, setFlight] = useState(null);
    const { id } = useParams();

    const [showPopUp, setPopUp] = useState(false);

    const openPopUp = () => {
        setPopUp(true);
    };

    const closePopUp = () => {
        setPopUp(false);
    };

    const [ipAddress, setIpAddress] = useState('');
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIpAddress = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            setIpAddress(data.ip);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching IP address:', error);
            setLoading(false);
        }
        };

        fetchIpAddress();
    }, []);

    useEffect(() => {
        const fetchLocation = async () => {
        if (ipAddress) {
            try {
            const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
            const data = await response.json();
            setLocation(data);
            } catch (error) {
            console.error('Error fetching location:', error);
            }
        }
        };

        fetchLocation();
    }, [ipAddress]);

    /*useEffect(() => {
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

    if (!flight) return <div>Loading...</div>;*/

    return (
        <div>
            {/*<h1>Flight Details</h1>
            <p>{flight.airline} - {flight.origin} to {flight.destination}</p>
            <p>Departure: {flight.departureTime} - Arrival: {flight.arrivalTime}</p>
    <p>Price: ${flight.price}</p>*/}
            <div>
            <p>IP Address: {loading ? 'Loading...' : ipAddress}</p>
            {location && (
                <div>
                <p>Country: {location.country_name}</p>
                <p>Region: {location.region}</p>
                <p>City: {location.city}</p>
                <p>Postal Code: {location.postal}</p>
                </div>
            )}
            </div>
            <button className="btn" onClick={openPopUp}>Open Pop Up</button>
            {showPopUp && (
            <PopUp onClose={closePopUp}>
                <h2>Pop-up Message</h2>
                <p>This is a pop-up message!</p>
            </PopUp>
            )}
            <Picker></Picker>
            <button className='btn'>Comprar</button>
        </div>
    );
}

export default Purchase;
