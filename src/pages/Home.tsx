import { Link } from 'react-router-dom';
import SpotifyTrack from '../components/SpotifyTrack';
import '../styles/PageContent.css';
import '../styles/Home.css';


const Home = () => {
    const featuredTracks = [
        {
            url: 'https://open.spotify.com/track/3rlbQrNDUyIpF5QPjpFCkV',
            description: 'Mixed & Mastered by RIQ'
        },
        {
            url: 'https://open.spotify.com/track/2hNLyPN3fM0Ds7LASznUkX',
            description: 'Mixed & Mastered by RIQ'
        },
        {
            url: 'https://open.spotify.com/track/7ngZ2kMSW18SHZ7RG3QeOG',
            description: 'Produced by RIQ'
        }
    ];

    return (
        <div className="page-content">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>RIQ Music Production</h1>
                    <p className="hero-subtitle">Professional Music Production, Mixing & Mastering</p>
                    <p className="hero-description">
                        Transform your musical vision into reality with professional production services. 
                        From beat creation to final mastering, I deliver industry-standard quality that makes your music stand out.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/booking" className="cta-button primary">Book a Session</Link>
                        <Link to="/about" className="cta-button secondary">Learn More</Link>
                    </div>
                </div>
            </div>

            <div className="featured-section">
                <h2>Featured Work</h2>
                <p>Listen to some of my recent productions and mixes</p>
                
                <div className="tracks-grid">
                    {featuredTracks.map((track, index) => (
                        <div key={index} className="track-item">
                            <SpotifyTrack 
                                trackUrl={track.url} 
                                description={track.description}
                            />
                        </div>
                    ))}
                </div>
                
                <div className="featured-more">
                    <Link to="/featured-work" className="cta-button secondary">View All Work</Link>
                </div>
            </div>

            <div className="services-preview">
                <h2>Services</h2>
                <div className="services-grid">
                    <div className="service-card">
                        <h3>Beat Production</h3>
                        <p>Custom beats tailored to your style and vision</p>
                        <Link to="/beats" className="service-link">Explore Beats →</Link>
                    </div>
                    <div className="service-card">
                        <h3>Mixing & Mastering</h3>
                        <p>Professional mixing and mastering to industry standards</p>
                        <Link to="/services" className="service-link">View Services →</Link>
                    </div>
                    <div className="service-card">
                        <h3>Full Production</h3>
                        <p>Complete song production from concept to final master</p>
                        <Link to="/booking" className="service-link">Book Session →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
