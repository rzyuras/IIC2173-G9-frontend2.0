import React, { useEffect, useState } from 'react';
import { getFlightDetails, postFlightRequest } from '../api/flights';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useParams } from "react-router-dom";
import Picker from "../components/QuantityPicker"
import flightSVG from "../assets/flight.svg";
import PopUp from '../components/PopUp';
import IPdetails from '../components/IPdetails';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


function Flight() {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [flight, setFlight] = useState([]);
    const [request, setRequest] = useState();
    const [quantity, setQuantity] = useState();
    const [success, setSuccess] = useState(false);
    const { flightId } = useParams(); // Retrieve flightId from params
    console.log("Flight idddddd:", flightId)

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
                const token = await getAccessTokenSilently();
                const params = {flightId: flightId // Assuming flightId is the parameter name expected by the backend
                };
                const flightData = await getFlightDetails(token, flightId);
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
        if (request.message === 'Success') {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
        openPopUp();
    }

    const handlePickerChange = (number) => {
        setQuantity(number);
    }

    const handleClick = () => {
        sendFlightRequest();
    }

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
                    Fecha y hora de salida: {format(new Date(flight.departure_airport_time), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Sigla Aeropuerto de Origen: {flight.departure_airport_id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Nombre Aeropuerto de Origen: {flight.departure_airport_name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Fecha y hora de llegada: {format(new Date(flight.arrival_airport_time), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Sigla Aeropuerto de Destino: {flight.arrival_airport_id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Nombre Aeropuerto de Destino: {flight.arrival_airport_name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Asientos disponibles: {}
                </Typography>
            </div>
            <div>
                <img src={flightSVG} alt="Flight SVG" width={200}/>
            </div>
            </Paper>
            <div className='buy'>
            <Picker min={0} max={6} onChange={handlePickerChange}></Picker>
            <button className="btn-comprar" onClick={handleClick}>Comprar</button>
            {showPopUp && (
            <PopUp onClose={closePopUp}>
                <h2>{success ? 'Compra exitosa' : 'Error'}</h2>
                <div>{success ? <IPdetails/> : 'Error'}</div>
            </PopUp>        
            )}
            </div>
        </div>
    )
}

export default Flight;

