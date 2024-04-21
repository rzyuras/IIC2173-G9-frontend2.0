import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { UserIcon } from "@heroicons/react/24/outline";
import flight from "../assets/flight.svg";
import PopUp from "../components/PopUp";

const Home = () => {
  const [showPopUp, setPopUp] = useState(false);

  const openPopUp = () => {
    setPopUp(true);
  };

  const closePopUp = () => {
    setPopUp(false);
  };

  const [ipAddress, setIpAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching IP address:', error);
        setLoading(false);
      }
    };

    fetchIpAddress();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (ipAddress) {
        try {
          const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
          const data = await response.json();
          setLocation(data);
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      }
    };

    fetchLocation();
  }, [ipAddress]);

  return (
    <div className="text-center hero my-5">
      <img src={flight} alt="app logo" width="180" />
      <h1 className="mb-4">FlightsApp</h1>
      <div>
        <p className="lead">Volar nunca fue tan fácil.</p>
        <div>
          <p>IP Address: {loading ? 'Loading...' : ipAddress}</p>
          {location && (
            <div>
              <p>Country: {location.country_name}</p>
              <p>Region: {location.region}</p>
              <p>City: {location.city}</p>
              <p>Postal Code: {location.postal}</p>
            </div>
          )}
        </div>
        <button className="btn" onClick={openPopUp}>Open Modal</button>
        {showPopUp && (
          <PopUp onClose={closePopUp}>
            <h2>Pop-up Message</h2>
            <p>This is a pop-up message!</p>
          </PopUp>
        )}
      </div>
    </div>
  );
};

export default Home;
