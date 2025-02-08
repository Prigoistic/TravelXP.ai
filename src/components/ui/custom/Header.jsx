import { Link } from 'react-router-dom';
import { useState } from 'react';
import AuthModal from '../../AuthModal';
import { useAuth } from '../../../context/AuthContext';
import { auth } from '../../../configfile/firebase';
import { signOut } from 'firebase/auth';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="main-logo">
      <Link to="/">
        <img src="/logo.svg" alt="TravelXP.ai" style={{ height: '40px' }} />
      </Link>
      <div className="auth-buttons">
        {user ? (
          <div className="user-section">
            <FaUserCircle className="profile-icon" />
            <span className="user-name">
              {user.displayName || user.email}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="login-btn"
          >
            Login
          </button>
        )}
      </div>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
};

export default Header;