import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getRecommendations } from '../api/flights';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function Recommendations() {
    const { isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [flights, setFlights] = useState([]);
    //const [page, setPage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlights = async () => {
            if (!isAuthenticated) return;
            try {
                const token = await getAccessTokenSilently();
                const flightsData = await getRecommendations(token);
                setFlights(flightsData);
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        };

        fetchFlights();
    }, [getAccessTokenSilently, isAuthenticated]);

    /*const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };*/

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <Box sx={{ flexGrow: 1 , margin: 3}}>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flights.map((flight) => (
                            <TableRow className='flight-table' key={flight.id} onClick={() => navigate(`/details/${flight.id}`)} style={{ cursor: 'pointer' }}>
                                <TableCell component="th" scope="row">
                                    <img src={flight.airline_logo} alt="Airline Logo" className="Airline-Logo" width={25} style={{ marginRight: '10px', verticalAlign: 'middle' }}/>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/*<TablePagination
                    component="div"
                    count={-1}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={25}
                    rowsPerPageOptions={[]}
                    />*/}
            </TableContainer>
        </Box>
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

export default Recommendations;