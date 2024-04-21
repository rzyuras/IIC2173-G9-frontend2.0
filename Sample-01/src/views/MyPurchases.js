import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getPurchase } from '../api/flights';

function PurchaseList({ flightId }) { // Corrected the props destructuring
    const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchPurchase = async () => {
            console.log("Fetching purchase result from flight:", flightId);
            if (!isAuthenticated) return;
            try {
                const token = await getAccessTokenSilently();
                const requestResponse = await getPurchase(token, flightId);
                setPurchases(requestResponse);
                setLoading(false);
                console.log("response:", requestResponse);
            } catch (error) {
                console.error("Error getting flight result:", error);
                setLoading(false);
            }
        };
        fetchPurchase();
    }, [getAccessTokenSilently, isAuthenticated, flightId]);

    if (!isAuthenticated) return <div>Please log in to view this content.</div>;


    return (
        <>
        <h1>My Flights</h1>
        <h2>{loading ? 'Esperando respuesta' : ''}</h2>
        </>
    )
}

export default PurchaseList;