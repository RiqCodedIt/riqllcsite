import React, { useEffect } from 'react';
import StudioBookingForm from '../components/StudioBookingForm';
import '../styles/PageContent.css';
import '../styles/Booking.css';

const Booking: React.FC = () => {
    useEffect(() => { document.title = 'Book a Studio Session | PRODBYRIQ'; }, []);
    return <StudioBookingForm />;
};

export default Booking;
