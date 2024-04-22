import React, { useEffect, useState } from 'react';
import { getFlightDetails, postFlightRequest, getPurchase } from '../api/flights';
import { useAuth0 } from '@auth0/auth0-react';
import { Paper, Typography } from '@mui/material';
import { useParams } from "react-router-dom";
import Picker from "../components/QuantityPicker"
import flightSVG from "../assets/flight.svg";
import PopUp from '../components/PopUp';

function Flight() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [flight, setFlight] = useState({});
    const [quantity, setQuantity] = useState(0);  // Initialize with 0
    const [success, setSuccess] = useState(false);
    const [msg, setMsg] = useState("");
    const { flightId } = useParams();
    const [showPopUp, setPopUp] = useState(false);

    useEffect(() => {
        const fetchFlight = async () => {
            if (!isAuthenticated) return;
            try {
                const token = await getAccessTokenSilently();
                const flightData = await getFlightDetails(token, flightId);
                setFlight(flightData.flight);
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        };
        fetchFlight();
    }, [getAccessTokenSilently, isAuthenticated, flightId]);

    const sendFlightRequest = async () => {
        if (!isAuthenticated) return;
        try {
            const token = await getAccessTokenSilently();
            const response = await postFlightRequest(token, flightId, quantity);
            handleResponse(response);
        } catch (error) {
            console.error("Error sending flight request:", error);
        }
    };

    const handleResponse = (response) => {
        if (response && response.success) {
            setSuccess(true);
            setMsg("Solicitud enviada existosamente");
        } else {
            setSuccess(false);
            setMsg(response ? response.message : "Unknown error");
        }
        setPopUp(true);
    };

    const handlePickerChange = (value) => {
        setQuantity(parseInt(value, 10));  // Ensure the value is an integer
    };

    const closePopUp = () => {
        setPopUp(false);
    };

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <div>
            <h1>Detalles del Vuelo</h1>
            <Paper elevation={3} className='flight-container' style={{ padding: '20px', marginBottom: '10px' }}>
            <div>
                <Typography className="airline" variant="h6" gutterBottom>
                    <img src={flight.airline_logo} className="Airline-Logo" width={25}/>
                    Aerolínea: {flight.airline}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Fecha y hora de salida:{flight.departure_airport_time}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Sigla Aeropuerto de Salida: {flight.departure_airport_id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Nombre Aeropuerto de Salida: {flight.departure_airport_name}
                </Typography>
                <hr />
                <Typography variant="body1" gutterBottom>
                    Fecha y hora de llegada: {flight.arrival_airport_time}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Sigla Aeropuerto de Destino: {flight.arrival_airport_id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Nombre Aeropuerto de Destino: {flight.arrival_airport_name}
                </Typography>
                <hr />
                <Typography variant="body1" gutterBottom>
                    Número de Asientos Disponibles: {flight.flight_tickets}
                </Typography>
            </div>
            <div>
                <img src={flightSVG} alt="Flight SVG" width={200}/>
            </div>
            </Paper>
            <div className='buy'>
                <Picker min={0} max={Math.min(flight.flight_tickets || 0, 4)} onChange={handlePickerChange} />
                <button className="btn-comprar" disabled={quantity === 0} onClick={sendFlightRequest}>Comprar</button>
                {showPopUp && (
                    <PopUp onClose={closePopUp}>
                        <h2>{success ? 'Success' : 'Error'}</h2>
                        <p>{msg}</p>
                    </PopUp>
                )}
            </div>
        </div>
    );
}

export default Flight;
