import { useState, useEffect } from 'react';   
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Input from '../components/ui/input';
import { tripOptions } from '../constant/pickoption';
import { FaUsers, FaHeart, FaBriefcase, FaUserAlt } from 'react-icons/fa';
import { FaMoneyBill, FaMoneyBillWave, FaMoneyBillAlt, FaGem } from 'react-icons/fa';
import { 
    MdRestaurant, 
    MdMuseum, 
    MdNaturePeople, 
    MdShoppingBag, 
    MdSpa, 
    MdSportsHandball, 
    MdLocalMovies,
    MdDirectionsRun, 
    MdDirectionsWalk, 
    MdHotel 
} from 'react-icons/md';
import Button from '../components/ui/button';
import { Toaster, toast } from 'sonner';
import DeepseekAI from '../configfile/Deepseek';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/form.css';

const Form = () => {
    const [destination, setDestination] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedBudget, setSelectedBudget] = useState("");
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [selectedPace, setSelectedPace] = useState("");
    const [formData, setFormData] = useState({
        destination: "",
        startDate: new Date(),
        days: "5",
        type: "Leisure",
        budget: "Budget Friendly",
        travelers: "2",
        travelStyle: "Relaxed",
        interests: [],
        pace: ""
    });
    const [showAIResponse, setShowAIResponse] = useState(false);
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            startDate: date
        }));
    };

    useEffect(() => {   
        console.log(formData);
    }, [formData]);

    const getIcon = (value) => {
        const iconMap = {
            'solo': <FaUserAlt />,
            'family': <FaUsers />,
            'romantic': <FaHeart />,
            'business': <FaBriefcase />,
            'group': <FaUsers />,
            'budget': <FaMoneyBill />,
            'mid': <FaMoneyBillWave />,
            'luxury': <FaMoneyBillAlt />,
            'ultra': <FaGem />,
            'cultural': <MdMuseum />,
            'adventure': <MdSportsHandball />,
            'food': <MdRestaurant />,
            'nature': <MdNaturePeople />,
            'shopping': <MdShoppingBag />,
            'relaxation': <MdSpa />,
            'entertainment': <MdLocalMovies />,
            'relaxed': <MdHotel />,
            'moderate': <MdDirectionsWalk />,
            'fast': <MdDirectionsRun />
        };
        
        return iconMap[value] || null;
    };

    const handleGenerateTrip = () => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }

        const missingFields = [];
        
        if (!formData.destination) missingFields.push('Destination');
        if (!formData.days) missingFields.push('Number of Days');
        if (!formData.type) missingFields.push('Trip Type');
        if (!formData.budget) missingFields.push('Budget Range');
        if (formData.interests.length === 0) missingFields.push('Interests');
        if (!formData.pace) missingFields.push('Travel Pace');

        if (missingFields.length > 0) {
            toast.error('Missing Required Fields', {
                description: (
                    <ul className="missing-fields-list">
                        {missingFields.map(field => (
                            <li key={field}>{field}</li>
                        ))}
                    </ul>
                ),
                duration: 5000,
            });
            return;
        }

        // Show success toast
        toast.success('Generating your travel plan...', {
            duration: 2000,
        });

        // Navigate to travel plan page
        navigate('/travel-plan', { 
            state: {
                ...formData
            }
        });
    };

    const handleAuthSuccess = (user) => {
        setIsAuthenticated(true);
        setUser(user);
        toast.success(`Welcome ${user.displayName || user.email}!`);
    };

    return (
        <div className="form-container">
            <h2 className="form1">Share your travel preferences with us</h2>
            <p>Get a personalized AI-generated travel itinerary tailored to your preferences. Save time, explore efficiently, and experience unforgettable adventures—all with the power of AI!</p>
            <div className="form-container-input">
                <div>
                    <h2 className="form-title">What is your destination?</h2>
                    <GooglePlacesAutocomplete 
                        apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                        selectProps={{ 
                            destination,
                            onChange: (value) => {
                                setDestination(value);
                                handleInputChange('destination', value);
                            },
                            placeholder: "Enter destination",
                            isClearable: true,
                            className: "google-places-autocomplete"
                        }}
                        autocompletionRequest={{
                            types: ['(cities)']
                        }}
                    />
                </div>
                <div className="form-container-input-number">
                    <h2 className="form-title">Start Date</h2>
                    <DatePicker
                        selected={formData.startDate}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        className="date-picker"
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select start date"
                    />
                </div>
                <div className="form-container-input-number">
                    <h2 className="form-title">Number of Days</h2>
                    <input
                        type="number"
                        min="1"
                        max="30"
                        value={formData.days}
                        onChange={(e) => handleInputChange('days', Math.min(30, Math.max(1, e.target.value)))}
                        className="days-input"
                        placeholder="Enter number of days"
                    />
                </div>
                <div>
                    <h2 className="form-title">What type of trip are you planning?</h2>
                    <div className="options-grid">
                        {tripOptions.tripType.map((type) => (
                            <button
                                key={type.id}
                                className={`option-button ${selectedType === type.value ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedType(type.value);
                                    handleInputChange('type', type.value);
                                }}
                            >
                                {getIcon(type.value)}
                                <span className="option-text">{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="form-title">What is your budget range?</h2>
                    <div className="options-grid">
                        {tripOptions.budget.map((budget) => (
                            <button
                                key={budget.id}
                                className={`option-button ${selectedBudget === budget.value ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedBudget(budget.value);
                                    handleInputChange('budget', budget.value);
                                }}
                            >
                                {getIcon(budget.value)}
                                <span className="range">{budget.range}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="form-title">What are your interests?</h2>
                    <div className="options-grid">
                        {tripOptions.interests.map((interest) => (
                            <button
                                key={interest.id}
                                className={`option-button ${selectedInterests.includes(interest.value) ? 'selected' : ''}`}
                                onClick={() => {
                                    const newInterests = selectedInterests.includes(interest.value)
                                        ? selectedInterests.filter(i => i !== interest.value)
                                        : [...selectedInterests, interest.value];
                                    setSelectedInterests(newInterests);
                                    handleInputChange('interests', newInterests);
                                }}
                            >
                                {getIcon(interest.value)}
                                <span className="option-text">{interest.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="form-title">What&apos;s your preferred travel pace?</h2>
                    <div className="options-grid">
                        {tripOptions.pace.map((pace) => (
                            <button
                                key={pace.id}
                                className={`option-button ${selectedPace === pace.value ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedPace(pace.value);
                                    handleInputChange('pace', pace.value);
                                }}
                            >
                                {getIcon(pace.value)}
                                <span className="option-text">{pace.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="form-footer">
                <Button 
                    text="Generate My Trip" 
                    onClick={handleGenerateTrip}
                    className="form-footer-button"
                />
            </div>
            {showAIResponse && <DeepseekAI formData={formData} />}
            <Toaster 
                theme="dark"
                position="top-center"
                expand
                richColors
                style={{
                    marginTop: '20px'
                }}
            />
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={handleAuthSuccess}
            />
        </div>
    );
}

export default Form;
