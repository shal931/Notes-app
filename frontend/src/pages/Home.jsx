import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to notes page
        navigate('/notes', { replace: true });
    }, [navigate]);

    return null;
};
