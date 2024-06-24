import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllFlights /*, getBookedFlights, getAvailableFlights, getFlightRequests*/ } from '../api/flights';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';

function Auctions() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [flights, setFlights] = useState([]);
    const [view, setView] = useState('comprados');
    const [page, setPage] = useState(0);
    const [admin, setAdmin] = useState(false);
    const [filters, setFilters] = useState({ departure: '', arrival: '', date: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlights = async () => {
            if (!isAuthenticated) return;
            try {
                const token = await getAccessTokenSilently();

                let flightsData;
                if (view === 'comprados') {
                    const allflights = await getAllFlights(token, filters, page+1);
                    flightsData = allflights.filter(flight => flight.group_tickets > 0);
                } /*else if (view === 'disponibles') {
                    flightsData = await getAvailableFlights(token);
                } else if (view === 'solicitudes') {
                    flightsData = await getFlightRequests(token);
                }*/
                setFlights(flightsData);

                //console.log("TOKEN:", token);
                const decodedToken = jwtDecode(token);
                const namespace = 'https://matiasoliva.me/'; 
                const userRoles = decodedToken[`${namespace}role`] || [];
                if (userRoles.includes('Admin')) {
                    setAdmin(true);
                } else {
                    setAdmin(false);
                }
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        };

        fetchFlights();
    }, [getAccessTokenSilently, isAuthenticated, view]);

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button variant={view === 'comprados' ? 'contained' : 'outlined'} onClick={() => setView('comprados')}>Comprados</Button>
                <Button variant={view === 'disponibles' ? 'contained' : 'outlined'} onClick={() => setView('disponibles')}>Disponibles</Button>
                <Button variant={view === 'solicitudes' ? 'contained' : 'outlined'} onClick={() => setView('solicitudes')}>Solicitudes</Button>
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
                                    <TableCell align="right">Acción</TableCell>
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
                                        <TableCell align="right">
                                            {view === 'comprados' && <Button variant="outlined" color="primary">Subastar</Button>}
                                            {view === 'disponibles' && <Button variant="outlined" color="secondary">Intercambiar</Button>}
                                            {view === 'solicitudes' && (
                                                <>
                                                    <Button variant="outlined" color="primary" style={{ marginRight: '5px' }}>Aceptar</Button>
                                                    <Button variant="outlined" color="secondary">Rechazar</Button>
                                                </>
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