import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PageContent.css';
import '../styles/FeaturedWork.css';

interface Track {
    id: string;
    title: string;
    platform: 'spotify' | 'soundcloud';
    embedCode: string;
    url: string;
    description?: string;
}

const FeaturedWork = () => {
    const [filter, setFilter] = useState<'all' | 'spotify' | 'soundcloud'>('all');

    // Sample tracks - you can easily add more here
    const tracks: Track[] = [
        {
            id: '1',
            title: 'Track 1',
            platform: 'spotify',
            embedCode: `<iframe src="https://open.spotify.com/embed/track/3rlbQrNDUyIpF5QPjpFCkV?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
            url: 'https://open.spotify.com/track/3rlbQrNDUyIpF5QPjpFCkV',
            description: 'Mixed & Mastered by RIQ'
        },
        {
            id: '2',
            title: 'Track 2',
            platform: 'spotify',
            embedCode: `<iframe src="https://open.spotify.com/embed/track/2hNLyPN3fM0Ds7LASznUkX?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
            url: 'https://open.spotify.com/track/2hNLyPN3fM0Ds7LASznUkX',
            description: 'Mixed & Mastered by RIQ'
        },
        {
            id: '3',
            title: 'Track 3',
            platform: 'spotify',
            embedCode: `<iframe src="https://open.spotify.com/embed/track/7ngZ2kMSW18SHZ7RG3QeOG?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
            url: 'https://open.spotify.com/track/7ngZ2kMSW18SHZ7RG3QeOG',
            description: 'Produced by RIQ'
        },
        {
            id: '4',
            title: 'mvp w/ j dean + sophia [OUT ON ALL PLATS]',
            platform: 'soundcloud',
            embedCode: `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2065978932&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`,
            url: 'https://soundcloud.com/prodbyriq/mvp-w-j-dean-sophia?si=c61117b0c94148f4a442668189746841&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
            description: 'Collaborative track featuring J Dean and Sophia'
        }
        // Add more tracks here as needed
    ];

    const filteredTracks = tracks.filter(track => {
        if (filter === 'all') return true;
        return track.platform === filter;
    });

    const getFilterButtonClass = (buttonFilter: string) => {
        return `filter-button ${filter === buttonFilter ? 'active' : ''}`;
    };

    return (
        <div className="page-content">
            <div className="featured-work-hero">
                <h1>Featured Work</h1>
                <p className="featured-work-subtitle">
                    Explore my complete catalog of released music across all platforms
                </p>
                <p className="featured-work-description">
                    From collaborative projects to solo productions, discover the full range of my musical work 
                    available on Spotify, SoundCloud, and other streaming platforms.
                </p>
            </div>

            <div className="filter-section">
                <h2>Filter by Platform</h2>
                <div className="filter-buttons">
                    <button 
                        className={getFilterButtonClass('all')}
                        onClick={() => setFilter('all')}
                    >
                        All Platforms
                    </button>
                    <button 
                        className={getFilterButtonClass('spotify')}
                        onClick={() => setFilter('spotify')}
                    >
                        Spotify
                    </button>
                    <button 
                        className={getFilterButtonClass('soundcloud')}
                        onClick={() => setFilter('soundcloud')}
                    >
                        SoundCloud
                    </button>
                </div>
            </div>

            <div className="tracks-section">
                <div className="tracks-count">
                    <p>Showing {filteredTracks.length} track{filteredTracks.length !== 1 ? 's' : ''}</p>
                </div>
                
                <div className="tracks-grid">
                    {filteredTracks.length > 0 ? (
                        filteredTracks.map((track) => (
                            <div key={track.id} className="track-card">
                                <div className="track-header">
                                    <h3>{track.title}</h3>
                                    <span className={`platform-badge ${track.platform}`}>
                                        {track.platform === 'spotify' ? 'Spotify' : 'SoundCloud'}
                                    </span>
                                </div>
                                
                                {track.description && (
                                    <p className="track-description">{track.description}</p>
                                )}
                                
                                <div className="track-embed">
                                    {track.platform === 'spotify' ? (
                                        <div dangerouslySetInnerHTML={{ __html: track.embedCode }} />
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: track.embedCode }} />
                                    )}
                                </div>
                                
                                <div className="track-actions">
                                    <a 
                                        href={track.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="track-link"
                                    >
                                        Listen on {track.platform === 'spotify' ? 'Spotify' : 'SoundCloud'}
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-tracks">
                            <p>No tracks found for the selected platform.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="featured-work-cta">
                <h2>Ready to Work Together?</h2>
                <p>Let's create your next hit track</p>
                <div className="cta-buttons">
                    <Link to="/booking" className="cta-button primary">Book a Session</Link>
                    <Link to="/beats" className="cta-button secondary">Browse Beats</Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedWork;
