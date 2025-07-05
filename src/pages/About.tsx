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
                        Tariq Georges is a multi-faceted Musician that has been trained in classical music. 
                        He has been playing the piano since the age of 4 and is a self taught producer and audio engineer.
                        He has been making beats since 2020 when COVID-19 hit. He used that time to develop his skills 
                        as a producer and engineer. He now works with a variety of artists from Boston, London, 
                        and more to make beautiful tracks.
                    </p>
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
                        their vision and goals. Whether you're looking for a specific sound or want to explore 
                        new creative territories, I'm here to guide you through the process.
                    </p>
                </div>

                {/* <div className="about-section">
                    <h2>Let's Work Together</h2>
                    <p>
                        Ready to take your music to the next level? I'm always excited to work with new artists 
                        and help bring fresh ideas to life. Whether you need a single beat, full production, 
                        or mixing and mastering services, let's discuss your project.
                    </p>
                    <div className="contact-info">
                        <p>Get in touch to discuss your next project and see how we can create something amazing together.</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default About;
