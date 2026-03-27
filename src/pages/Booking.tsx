import React from 'react';
import usePageMeta from '../hooks/usePageMeta';
import StudioBookingForm from '../components/StudioBookingForm';
import '../styles/PageContent.css';
import '../styles/Booking.css';

const Booking: React.FC = () => {
    usePageMeta({
        title: 'Book a Studio Session | PRODBYRIQ',
        description: 'Book a studio session with RIQ. Professional recording environment with an experienced engineer. Check availability and reserve your time.',
        canonicalPath: '/booking',
    });
    return <StudioBookingForm />;
};

export default Booking;
