import { useQuery } from "@tanstack/react-query";
import { getTickets } from "../api/tickets";
//import Card from "../components/Card";
import React from "react";
import flight from "../assets/flight.svg";


const Home = () => {
  /*const { data, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: () => getTickets()
  });

  if (isLoading) {
    return <p>Loading...</p>
  }

  console.log(data);*/

  return (
    <div className="text-center hero my-5">
      <img src={flight} alt="app logo" width="180" />
      <h1 className="mb-4">FlightsApp</h1>
      <div>
        <p className="lead">Volar nunca fue tan fácil.</p>
      </div>
    </div>
  );
};

export default Home;