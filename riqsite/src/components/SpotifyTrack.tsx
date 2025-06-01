import { useState, useEffect } from 'react';

interface SpotifyTrackProps {
    trackUrl: string;
    description?: string;
}

interface TrackData {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    external_urls: {
        spotify: string;
    };
}

const SpotifyTrack = ({ trackUrl, description }: SpotifyTrackProps) => {
    const [trackData, setTrackData] = useState<TrackData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Extract track ID from Spotify URL
    const getTrackId = (url: string): string | null => {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const fetchTrackData = async () => {
            const trackId = getTrackId(trackUrl);
            if (!trackId) {
                setError('Invalid Spotify URL');
                setLoading(false);
                return;
            }

            try {
                // For demo purposes, we'll use the embed player
                // In production, you'd fetch from Spotify API
                setTrackData({
                    id: trackId,
                    name: 'Track Name',
                    artists: [{ name: 'Artist Name' }],
                    album: {
                        name: 'Album Name',
                        images: [{ url: '' }]
                    },
                    external_urls: {
                        spotify: trackUrl
                    }
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to load track data');
                setLoading(false);
            }
        };

        fetchTrackData();
    }, [trackUrl]);

    if (loading) {
        return <div className="loading-indicator">Loading track...</div>;
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    const trackId = getTrackId(trackUrl);

    return (
        <div className="spotify-track">
            {description && <p className="track-description">{description}</p>}
            <iframe
                src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
        </div>
    );
};

export default SpotifyTrack;
