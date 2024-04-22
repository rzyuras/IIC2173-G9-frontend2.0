import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getPurchase } from '../api/flights';
import { Paper, Typography } from '@mui/material';
import flightSVG from "../assets/flight.svg";

function PurchaseList({ flightId }) { // Corrected the props destructuring
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [flight, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchPurchase = async () => {
            console.log("Fetching purchase result");
            if (!isAuthenticated) return;
            try {
                const token = await getAccessTokenSilently();
                const requestResponse = await getPurchase(token);
                setPurchases(requestResponse);
                setLoading(false);
                console.log("response:", requestResponse);
            } catch (error) {
                console.error("Error getting flight result:", error);
                setLoading(false);
            }
        };
        fetchPurchase();
    }, [getAccessTokenSilently, isAuthenticated, flightId]);

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <>
        <h1>Mis solicitudes de compra</h1>
        {loading ? (
            <h2>Esperando respuesta</h2>
        ) : (
            <div>
            {/*<h2>Detalles Vuelo</h2>
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
                    Sigla Aeropuerto de Origen: {flight.departure_airport_id}
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
        </Paper>*/}
            </div>
        )}
        </>
    )
}

export default PurchaseList;