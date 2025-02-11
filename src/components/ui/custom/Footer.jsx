import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


const Footer = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>TravelXP</h3>
                    <p>Your AI-powered travel companion for creating personalized trip itineraries.</p>
                </div>
                
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/create-trip">Plan Trip</Link>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        scrollToSection('about');
                    }}>About Us</a>
                    <a href="#contact">Contact</a>
                </div>

                <div className="footer-section">
                    <h4>Connect With Us</h4>
                    <div className="social-links">
                        <a href="https://github.com/Prigoistic" target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </a>
                        <a href="https://www.linkedin.com/in/priyam-ghosh-252076231/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaXTwitter />
                        </a>
                    </div>
                </div>

            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 TravelXP. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer; 