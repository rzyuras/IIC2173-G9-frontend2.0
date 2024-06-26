import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { commitTransaction } from "../api/flights"; 
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

function PurchaseCompleted() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchase = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const token_ws = searchParams.get('token_ws');
            const userEmail = user.email;
            const purchaseUuid = localStorage.getItem('purchaseUuid');
            const response = await commitTransaction(token, token_ws, userEmail, purchaseUuid);
            setData(response);
            localStorage.clear();

            if (response.message !== "Pago Aprobado") {
                setError(true)
            }
            
            setLoading(false);
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
    {loading ? (
      <h2>Cargando...</h2>
    ) : error ? 
    <div className='purchase'>
    <h1 className='text-center mb-4'>{data.message}</h1> 
    <div className='btn-container'><button onClick={() => navigate(`/`)} className="btn">Volver al inicio</button> </div>
    </div> : (
      <div className='purchase'>
        <h1 className='text-center mb-4'>{data.message}</h1>
        <div className='btn-container'><button onClick={() => navigate(`/mypurchases`)} className="btn">Ir a mis solicitudes</button></div>
      </div>
    )}
  </>);
}

export default PurchaseCompleted;
