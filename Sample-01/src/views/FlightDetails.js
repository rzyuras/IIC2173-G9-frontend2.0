import React, { useEffect, useState } from 'react';
import { getFlightDetails, postFlightRequest} from '../api/flights';
import { useAuth0 } from '@auth0/auth0-react';
import { Paper, Typography } from '@mui/material';
import { useParams } from "react-router-dom";
import Picker from "../components/QuantityPicker"
import flightSVG from "../assets/flight.svg";
import PopUp from '../components/PopUp';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function Flight() {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [flight, setFlight] = useState({});
    const [price, setPrice] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [data, setPurchaseData] = useState(null);
    const { flightId } = useParams();
    const [showPopUp, setPopUp] = useState(false);

    useEffect(() => {
        const fetchFlight = async () => {
            if (!isAuthenticated) return;
            try {
                const token = await getAccessTokenSilently();
                const flightData = await getFlightDetails(token, flightId);
                setFlight(flightData.flight);
                setPrice(formatNumber(flightData.flight.price));
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        };
        fetchFlight();
    }, [getAccessTokenSilently, isAuthenticated, flightId]);

    const sendFlightRequest = async () => {
        if (!isAuthenticated) return;
        try {
            const name = user.name
            console.log('name', name)
            const token = await getAccessTokenSilently();
            const ip = await fetchIpAddress();
            const { latitude, longitude } = await fetchLocation(ip);
            const response = await postFlightRequest(token, flightId, quantity, latitude, longitude, name);
            console.log("ticket", response);
            handleBuy(response);
        } catch (error) {
            console.error("Error sending flight request:", error);
        }
    };

    const handleBuy = (data) => {
        if (data.ticket.url && data.ticket.token) {
            const flight_info = {
                url: data.ticket.url,
                token: data.ticket.token,
                purchase_uuid: data.purchase_uuid
            }
            localStorage.setItem('purchaseUuid', data.purchase_uuid);
            console.log("purchase", data.purchase_uuid);
            setPurchaseData(flight_info);
            setPopUp(true);
        } else {
            console.log("Not url or token found");
        }
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
                    <img src={flight.airline_logo} className="Airline-Logo" width={25} alt={`${flight.airline} logo`}/>
                    Aerolínea: {flight.airline}
                </Typography>
                <Typography variant="body1" gutterBottom>
                   Fecha y hora de salida: {formatDate(flight.departure_airport_time)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Sigla Aeropuerto de Salida: {flight.departure_airport_id}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Nombre Aeropuerto de Salida: {flight.departure_airport_name}
                </Typography>
                <hr />
                <Typography variant="body1" gutterBottom>
                    Fecha y hora de llegada : {formatDate(flight.arrival_airport_time)}
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
                <hr />
                <Typography variant="body1" gutterBottom>
                    Precio por Persona: ${price} {flight.currency}
                </Typography>
            </div>
            <div>
                <img src={flightSVG} alt="Flight SVG" width={200}/>
            </div>
            </Paper>
            <div className='buy'>
                <Picker min={0} max={Math.max(flight.flight_tickets, 0)} onChange={handlePickerChange} />
                <button className="btn-comprar" disabled={quantity === 0} onClick={sendFlightRequest}>Comprar</button>
                {showPopUp && (
                    <PopUp onClose={closePopUp}>
                        <form action={data.url} method="POST">
                        <input type="hidden" name="token_ws" value={data.token}/>
                        <input type="hidden" name="purchase_uuid" value={data.purchase_uuid}/>
                        <div className='text-center'>
                            <p>Número de Asientos Seleccionados: {quantity}</p>
                        </div>
                        <div className='btn-container'><button className="btn" type="submit">Pagar ${formatNumber(quantity * parseInt(flight.price,10))}</button></div>
                        </form>
                    </PopUp>
                )}
            </div>
        </div>
    );
}


function formatDate(dateString) {
    try {
        return format(new Date(dateString), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;  // Fallback to raw date string on error
    }
}

function formatNumber(number) {
    const str = number.toString();
    const parts = [];
    for (let i = str.length - 1, j = 0; i >= 0; i--, j++) {
        if (j > 0 && j % 3 === 0) {
            parts.unshift('.');
        }
        parts.unshift(str[i]);
    }
    return parts.join('');
}

const fetchIpAddress = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
};

const fetchLocation = async (ip) => {
    if (ip) {
        try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return { latitude: data.latitude, longitude: data.longitude };
        } catch (error) {
        console.error('Error fetching location:', error);
        }
    }
};

export default Flight;