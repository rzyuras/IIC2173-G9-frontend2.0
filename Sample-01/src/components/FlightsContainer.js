import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Picker from './QuantityPicker'; // Assuming the Picker component is in the same directory

const FlightsContainer = ({ flights, onExchange }) => {
    const [quantities, setQuantities] = useState({});

    const handlePickerChange = (flightId, value) => {
        setQuantities({
            ...quantities,
            [flightId]: parseInt(value, 10) // Ensure the value is an integer
        });
        console.log("quantity", quantities);
    };

    return (
        <div className=''>
            <Box sx={{ flexGrow: 1, margin: 3 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead style={{ backgroundColor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell>Aerolínea</TableCell>
                                <TableCell align="right">Salida</TableCell>
                                <TableCell align="right">Llegada</TableCell>
                                <TableCell align="right">Aeropuerto Salida</TableCell>
                                <TableCell align="right">Aeropuerto Destino</TableCell>
                                <TableCell align="right">Precio por Persona</TableCell>
                                <TableCell align="center">Cantidad</TableCell>
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
                                    <TableCell align="right">{flight.departure_airport_name}</TableCell>
                                    <TableCell align="right">{flight.arrival_airport_name}</TableCell>
                                    <TableCell align="right">${formatNumber(flight.price)} {flight.currency}</TableCell>
                                    <TableCell align="center">
                                        <Picker min={0} max={flight.group_tickets} onChange={(value) => handlePickerChange(flight.id, value)} value={quantities[flight.id] || 0} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            onClick={() => onExchange(flight.id, quantities[flight.id] || 0)} 
                                            disabled={(quantities[flight.id] || 0) === 0}
                                        >
                                            Intercambiar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
};

export default FlightsContainer;

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
