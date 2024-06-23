import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllFlights } from '../api/flights'; // Ensure this path is correct
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Button, TablePagination, Grid, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {jwtDecode} from 'jwt-decode';

function FlightList() {
    const { isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [flights, setFlights] = useState([]);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({ departure: '', arrival: '', date: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlights = async () => {
            if (!isAuthenticated) return; // Ensure the user is authenticated
            try {
                const token = await getAccessTokenSilently();
                const flightsData = await getAllFlights(token, filters, page+1);
                setFlights(flightsData);
                console.log("TOKEN:", token);
                const decodedToken = jwtDecode(token);
                console.log('decoded:', decodedToken);
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        };

        fetchFlights();
    }, [getAccessTokenSilently, isAuthenticated, filters, page]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleFilterChange = (filterName) => (event) => {
        setFilters({
            ...filters,
            [filterName]: event.target.value.toUpperCase()
        });
    };

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <Box sx={{ flexGrow: 1 , margin: 3}}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}> {/* Add Grid container */}
                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        label="Origen (Ej: LAX)"
                        variant="outlined"
                        value={filters.departure}
                        onChange={handleFilterChange('departure')}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        label="Destino (Ej: LAX)"
                        variant="outlined"
                        value={filters.arrival}
                        onChange={handleFilterChange('arrival')}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        label="Fecha"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={filters.date}
                        onChange={handleFilterChange('date')}
                    />
                </Grid>
                <Grid item xs={12} sm={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setPage(0)}
                    >
                        Buscar
                    </Button>
                </Grid>
            </Grid>
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
                <TablePagination
                    component="div"
                    count={-1} // Adjust this if your API sends the total number of rows
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={25}  // Fixed as 25
                    rowsPerPageOptions={[]}
                />
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

export default FlightList;

