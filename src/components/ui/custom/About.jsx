import { FaPlane, FaRobot, FaHeart } from 'react-icons/fa';

const About = () => {
    return (
        <div className="about-container" id="about">
            <div className="about-header">
                <h1>About <span className="highlight">TravelXP</span></h1>
                <p className="subtitle">Revolutionizing Travel Planning with AI</p>
            </div>

            <div className="about-grid">
                <div className="about-card">
                    <FaRobot className="about-icon" />
                    <h2>AI-Powered Planning</h2>
                    <p>Our advanced AI algorithms analyze thousands of travel data points to create personalized itineraries that match your unique preferences, style, and budget.</p>
                </div>

                <div className="about-card">
                    <FaPlane className="about-icon" />
                    <h2>Smart Recommendations</h2>
                    <p>Discover hidden gems and local favorites with our intelligent recommendation system that goes beyond typical tourist attractions.</p>
                </div>

                <div className="about-card">
                    <FaHeart className="about-icon" />
                    <h2>Personalized Experience</h2>
                    <p>Every journey is unique, just like you. We tailor each itinerary to your interests, pace preferences, and travel style.</p>
                </div>
            </div>

            <div className="about-content">
                <h2>Our Mission</h2>
                <p>At TravelXP, we believe that every journey should be extraordinary. Our mission is to combine the power of artificial intelligence with human wanderlust to create travel experiences that are both efficient and unforgettable.</p>
                
                <h2>How It Works</h2>
                <p>Simply tell us your destination, preferences, and travel style. Our AI analyzes countless data points, reviews, and local insights to craft a personalized itinerary that maximizes your travel experience while respecting your time and budget.</p>
                
                <h2>Why Choose Us</h2>
                <p>We're not just another travel planner. Our AI-powered platform learns from each interaction, continuously improving its recommendations to provide you with the most relevant and exciting travel suggestions.</p>
            </div>
        </div>
    );
};

export default About; 