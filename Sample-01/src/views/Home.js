import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { UserIcon } from "@heroicons/react/24/outline";
import flight from "../assets/flight.svg";

const Home = () => {
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
