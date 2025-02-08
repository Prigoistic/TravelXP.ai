import { useState } from 'react';
import { auth, googleProvider } from '../configfile/firebase';
import { 
  signInWithPopup,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import '../styles/authModal.css';
import { FcGoogle } from 'react-icons/fc';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google Sign In Success:', result.user);
      onAuthSuccess?.(result.user);
      onClose();
    } catch (error) {
      console.error('Authentication Error:', error);
      setError(error.message);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let userCredential;
      
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      }

      console.log('Email Auth Success:', userCredential.user);
      onAuthSuccess?.(userCredential.user);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-layout">
          <div className="modal-info">
            <div className="modal-logo">
              <img src="/logo.svg" alt="TravelXP.ai" />
            </div>
            <h2>{isLogin ? 'Welcome Back!' : 'Join Us'}</h2>
            <p>{isLogin ? 
              'Access your personalized travel plans' : 
              'Start creating amazing travel experiences'}
            </p>
          </div>
          <div className="modal-form">
            <button onClick={handleGoogleSignIn} className="google-signin-btn">
              <FcGoogle />
              <span>Continue with Google</span>
            </button>
            
            <div className="divider">
              <span>or</span>
            </div>

            {error && <div className="auth-error">{error}</div>}
            
            <form onSubmit={handleEmailAuth}>
              <div className="form-fields">
                {!isLogin && (
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
            <div className="switch-mode">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 