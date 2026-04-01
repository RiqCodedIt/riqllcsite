import usePageMeta from '../hooks/usePageMeta';
import '../styles/PageContent.css';
import '../styles/About.css';

const About = () => {
    usePageMeta({
        title: 'About | PRODBYRIQ',
        description: 'RIQ is a professional music producer and mix engineer. Learn about the experience and credits behind PRODBYRIQ.',
        canonicalPath: '/about',
    });
    return (
        <div className="page-content">
            <div className="about-hero">
                <div className="about-content">
                    <h1>About RIQ</h1>
                    <p className="about-subtitle">Music Producer, Audio Engineer &amp; Creative Visionary</p>
                </div>
            </div>

            {/* Producer Photo + Bio */}
            <div className="about-photo-section">
                <div className="about-photo-wrapper">
                    {/* Replace /producer-photo.jpg with the real asset path when available */}
                    <div className="about-photo-placeholder" role="img" aria-label="Producer photo">
                        <span className="about-photo-initials" aria-hidden="true">RIQ</span>
                    </div>
                </div>
                <div className="about-photo-bio">
                    <h2>Tariq Georges</h2>
                    <p className="about-photo-role">Producer · Mix Engineer · Pianist</p>
                    <p>
                        Tariq Georges is a multi-faceted musician trained in classical piano since age 4.
                        A self-taught producer and audio engineer, he built his craft during 2020 and now
                        works with artists from Boston, London, and beyond to deliver industry-grade records.
                    </p>
                </div>
            </div>

            <div className="about-sections">
                <div className="about-section">
                    <h2>My Story</h2>
                    <p>
                        Tariq Georges is a multi-faceted musician who was trained in classical music.
                        He has been playing the piano since the age of 4 and is a self-taught producer and audio engineer.
                        He started making beats in 2020 when COVID-19 hit and used that time to develop his skills
                        as a producer and engineer. He now works with artists from Boston, London, and beyond
                        to make beautiful tracks.
                    </p>
                </div>

                {/* Credits */}
                <div className="about-section">
                    <h2>Credits</h2>
                    <p className="about-credits-intro">Selected production, mixing, and mastering work.</p>
                    <ul className="about-credits-list">
                        {/* Replace these placeholders with real credits */}
                        <li className="about-credit-item">
                            <span className="about-credit-title">Credit Title &mdash; Artist Name</span>
                            <span className="about-credit-role">Produced by RIQ</span>
                        </li>
                        <li className="about-credit-item">
                            <span className="about-credit-title">Credit Title &mdash; Artist Name</span>
                            <span className="about-credit-role">Mixed &amp; Mastered by RIQ</span>
                        </li>
                        <li className="about-credit-item">
                            <span className="about-credit-title">Credit Title &mdash; Artist Name</span>
                            <span className="about-credit-role">Mixed by RIQ</span>
                        </li>
                    </ul>
                </div>

                <div className="about-section">
                    <h2>What I Do</h2>
                    <div className="services-list">
                        <div className="service-item">
                            <h3>Music Production</h3>
                            <p>Complete song production from initial concept to final arrangement</p>
                        </div>
                        <div className="service-item">
                            <h3>Beat Making</h3>
                            <p>Custom beat creation for any genre!</p>
                        </div>
                        <div className="service-item">
                            <h3>Mixing</h3>
                            <p>Professional mixing services to polish your recordings to industry standards.</p>
                        </div>
                        <div className="service-item">
                            <h3>Mastering</h3>
                            <p>Final mastering to ensure your tracks are leveled across all streaming services.</p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>My Approach</h2>
                    <p>
                        Every project is unique, and I believe in working closely with each artist to understand
                        their vision and goals. Whether you&apos;re looking for a specific sound or want to explore
                        new creative territories, I&apos;m here to guide you through the process.
                    </p>
                </div>

                {/* Testimonials */}
                <div className="about-section">
                    <h2>What Artists Say</h2>
                    <div className="about-testimonials">
                        {/* Replace placeholder quotes with real client reviews */}
                        <blockquote className="about-testimonial">
                            <p>&ldquo;Testimonial quote goes here &mdash; replace with a real client review.&rdquo;</p>
                            <cite>&mdash; Artist Name</cite>
                        </blockquote>
                        <blockquote className="about-testimonial">
                            <p>&ldquo;Second testimonial quote goes here &mdash; replace with a real client review.&rdquo;</p>
                            <cite>&mdash; Artist Name</cite>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
