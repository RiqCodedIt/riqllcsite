import React from 'react';
import usePageTitle from '../hooks/usePageTitle';
import StudioBookingForm from '../components/StudioBookingForm';
import '../styles/PageContent.css';
import '../styles/Booking.css';

const Booking: React.FC = () => {
    usePageTitle('Book a Studio Session | PRODBYRIQ');
    return <StudioBookingForm />;
};

export default Booking;
