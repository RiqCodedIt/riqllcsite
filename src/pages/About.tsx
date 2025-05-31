import '../styles/PageContent.css';
import '../styles/About.css';

const About = () => {
    return (
        <div className="page-content">
            <div className="about-hero">
                <div className="about-content">
                    <h1>About RIQ</h1>
                    <p className="about-subtitle">Music Producer, Audio Engineer & Creative Visionary</p>
                </div>
            </div>

            <div className="about-sections">
                <div className="about-section">
                    <h2>My Story</h2>
                    <p>
                        With years of experience in music production and audio engineering, I've dedicated my career 
                        to helping artists bring their musical visions to life. From hip-hop to R&B, pop to electronic, 
                        I work across genres to create professional, industry-standard productions.
                    </p>
                    <p>
                        My passion for music started early, and through continuous learning and collaboration with 
                        talented artists, I've developed a unique approach that combines technical expertise with 
                        creative innovation.
                    </p>
                </div>

                <div className="about-section">
                    <h2>What I Do</h2>
                    <div className="services-list">
                        <div className="service-item">
                            <h3>Music Production</h3>
                            <p>Complete song production from initial concept to final arrangement, including instrumentation, programming, and creative direction.</p>
                        </div>
                        <div className="service-item">
                            <h3>Beat Making</h3>
                            <p>Custom beat creation across multiple genres, tailored to your style and artistic vision.</p>
                        </div>
                        <div className="service-item">
                            <h3>Mixing</h3>
                            <p>Professional mixing services to balance, enhance, and polish your recordings to industry standards.</p>
                        </div>
                        <div className="service-item">
                            <h3>Mastering</h3>
                            <p>Final mastering to ensure your tracks sound great across all playback systems and streaming platforms.</p>
                        </div>
                    </div>
                </div>

                <div className="about-section">
                    <h2>My Approach</h2>
                    <p>
                        Every project is unique, and I believe in working closely with each artist to understand 
                        their vision and goals. Whether you're looking for a specific sound or want to explore 
                        new creative territories, I'm here to guide you through the process.
                    </p>
                    <p>
                        I use industry-standard equipment and software, combined with years of experience and 
                        a keen ear for detail, to deliver professional results that meet today's music industry standards.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Let's Work Together</h2>
                    <p>
                        Ready to take your music to the next level? I'm always excited to work with new artists 
                        and help bring fresh ideas to life. Whether you need a single beat, full production, 
                        or mixing and mastering services, let's discuss your project.
                    </p>
                    <div className="contact-info">
                        <p>Get in touch to discuss your next project and see how we can create something amazing together.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
