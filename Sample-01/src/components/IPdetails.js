import React, { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';

function IPdetails() {
    const [ipAddress, setIpAddress] = useState('');
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState();
    const [latitude, setlatitude] = useState();
    const [longitude, setlongitude] = useState();
    const apiKey = 'cd1c2a7f5c2541a6ac9fee043bd805a6';

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
            setlatitude(data.latitude);
            setlongitude(data.longitude);
            console.log("LOCATION:", data);
            } catch (error) {
            console.error('Error fetching location:', error);
            }
        }
        };

        fetchLocation();
    }, [ipAddress]);

    const fetchAddress = async () => {
        try {
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const formattedAddress = data.results[0].formatted;
                setAddress(formattedAddress);
                console.log('Address:', formattedAddress);
            } else {
                console.log('No address found for the given coordinates.');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    fetchAddress();
    

    return (
        <div>
            <p>IP Address: {loading ? 'Loading...' : ipAddress}</p>
            {location && (
                <div>
                <Typography variant="subtitle1">Direccion: {address}</Typography>
                <Typography variant="subtitle1">Región: {location.region}</Typography>
                <Typography variant="subtitle1">Pais: {location.country_name}</Typography>
                </div>
            )}           
        </div>
    );
}

export default IPdetails;