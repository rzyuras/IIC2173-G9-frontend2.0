import React, { useEffect, useState } from 'react';

function IPdetails() {
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
    );
}

export default IPdetails;
