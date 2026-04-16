import { Link } from 'react-router-dom';
import SpotifyTrack from '../components/SpotifyTrack';
import EmailCapture from '../components/EmailCapture';
import usePageMeta from '../hooks/usePageMeta';
import '../styles/Home.css';
import '../styles/PageContent.css';

const Home = () => {
    usePageMeta({
        title: 'PRODBYRIQ | Beats, Mixing & Music Production',
        description: 'Professional beats, mixing & mastering by RIQ. Buy WAV leases from $50, exclusive licenses from $200, mixing from $75.',
        canonicalPath: '/',
    });

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
        <div className="home-page">

            {/* Hero */}
            <section className="home-hero">
                <div className="home-container">
                    <div className="hero-content">
                        <p className="hero-eyebrow">Remote · Fast Turnaround · Premium Quality</p>
                        <h1>Professional Music Production, Mixing &amp; Mastering</h1>
                        <p className="hero-subtitle">
                            Transform your sound with industry-standard quality.
                            Remote services. Fast turnaround. Premium results.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/beats" className="btn-primary hero-btn">Browse Beats</Link>
                            <Link to="/services" className="btn-secondary hero-btn">View Services</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="home-stats">
                <div className="home-container">
                    <div className="stats-bar">
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Beats Available</span>
                        </div>
                        <div className="stat-divider" aria-hidden="true" />
                        <div className="stat-item">
                            <span className="stat-number">100+</span>
                            <span className="stat-label">Tracks Mixed</span>
                        </div>
                        <div className="stat-divider" aria-hidden="true" />
                        <div className="stat-item">
                            <span className="stat-number">Remote</span>
                            <span className="stat-label">Worldwide Service</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Preview */}
            <section className="home-services">
                <div className="home-container">
                    <div className="section-header">
                        <h2>What I Do</h2>
                        <p className="section-subtitle">Everything you need to take your music to the next level</p>
                    </div>
                    <div className="services-cards">
                        <Link to="/beats" className="service-preview-card">
                            <div className="service-preview-icon" aria-hidden="true">🎵</div>
                            <h3>Beat Leases</h3>
                            <p>Professionally crafted beats in Trap, Drill, R&amp;B, and more.</p>
                            <span className="service-preview-price">From $50</span>
                            <span className="service-preview-link">Browse Beats →</span>
                        </Link>
                        <Link to="/services" className="service-preview-card">
                            <div className="service-preview-icon" aria-hidden="true">🎚️</div>
                            <h3>Mixing &amp; Mastering</h3>
                            <p>Send your stems and get back a polished, release-ready record.</p>
                            <span className="service-preview-price">From $75</span>
                            <span className="service-preview-link">View Services →</span>
                        </Link>
                        <Link to="/services" className="service-preview-card">
                            <div className="service-preview-icon" aria-hidden="true">🎛️</div>
                            <h3>Full Production</h3>
                            <p>Complete song production from initial concept to final master.</p>
                            <span className="service-preview-price">From $250</span>
                            <span className="service-preview-link">Get Started →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Productions */}
            <section className="home-featured">
                <div className="home-container">
                    <div className="section-header">
                        <h2>Featured Productions</h2>
                        <p className="section-subtitle">Recent work — mixed, mastered, and produced by RIQ</p>
                    </div>
                    <div className="tracks-grid">
                        {featuredTracks.map((track, index) => (
                            <div key={index} className="track-item">
                                <p className="track-credit">{track.description}</p>
                                <SpotifyTrack trackUrl={track.url} />
                            </div>
                        ))}
                    </div>
                    <div className="featured-more">
                        <Link to="/featured-work" className="btn-secondary">See All Work →</Link>
                    </div>
                </div>
            </section>

            {/* Email Capture */}
            <section className="home-email-capture">
                <div className="home-container">
                    <div className="email-capture-wrap">
                        <EmailCapture />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
