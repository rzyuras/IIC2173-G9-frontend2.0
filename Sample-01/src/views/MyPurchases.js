import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getPurchase, getFlightDetails } from '../api/flights';
import { Paper, Typography } from '@mui/material';
import flightSVG from "../assets/flight.svg";
import IPdetails from '../components/IPdetails';

function PurchaseList() {
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flightDetails, setFlightDetails] = useState({});

    useEffect(() => {
        const fetchPurchase = async () => {
            if (!isAuthenticated) return;
            setLoading(true);
            try {
                const token = await getAccessTokenSilently();
                const purchaseResults = await getPurchase(token);
                setPurchases(purchaseResults.purchases || []);
                setLoading(false);
                // Fetch details for each flight purchased
                purchaseResults.purchases.forEach(async (purchase) => {
                    const details = await getFlightDetails(token, purchase.flight_id);
                    // Ensuring we access the nested flight object correctly
                    setFlightDetails(prev => ({...prev, [purchase.flight_id]: details.flight}));
                });
            } catch (error) {
                console.error("Error fetching purchases:", error);
                setLoading(false);
            }
        };
        fetchPurchase();
    }, [getAccessTokenSilently, isAuthenticated]);

    if (!isAuthenticated) {
        return <div>Please log in to view this content.</div>;
    }

    return (
        <>
            <h1>Mis solicitudes de compra</h1>
            {loading ? (
                <h2>Cargando...</h2>
            ) : (
                <div>
                    {purchases.length > 0 ? (
                        purchases.map((purchase) => (
                            <Paper key={purchase.id} elevation={3} style={{ margin: "10px", padding: "15px" }}>
                                <Typography variant="h6" style={{color: "gray"}}>ID del vuelo: {purchase.flight_id}</Typography>
                                 {flightDetails[purchase.flight_id] && (
                                    <Typography className="airline" variant="h6" gutterBottom>
                                        <img src={flightDetails[purchase.flight_id].airline_logo} className="Airline-Logo" alt="Airline Logo" style={{ verticalAlign: 'middle', marginRight: 8 }} width={25}/>
                                        {flightDetails[purchase.flight_id].airline}
                                    </Typography>
                                )}
                                <Typography variant="h6">
                                    Salida: {flightDetails[purchase.flight_id] ? flightDetails[purchase.flight_id].departure_airport_name : "Loading..."}
                                </Typography>
                                <Typography variant="h6">
                                    Destino: {flightDetails[purchase.flight_id] ? flightDetails[purchase.flight_id].arrival_airport_name : "Loading..."}
                                </Typography>
                                <Typography variant="h6">Boletos: {purchase.quantity}</Typography>
                                <Typography variant="h6">Estado: {purchase.purchase_status}</Typography>
                                <hr/>
                                <Typography variant="h5">
                                    Precio Total: $
                                    {flightDetails[purchase.flight_id] ? (flightDetails[purchase.flight_id].price * purchase.quantity).toLocaleString() : "Loading..."}  {' '}
                                    {flightDetails[purchase.flight_id] && flightDetails[purchase.flight_id].currency}
                                </Typography>
                                {/*<hr/>
                                <IPdetails></IPdetails>*/}
                            </Paper>
                        ))
                    ) : (
                        <Typography>No purchases found.</Typography>
                    )}
                </div>
            )}
        </>
    );
}

export default PurchaseList;
