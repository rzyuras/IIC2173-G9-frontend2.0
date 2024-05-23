import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getRecommendations, getFlightDetails } from '../api/flights';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function Recommendations() {
    const { isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [flights, setFlights] = useState(null);
    const [date_update, setUpdate] = useState();
    const [status, setStatus] = useState(null);
    //const [page, setPage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlights = async () => {
          if (!isAuthenticated) return;
    
          try {
            const token = await getAccessTokenSilently();
            const flightsData = await getRecommendations(token);
            console.log("get recommendations:", flightsData);

            const id_1 = flightsData.flights.flight1;
            const id_2 = flightsData.flights.flight2;
            const id_3 = flightsData.flights.flight3;
    
            if (!id_1 || !id_2 || !id_3) {
              setFlights(null);
            } else {
              const [flight1Data, flight2Data, flight3Data] = await Promise.all([
                getFlightDetails(token, id_1),
                getFlightDetails(token, id_2),
                getFlightDetails(token, id_3)
              ]);
              setFlights([flight1Data.flight, flight2Data.flight, flight3Data.flight]);
              setUpdate(flightsData.flights.updatedAt);
            }
          } catch (error) {
            console.error("Error fetching recommendations:", error);
          }
        };
    
        fetchFlights();
    }, [getAccessTokenSilently, isAuthenticated]);

    useEffect(() => {
        const fetchHearbeat = async () => {
            if (!isAuthenticated) return;
            try {
                const response = await fetch('https://8ilp4td039.execute-api.us-east-2.amazonaws.com/dev/heartbeat');
                const data = await response.json();
                console.log(data)
                setStatus(data.status);
            } catch (error) {
                console.error("Error fetching status:", error);
        }
    };

        fetchHearbeat();
        const intervalId = setInterval(fetchHearbeat, 5000); // Adjust the interval as needed

        return () => clearInterval(intervalId);
    }, [isAuthenticated]);

    /*const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };*/

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;

    return (
        <div>
        <p>Status: {status ? 'Workers disponibles' : 'Workers no disponibles'}</p>
        {flights ? (
            <>
        <p>Última actualización: {format(new Date(date_update), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es })}</p>
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
        </Box></>) : (
        <p>No hay recomendaciones disponibles.</p>
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

export default Recommendations;