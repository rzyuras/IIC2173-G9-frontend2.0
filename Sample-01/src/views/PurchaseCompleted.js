import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { commitTransaction } from "../api/flights"; 
import { useAuth0 } from '@auth0/auth0-react';

function PurchaseCompleted() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const fetchPurchase = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            const token_ws = searchParams.get('token_ws');
            const response = await commitTransaction(token, token_ws);
            setData(response || []);
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
    ) : (
    <div className="p-8 mt-20 flex flex-col gap-3 w-1/3 mx-auto rounded-xl shadow-[0_0px_8px_#b4b4b4]">
      <h1 className="text-center">Purchase Completed</h1>
      {/*<p>{data.message}</p>*/}
      <Link to="/mypurchases" className="bg-black text-white px-3 py-2 rounded text-center">Ir a mis solicitudes</Link>
    </div>
  )};
    </>
  )}

export default PurchaseCompleted;