import React, { useEffect, useState } from 'react';
import { getFlightDetails, postFlightRequest, getPurchase } from '../api/flights';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useParams } from "react-router-dom";
import Picker from "../components/QuantityPicker"
import flightSVG from "../assets/flight.svg";
import PopUp from '../components/PopUp';
import PurchaseList from './MyPurchases';

function Flight() {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [flight, setFlight] = useState([]);
    const [request, setRequest] = useState();
    const [quantity, setQuantity] = useState();
    const [success, setSuccess] = useState(false);
    const [msg, setMsg] = useState();
    const { flightId } = useParams(); // Retrieve flightId from params

    const [showPopUp, setPopUp] = useState(false);
    const openPopUp = () => {
        setPopUp(true);
    };
    const closePopUp = () => {
        setPopUp(false);
    };

    useEffect(() => {
        const fetchFlight = async () => {
            console.log("Fetching flight with ID:", flightId);
            if (!isAuthenticated) return; // Ensure the user is authenticated
            try {
                const token = await getAccessTokenSilently({
                    audience: 'https://my-api-endpoint/',
                    algorithm: 'RS256'
                });
                const flightData = await getFlightDetails(token, flightId);
                console.log("token", token)
                setFlight(flightData.flight);
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        };
        fetchFlight();
    }, [getAccessTokenSilently, isAuthenticated, flightId]);    

    const sendFlightRequest = async() => {
        console.log("Sending flight request:", flightId);
            if (!isAuthenticated) return;
        try {
            const token = await getAccessTokenSilently();
            const requestResponse = await postFlightRequest(token, flightId, quantity);
            setRequest(requestResponse);
            console.log("response:", requestResponse);
            handleResponse();
        } catch (error) {
            console.error("Error sending flight request:", error);
        }
    }

    const handleResponse = () => {
        if (request.success === true) {
            setSuccess(true);
        } else {
            setSuccess(false);
            setMsg(request.message);
        }
        openPopUp();
    }

    const handlePickerChange = (number) => {
        setQuantity(number);
    }
    
    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <div>
            <h1>Flight Details</h1>
            <Paper elevation={3} className='flight-container' style={{ padding: '20px', marginBottom: '10px' }}>
            <div>
                <Typography className="airline" variant="h6" gutterBottom>
                    <img src={flight.airline_logo} className="Airline-Logo" width={25}/>
                    Aerolínea: {flight.airline}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Fecha de Salida: {flight.departure_airport_time}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    ID Aeropuerto Salida: {flight.departure_airport_id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Nombre Aeropuerto Salida: {flight.departure_airport_name}
                </Typography>
                <hr />
                <Typography variant="body1" gutterBottom>
                    Fecha de Llegada: {flight.arrival_airport_time}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    ID Aeropuerto Llegada: {flight.arrival_airport_id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Nombre Aeropuerto Llegada: {flight.arrival_airport_name}
                </Typography>
                <hr />
                <Typography variant="body1" gutterBottom>
                    Número de Asientos Disponibles: {}
                </Typography>
            </div>
            <div>
                <img src={flightSVG} alt="Flight SVG" width={200}/>
            </div>
            </Paper>

            <div className='buy'>
            <Picker min={0} max={6} onChange={handlePickerChange}></Picker>
            <button className="btn-comprar" onClick={sendFlightRequest}>Comprar</button>
            {showPopUp && (
            <PopUp onClose={closePopUp}>
                <h2>{success ? 'Solicitud enviada existosamente' : 'Error'}</h2>
                <div>{success ? 'Revisa Mis Vuelos': 'Hubo un error en la solicitud'}</div>
            </PopUp>
            )}
            </div>
        </div>
    )
}

export default Flight;
