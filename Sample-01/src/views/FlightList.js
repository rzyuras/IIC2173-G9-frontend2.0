import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllFlights } from '../api/flights'; // Ensure this path is correct
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Button, TablePagination, Grid, Box
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function FlightList() {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [flights, setFlights] = useState([]);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState({ departure: '', arrival: '', date: '' });
    const history = useHistory();

    useEffect(() => {
        const fetchFlights = async () => {
            console.log("Fetching flights with params:", { page, filters });
            if (!isAuthenticated) return; // Ensure the user is authenticated
            try {
                const token = await getAccessTokenSilently();
                const flightsData = await getAllFlights(token, filters, page + 1);  // Always fetch 25 items per page as per backend setup
                setFlights(flightsData);
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
            [filterName]: event.target.value
        });
    };

    const navigate = (path) => {
        history.push(path);
    };

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <Box sx={{ flexGrow: 1 , margin: 3}}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}> {/* Add Grid container */}
                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        label="Origen"
                        variant="outlined"
                        value={filters.departure}
                        onChange={handleFilterChange('departure')}
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        fullWidth
                        label="Destino"
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
            {/* <TextField label="Departure" variant="outlined" value={filters.departure} onChange={handleFilterChange('departure')} />
            <TextField label="Arrival" variant="outlined" value={filters.arrival} onChange={handleFilterChange('arrival')} />
            <TextField label="Date" type="date" InputLabelProps={{shrink: true}} value={filters.date} onChange={handleFilterChange('date')} />
            <Button onClick={() => setPage(0)}>Search</Button> */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Aerolínea</TableCell>
                            <TableCell align="right">Fecha del Vuelo</TableCell>
                            <TableCell align="right">Código del Origen</TableCell>
                            <TableCell align="right">Aeropuerto de Origen</TableCell>
                            <TableCell align="right">Código del Destino</TableCell>
                            <TableCell align="right">Aeropuerto de Destino</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flights.map((flight) => (
                            <TableRow className='flight-table' key={flight.id} onClick={() => navigate(`/details/${flight.id}`)} style={{ cursor: 'pointer' }}>
                                <TableCell component="th" scope="row">{flight.airline}</TableCell>
                                <TableCell align="right">{format(new Date(flight.departure_airport_time), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}</TableCell>
                                <TableCell align="right">{flight.departure_airport_id}</TableCell>
                                <TableCell align="right">{flight.departure_airport_name}</TableCell>
                                <TableCell align="right">{flight.arrival_airport_id}</TableCell>
                                <TableCell align="right">{flight.arrival_airport_name}</TableCell>
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

export default FlightList;

