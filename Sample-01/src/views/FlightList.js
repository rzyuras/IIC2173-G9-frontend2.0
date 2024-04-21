import React, { useEffect, useState} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllFlights } from '../api/flights'; // ensure this path is correct
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, TablePagination } from '@mui/material';
import { useHistory} from 'react-router-dom';

function FlightList() {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [flights, setFlights] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filters, setFilters] = useState({departure: '', arrival: '', date: ''});
    const history = useHistory();

    useEffect(() => {
        const fetchFlights = async () => {
            console.log("Fetching flights with params:", { page, filters, rowsPerPage });
            if (!isAuthenticated) return; // Ensure the user is authenticated
            try {
                const token = await getAccessTokenSilently();
                const flightsData = await getAllFlights(token, filters, page+1);
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

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
        <>
            <TextField label="Departure" variant="outlined" value={filters.departure} onChange={handleFilterChange('departure')} />
            <TextField label="Arrival" variant="outlined" value={filters.arrival} onChange={handleFilterChange('arrival')} />
            <TextField label="Date" type="date" InputLabelProps={{shrink: true}} value={filters.date} onChange={handleFilterChange('date')} />
            <Button onClick={() => setPage(0)}>Search</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Airline</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Departure Code</TableCell>
                            <TableCell align="right">Departure Airport</TableCell>
                            <TableCell align="right">Arrival Code</TableCell>
                            <TableCell align="right">Arrival Airport</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {flights.map((flight) => (
                            <TableRow className='flight-table' key={flight.id} onClick={() => navigate(`/details/${flight.id}`)} style={{ cursor: 'pointer' }}>
                                <TableCell component="th" scope="row">{flight.airline}</TableCell>
                                <TableCell align="right">{flight.departure_airport_time}</TableCell>
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
                    count={-1} // You might want to adjust this if your API sends total number of rows
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </>
    );
}

export default FlightList;

