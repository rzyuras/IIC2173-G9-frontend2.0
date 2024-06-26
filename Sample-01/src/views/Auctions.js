import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllFlights, getFlightDetails, getAuctions, getExchangeRequests, postAuction, postExchangeRequest, postExchangeResponse } from '../api/flights';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';
import Picker from '../components/QuantityPicker';
import PopUp from '../components/PopUp';
import FlightsContainer from '../components/FlightsContainer';

function Auctions() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [flights, setFlights] = useState([]);
    const [exFlight, setExFlight] = useState(null);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [view, setView] = useState('comprados');
    const [page, setPage] = useState(0);
    const [popup, setPopup] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [admin, setAdmin] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const [filters, setFilters] = useState({ departure: '', arrival: '', date: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlights = async () => {
            if (!isAuthenticated) return;
            try {
                const token = await getAccessTokenSilently();
                checkAdmin();

                let flightsData = [];
                if (view === 'comprados') {
                    const allflights = await getAllFlights(token, filters, page+1);
                    flightsData = allflights.filter(flight => flight.group_tickets > 0);
                    setFilteredFlights(flightsData);

                } else if (view === 'disponibles') {
                    const allAuctions = await getAuctions(token);
                    const auctions = allAuctions.auctions;

                    for (const auction of auctions) {
                        if (1==1) {
                            const flightId = auction.flight_id;
                            const flightData = await getFlightDetails(token, flightId);
                            flightData.flight.auction_id = auction.auction_id;
                            flightData.flight.auction_quantity = auction.quantity;
                            flightData.flight.group_id = auction.group_id;
                            flightsData.push(flightData.flight);
                        } /*else {
                            const flightId = auction.flight_id;
                            const flightData = await getFlightDetails(token, flightId);
                            flightData.flight.auction_id = auction.auction_id;
                            flights.push(flightData.flight);
                        }*/
                    }
                } else if (view === 'solicitudes') {
                    const allRequests = await getExchangeRequests(token);
                    const requests = allRequests.proposals;

                    for (const request of requests) {
                        if (request.group_id !== 9 && request.response == 'pending') {
                            const flightId = request.flight_id;
                            const flightData = await getFlightDetails(token, flightId);
                            flightData.flight.auction_id = request.auction_id;
                            flightData.flight.proposal_id = request.proposal_id;
                            flightData.flight.request_quantity = request.quantity;
                            flightsData.push(flightData.flight);
                        }
                    }
                } else if (view === 'historial') {
                    const allRequests = await getExchangeRequests(token);
                    const requests = allRequests.proposals;

                    for (const request of requests) {
                        if (request.group_id !== 9 && request.response !== 'pending') {
                            const flightId = request.flight_id;
                            const flightData = await getFlightDetails(token, flightId);
                            flightData.flight.auction_id = request.auction_id;
                            flightData.flight.response = request.response;
                            flightData.flight.request_quantity = request.quantity;
                            flightsData.push(flightData.flight);
                        }
                     }
                    }

                setFlights(flightsData);

            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        };

        fetchFlights();
    }, [getAccessTokenSilently, isAuthenticated, view]);


    //post hacer subasta
    const sendAuction = async(flightId) => {
        try {
            const token = await getAccessTokenSilently();
            const response = await postAuction(token, flightId, quantity, 9);
            setPopup(false);
            setMessage(response.message); 
            console.log("response post auctions:", response);

            /*const updatedFlights = flights
                .map(flight => {
                    if (flight.id === flightId) {
                        return { ...flight, group_tickets: quantity };
                    }
                    return flight;
                })
                .filter(flight => flight.group_tickets !== 0);

            setFlights(updatedFlights);*/

        } catch (error) {
            console.error("Error sending flight request:", error);
        }
    };

    //post hacer intercambio
    //quantity no está llegando bien aquí, revisar esto y FlightsContainer
    const sendExchangeRequest = async (myFlight, chosenFlight, quantity) => {
        console.log("hi", myFlight, chosenFlight, quantity);
        if (!admin) {
            setErrorMessage('ERROR: No puedes realizar esta acción');
            return;
        }
    
        try {
            const token = await getAccessTokenSilently();
            const response = await postExchangeRequest(token, myFlight, chosenFlight, quantity);
            setMessage(response.message);
        } catch (error) {
            console.error("Error sending flight request:", error);
        }
    };

    //post responder propuestas de intercambios
    const sendExchangeResponse = async(proposal_id, answer) => {
        if (!admin) {
            setErrorMessage('ERROR: No puedes realizar esta acción');
            return;
        }

        try {
            const token = await getAccessTokenSilently();
            const response = await postExchangeResponse(token, proposal_id, answer);
            setMessage(response.message);
        } catch (error) {
            console.error("Error sending flight request:", error);
        }
    };

    const handleAuction = async() => {
        if (!admin) {
            setErrorMessage('ERROR: No puedes realizar esta acción');
            return;
        } else {
            setPopup(true);
        }
    }

    const handleExchange = async() => {
        if (!admin) {
            setErrorMessage('ERROR: No puedes realizar esta acción');
            return;
        } else {
            setPopup(true);
        }
    }

    const handlePickerChange = (value) => {
        setQuantity(parseInt(value, 10));  // Ensure the value is an integer
    };

    const checkAdmin = async() => {
        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode(token);
        const namespace = 'https://matiasoliva.me/'; 
        const userRoles = decodedToken[`${namespace}role`] || [];
        if (userRoles.includes('Admin')) {
            setAdmin(true);
        } else {
            setAdmin(false);
        }
        console.log("admin", admin);
    }

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button variant={view === 'comprados' ? 'contained' : 'outlined'} onClick={() => setView('comprados')}>Comprados</Button>
                <Button variant={view === 'disponibles' ? 'contained' : 'outlined'} onClick={() => setView('disponibles')}>Disponibles</Button>
                <Button variant={view === 'solicitudes' ? 'contained' : 'outlined'} onClick={() => setView('solicitudes')}>Solicitudes</Button>
                <Button variant={view === 'historial' ? 'contained' : 'outlined'} onClick={() => setView('historial')}>Historial</Button>             
            </Box>

            {flights.length > 0 ? (
                <Box sx={{ flexGrow: 1, margin: 3 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell>Aerolínea</TableCell>
                                    <TableCell align="right">Salida</TableCell>
                                    <TableCell align="right">Llegada</TableCell>
                                    <TableCell align="right">Sigla Salida</TableCell>
                                    <TableCell align="right">Aeropuerto Salida</TableCell>
                                    <TableCell align="right">Sigla Destino</TableCell>
                                    <TableCell align="right">Aeropuerto Destino</TableCell>
                                    <TableCell align="right">Precio por Persona</TableCell>
                                    <TableCell align="right">Cantidad Asientos</TableCell>
                                    {view === 'solicitudes' && (
                                        <TableCell align="right">Auction ID</TableCell>
                                    )}

                                    {view === 'disponibles' && (
                                        <TableCell align="right">Group ID</TableCell>
                                    )}
                                    {view === 'historial' && (
                                        <>
                                            <TableCell align="right">Auction ID</TableCell>
                                            <TableCell align="right">Auction Status</TableCell>
                                        </>
                                    )}
                                    <TableCell align="center">Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {flights.map((flight) => (
                                    <TableRow key={flight.id} style={{ cursor: 'pointer' }}>
                                        <TableCell component="th" scope="row">
                                            <img src={flight.airline_logo} alt="Airline Logo" width={25} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                                            {flight.airline}
                                        </TableCell>
                                        <TableCell align="right">
                                            {format(new Date(flight.departure_airport_time), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                                        </TableCell>
                                        <TableCell align="right">
                                            {format(new Date(flight.arrival_airport_time), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}
                                        </TableCell>
                                        <TableCell align="right">{flight.departure_airport_id}</TableCell>
                                        <TableCell align="right">{flight.departure_airport_name}</TableCell>
                                        <TableCell align="right">{flight.arrival_airport_id}</TableCell>
                                        <TableCell align="right">{flight.arrival_airport_name}</TableCell>
                                        <TableCell align="right">${formatNumber(flight.price)} {flight.currency}</TableCell>
                                            {view === 'comprados' && (
                                                <TableCell align="center">{flight.group_tickets}</TableCell>
                                            )}
                                            {view === 'disponibles' && (
                                                <>
                                                    <TableCell align="center">{flight.auction_quantity}</TableCell>
                                                    <TableCell align="center">{flight.group_id}</TableCell>
                                                </>
                                            )}
                                            {view === 'solicitudes' && (
                                                <>
                                                    <TableCell align="center">{flight.request_quantity}</TableCell>
                                                    <TableCell align="center">{flight.auction_id}</TableCell>
                                                </>
                                            )}
                                            {view === 'historial' && (
                                                <>
                                                    <TableCell align="center">{flight.request_quantity}</TableCell>
                                                    <TableCell align="center">{flight.auction_id}</TableCell>
                                                    <TableCell align="center">{flight.response}</TableCell>
                                                    <TableCell align="center">-</TableCell>
                                                </>
                                            )}
                                        <TableCell align="center">
                                            {view === 'comprados' && (
                                                <>
                                                    <Button variant="outlined" color="primary" onClick={handleAuction}>Subastar</Button>
                                                    {popup && (
                                                        <PopUp onClose={() => setPopup(false)}>
                                                            <div className='auctions'>
                                                                <h3>Seleccione cantidad a subastar</h3>
                                                                <div className='auc-buttons'>
                                                                    <Picker min={0} max={flight.group_tickets} onChange={handlePickerChange}></Picker>
                                                                    <Button variant="outlined" color="primary" disabled={quantity === 0} onClick={() => sendAuction(flight.id)}>Subastar</Button>
                                                                </div>
                                                            </div>
                                                        </PopUp>
                                                    )}
                                                </>
                                            )}
                                            {view === 'disponibles' && (
                                                <>
                                                    <Button variant="outlined" color="secondary" onClick={handleExchange}>Intercambiar</Button>
                                                    {popup && (
                                                        <PopUp style='big' onClose={() => setPopup(false)}>
                                                            <div className='auctions'>
                                                                <h3>Seleccione flight a intercambiar</h3>
                                                                <div className='auc-buttons'>
                                                                    <FlightsContainer flights={filteredFlights} onExchange={sendExchangeRequest} chosenFlight={flight.auction_id}/>
                                                                </div>
                                                            </div>
                                                        </PopUp>
                                                    )}
                                                </>
                                            )}
                                            {view === 'solicitudes' && (
                                                <>
                                                    <Button variant="outlined" color="primary" onClick={() => sendExchangeResponse(flight.proposal_id, 'acceptance')}>Aceptar</Button>
                                                    <Button variant="outlined" color="secondary" onClick={() => sendExchangeResponse(flight.proposal_id, 'rejection')}>Rechazar</Button>
                                                </>
                                            )}
                                            {errorMessage && (
                                                <PopUp onClose={() => setErrorMessage('')}>
                                                    <p>{errorMessage}</p>
                                                </PopUp>
                                            )}
                                            {message && (
                                                <PopUp onClose={() => setMessage('')}>
                                                    <p>{message}</p>
                                                </PopUp>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <p>No hay vuelos disponibles.</p>
            )}
        </div>
    );
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

export default Auctions;