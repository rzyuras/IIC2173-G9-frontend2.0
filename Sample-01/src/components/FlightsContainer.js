import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Box
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FlightsContainer = ({ flights, children }) => {
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
                                    <TableCell align="right">Sigla Salida</TableCell>
                                    <TableCell align="right">Aeropuerto Salida</TableCell>
                                    <TableCell align="right">Sigla Destino</TableCell>
                                    <TableCell align="right">Aeropuerto Destino</TableCell>
                                    <TableCell align="right">Precio por Persona</TableCell>
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
                                        <TableCell align="center" >{children}</TableCell>
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