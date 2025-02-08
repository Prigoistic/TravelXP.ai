import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PropTypes from 'prop-types';
import '../styles/deep.css';

// Initialize Gemini with configuration
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

const validateDayStructure = (day) => {
    const timeFields = ['time', 'placeName', 'placeDetails', 'duration', 'transportation'];
    

    if (!day.theme) return false;
    
    return ['morning', 'afternoon', 'evening'].every(time => {
        if (!day[time]) return true; // Optional time periods
        return timeFields.every(field => day[time][field] !== undefined);
    });
};

const DeepseekAI = ({ formData }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const generateTravelPlan = async () => {
    if (!formData || Object.keys(formData).length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = JSON.stringify({
        destination: formData.destination,
        days: formData.days,
        budget: formData.budget,
        type: formData.type
      });

      const cachedResult = localStorage.getItem(cacheKey);
      if (cachedResult) {
        const parsed = JSON.parse(cachedResult);
        setResponse(parsed);
        if (formData.onResponse) {
          formData.onResponse(parsed);
        }
        setLoading(false);
        return;
      }

      // If no cache, make API call
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('API key is missing');
      }

      const model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 8192,
        }
      });

      const prompt = `Create a travel plan for ${formData.destination?.label || formData.destination} 
        for ${formData.days} days with a ${formData.budget} budget.
        Return a JSON object with this exact structure:
        {
          "hotelOptions": [
            {
              "name": "Hotel Name",
              "address": "Hotel Address",
              "price": "Price Range",
              "rating": 4.5
            }
          ],
          "itinerary": {
            "day1": {
              "morning": {
                "activity": "Activity Description",
                "duration": "2 hours",
                "location": "Location Name"
              },
              "afternoon": {
                "activity": "Activity Description",
                "duration": "3 hours",
                "location": "Location Name"
              },
              "evening": {
                "activity": "Activity Description",
                "duration": "2 hours",
                "location": "Location Name"
              }
            }
          }
        }`;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      
      setRetryCount(0);
      
      const cleanedText = text
        .replace(/```json\s*|\s*```/g, '')
        .replace(/[\u201C\u201D\u2018\u2019]/g, '"')
        .trim();

      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      if (!parsedResponse.hotelOptions || !parsedResponse.itinerary) {
        throw new Error('Missing required data');
      }

      // Cache the result
      localStorage.setItem(cacheKey, JSON.stringify(parsedResponse));

      setResponse(parsedResponse);
      if (formData.onResponse) {
        formData.onResponse(parsedResponse);
      }

    } catch (error) {
      console.error('Error:', error);
      
      if (error.message.includes('429') || error.message.includes('quota')) {
        setError('API rate limit reached. Please try again in a few moments.');
        
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            generateTravelPlan();
          }, RETRY_DELAY * (retryCount + 1));
        }
      } else {
        setError('Failed to generate travel plan. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Single useEffect to handle initialization
  useEffect(() => {
    generateTravelPlan();
  }, [formData.destination, formData.days, formData.budget, formData.type]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">
          {retryCount > 0 
            ? `Rate limit reached. Retrying in a moment... (Attempt ${retryCount}/${MAX_RETRIES})`
            : 'Creating your perfect travel plan...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        {error.includes('rate limit') && (
          <p className="error-hint">
            Please wait a moment before trying again. The API has a limit on 
            how many requests it can handle at once.
          </p>
        )}
        <button 
          onClick={() => {
            setRetryCount(0);
            generateTravelPlan();
          }}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="response">
      <h2>Your Travel Plan</h2>
      
      <div className="hotels">
        <h3>Recommended Hotels</h3>
        <div className="hotel-grid">
          {response.hotelOptions?.map((hotel, index) => (
            <div key={index} className="hotel-card">
              {hotel.HotelImageUrl && (
                <img 
                  src={hotel.HotelImageUrl} 
                  alt={hotel.name} 
                  className="hotel-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Hotel+Image';
                  }}
                />
              )}
              <div className="hotel-info">
                <h4>{hotel.name}</h4>
                <p>{hotel.address}</p>
                <p><strong>Price:</strong> {hotel.price}</p>
                {hotel.rating && <p><strong>Rating:</strong> {hotel.rating}/5</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="itinerary">
        <h3>Daily Itinerary</h3>
        {Object.entries(response.itinerary || {}).map(([day, activities], index) => (
          <div key={day} className="day-plan">
            <h4>Day {index + 1}</h4>
            {['morning', 'afternoon', 'evening'].map(time => 
              activities[time] && (
                <div key={time} className="activity-card">
                  <h5>{time.toUpperCase()}</h5>
                  <p>{activities[time].activity}</p>
                  {activities[time].duration && (
                    <p>Duration: {activities[time].duration}</p>
                  )}
                  {activities[time].location && (
                    <p>Location: {activities[time].location}</p>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

DeepseekAI.propTypes = {
  formData: PropTypes.shape({
    destination: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any
      })
    ]).isRequired,
    days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    budget: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired
};

export default DeepseekAI;
