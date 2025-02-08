import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import DeepseekAI from '../configfile/Deepseek';
import '../styles/travelPlan.css';
import PlacePhotoPreview from './PlacePhotoPreview';
import WeatherForecast from './WeatherForecast';

// Define libraries as a static constant outside the component
const GOOGLE_MAPS_LIBRARIES = ['places'];

const TravelPlanOutput = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;

  // Use the static libraries array
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [aiResponse, setAiResponse] = useState(null);
  const [map, setMap] = useState(null);
  const [previewPlace, setPreviewPlace] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [hotels, setHotels] = useState([]);
  const [activities, setActivities] = useState([]);
  const [locationImages, setLocationImages] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Memoize map options to prevent unnecessary rerenders
  const mapOptions = useMemo(() => ({
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true
  }), []);

  const mapStyles = useMemo(() => ({
    height: '400px',
    width: '100%',
    borderRadius: '15px',
    marginTop: '2rem'
  }), []);

  // Function to get coordinates for a location
  const getCoordinates = useCallback(async (locationName) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: locationName }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].geometry.location);
          } else {
            reject(status);
          }
        });
      });

      return {
        lat: result.lat(),
        lng: result.lng()
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }, []);

  const updateMapMarkers = useCallback(async (response) => {
    if (!response || !isLoaded) return;

    try {
      const newMarkers = [];
      const destinationName = formData.destination?.label || formData.destination;
      console.log('Updating markers for destination:', destinationName);
      
      // Add destination marker
      const destinationCoords = await getCoordinates(destinationName);
      if (destinationCoords) {
        console.log('Destination coordinates:', destinationCoords);
        setMapCenter(destinationCoords);
        newMarkers.push({
          id: 'destination',
          position: destinationCoords,
          title: destinationName,
          type: 'destination'
        });

        // Add hotel markers
        if (response.hotelOptions) {
          console.log('Processing hotels:', response.hotelOptions);
          for (const hotel of response.hotelOptions) {
            try {
              const hotelAddress = `${hotel.name}, ${destinationName}`;
              console.log('Geocoding hotel:', hotelAddress);
              const coords = await getCoordinates(hotelAddress);
              if (coords) {
                console.log('Hotel coordinates found:', coords);
                newMarkers.push({
                  id: `hotel-${hotel.name}`,
                  position: coords,
                  title: hotel.name,
                  type: 'hotel',
                  details: hotel
                });
              } else {
                console.warn('No coordinates found for hotel:', hotelAddress);
              }
            } catch (error) {
              console.error('Error processing hotel:', hotel.name, error);
            }
          }
        }

        // Add activity markers
        if (response.itinerary) {
          console.log('Processing activities:', response.itinerary);
          for (const [day, activities] of Object.entries(response.itinerary)) {
            for (const [time, activity] of Object.entries(activities)) {
              try {
                // Check if activity is a string or has a location property
                const activityName = typeof activity === 'string' ? activity : activity.name || activity.location;
                
                if (!activityName) {
                  console.warn('Activity missing name/location:', activity);
                  continue;
                }

                const activityAddress = `${activityName}, ${destinationName}`;
                console.log('Geocoding activity:', activityAddress);
                const coords = await getCoordinates(activityAddress);
                
                if (coords) {
                  console.log('Activity coordinates found:', coords);
                  newMarkers.push({
                    id: `activity-${day}-${time}`,
                    position: coords,
                    title: activityName,
                    type: 'activity',
                    details: {
                      day,
                      time,
                      name: activityName,
                      description: typeof activity === 'object' ? activity.description : ''
                    }
                  });
                } else {
                  console.warn('No coordinates found for activity:', activityAddress);
                }
              } catch (error) {
                console.error('Error processing activity:', activity, error);
              }
            }
          }
        }
      }

      console.log('Final markers array:', newMarkers);
      setMarkers(newMarkers);
      
      // Fit map bounds
      if (newMarkers.length > 0 && map) {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => bounds.extend(marker.position));
        map.fitBounds(bounds);
        
        // If only one marker, zoom in closer
        if (newMarkers.length === 1) {
          map.setZoom(14);
        }
      }
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  }, [formData, map, getCoordinates, isLoaded]);

  // Handle AI response
  const handleAIResponse = (response) => {
    console.log('AI Response received:', response); // Debug log
    setAiResponse(response);
    
    if (response.hotelOptions) {
      console.log('Hotels:', response.hotelOptions); // Debug log
      setHotels(response.hotelOptions);
    }

    if (response.itinerary) {
      console.log('Itinerary:', response.itinerary); // Debug log
      const allActivities = [];
      Object.entries(response.itinerary).forEach(([day, dayActivities]) => {
        Object.entries(dayActivities).forEach(([time, activity]) => {
          allActivities.push({
            day,
            time,
            ...activity
          });
        });
      });
      setActivities(allActivities);
    }

    // Update map markers with the new response
    updateMapMarkers(response);
  };

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !formData?.destination) return;

    const initializeMap = async () => {
      try {
        const coords = await getCoordinates(
          formData.destination?.label || formData.destination
        );
        if (coords) {
          setMapCenter(coords);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();
  }, [isLoaded, formData]);

  // Add map load handler
  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  // Add map unmount handler
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getMarkerIcon = (type) => {
    const icons = {
      destination: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      hotel: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      activity: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    };
    return icons[type] || icons.destination;
  };

  const fetchPlaceId = async (location) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: location.name }, (results, status) => {
          if (status === 'OK') {
            resolve(results[0].place_id);
          } else {
            reject(status);
          }
        });
      });
      return result;
    } catch (error) {
      console.error('Error fetching place ID:', error);
      return null;
    }
  };

  const handleLocationHover = useCallback(async (location, event) => {
    if (!location || !isLoaded) return;

    try {
      const service = new window.google.maps.places.PlacesService(map || document.createElement('div'));
      
      const request = {
        query: location.name,
        fields: ['place_id', 'name', 'photos', 'formatted_address'],
        locationBias: {
          lat: location.location?.lat || location.position?.lat,
          lng: location.location?.lng || location.position?.lng
        }
      };

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.[0]) {
          setPreviewPlace({
            place_id: results[0].place_id,
            name: location.name,
            location: location.location || location.position
          });
          
          setPreviewPosition({
            x: event.clientX + 20,
            y: event.clientY + 20
          });
        }
      });
    } catch (error) {
      console.error('Error in handleLocationHover:', error);
    }
  }, [map, isLoaded]);

  const handleLocationLeave = () => {
    setPreviewPlace(null);
  };

  const fetchLocationImage = async (location) => {
    try {
      if (!location || !location.name) return;
      
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      
      const request = {
        query: `${location.name}, ${formData.destination?.label || formData.destination}`,
        fields: ['photos', 'place_id']
      };

      service.textSearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
          if (results[0].photos && results[0].photos.length > 0) {
            const photoUrl = results[0].photos[0].getUrl({ maxWidth: 400, maxHeight: 300 });
            setLocationImages(prev => ({
              ...prev,
              [location.name]: photoUrl
            }));
          }
        }
      });
    } catch (error) {
      console.error('Error fetching location image:', error);
    }
  };

  // Fetch images when hotels and activities are loaded
  useEffect(() => {
    if (hotels?.length > 0) {
      hotels.forEach(hotel => fetchLocationImage(hotel));
    }
    if (activities?.length > 0) {
      activities.forEach(activity => fetchLocationImage(activity));
    }
  }, [hotels, activities]);

  // Update hotel card rendering
  const renderHotelCard = (hotel, index) => (
    <div key={index} className="hotel-card">
      <h4>{hotel.name}</h4>
      <div className="hotel-details">
        <p><i className="fas fa-star"></i> {hotel.rating}</p>
        <p><i className="fas fa-map-marker-alt"></i> {hotel.location}</p>
        <p><i className="fas fa-dollar-sign"></i> {hotel.price}</p>
      </div>
      <p className="hotel-description">{hotel.description}</p>
    </div>
  );

  // Update activity card rendering
  const renderActivityCard = (activity, index) => (
    <div key={index} className="activity-card">
      <div className="activity-header">
        <h4>Day {activity.day}</h4>
        <span className="activity-time">{activity.time}</span>
      </div>
      <div className="activity-content">
        <h5>{activity.name}</h5>
        <p>{activity.description}</p>
        {activity.location && (
          <p className="activity-location">
            <i className="fas fa-map-marker-alt"></i> {activity.location}
          </p>
        )}
      </div>
    </div>
  );

  const renderDailyItinerary = (day, index) => (
    <div className="day-section" key={index}>
      <div className="day-header">
        <h4>Day {index + 1}</h4>
      </div>
      <div className="itinerary-grid">
        {day.activities.map((item, itemIndex) => (
          <div className="itinerary-item" key={itemIndex}>
            <div className="time-slot">
              <span>
                <i className="far fa-clock"></i>
                {item.time}
              </span>
            </div>
            <div className="activity-content">
              <h4>
                <i className="fas fa-map-marker-alt"></i>
                {item.name}
              </h4>
              <p>{item.description}</p>
              <div className="activity-meta">
                <span className="meta-item">
                  <i className="far fa-clock"></i>
                  {item.duration}
                </span>
                {item.cost && (
                  <span className="meta-item">
                    <i className="fas fa-tag"></i>
                    {item.cost}
                  </span>
                )}
                {item.location && (
                  <span className="meta-item">
                    <i className="fas fa-location-dot"></i>
                    {item.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    // Mouse follow effect
    const items = document.querySelectorAll('.itinerary-item');
    
    const handleMouseMove = (e) => {
      const item = e.currentTarget;
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    };

    items.forEach(item => {
      item.addEventListener('mousemove', handleMouseMove);
    });

    // Scroll animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    const scrollElements = document.querySelectorAll('.day-section, .itinerary-item');
    scrollElements.forEach(el => {
      el.classList.add('scroll-trigger');
      observer.observe(el);
    });

    return () => {
      items.forEach(item => {
        item.removeEventListener('mousemove', handleMouseMove);
      });
      scrollElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Handle new plan creation
  const handleNewPlan = () => {
    setHotels([]);
    setActivities([]);
    setLocationImages({});
    setMapCenter(null);
    setMarkers([]);
    setAiResponse(null);
    
    navigate('/', { 
      replace: true, 
      state: null 
    });
  };

  // Add cleanup for map event listeners
  useEffect(() => {
    return () => {
      if (map) {
        window.google?.maps.event.clearInstanceListeners(map);
      }
    };
  }, [map]);

  // First, add this near your other button handlers
  const handleHomeClick = () => {
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Creating Your Perfect Travel Plan</div>
        <div className="loading-subtext">Please wait while we craft your personalized itinerary...</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading Map</div>
        <div className="loading-subtext">Getting everything ready for you...</div>
      </div>
    );
  }

  return (
    <div className="travel-plan-container">
      <div className="travel-plan-header">
        <div className="header-controls">
          <button onClick={handleHomeClick} className="home-btn">
            <i className="fas fa-home"></i>
            Home
          </button>
        </div>
        <h1>
          <span className="glow-text">Your Travel Plan</span>
        </h1>
        <br />
        <div className="destination">
          <i className="fas fa-map-marker-alt"></i>
          {formData.destination?.label || formData.destination}
        </div>
        <div className="trip-details">
          <span className="detail-item">
            <i className="fas fa-calendar-alt"></i>
            {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Date not set'}
          </span>
          <span className="detail-item">
            <i className="fas fa-clock"></i>
            Duration: {formData.days} Days
          </span>
          <span className="detail-item">
            <i className="fas fa-wallet"></i>
            Budget: {formData.budget}
          </span>
          <span className="detail-item">
            <i className="fas fa-users"></i>
            Travelers: {formData.travelers}
          </span>
          <span className="detail-item">
            <i className="fas fa-compass"></i>
            Style: {formData.travelStyle}
          </span>
          {formData.interests && formData.interests.length > 0 && (
            <span className="detail-item">
              <i className="fas fa-heart"></i>
              Interests: {Array.isArray(formData.interests) ? formData.interests.join(', ') : formData.interests}
            </span>
          )}
        </div>
      </div>

      <div className="weather-forecast-section">
        <WeatherForecast 
          city={formData.destination?.label || formData.destination}
          days={Math.min(parseInt(formData.days) || 5, 7)}
          startDate={new Date(formData.startDate)}
        />
      </div>

      <div className="overview-section">
        <div className="overview-header">
          <i className="fas fa-map-marked-alt"></i>
          <h3>Trip Overview</h3>
        </div>
        <div className="overview-content">
          {aiResponse ? (
            <>
              <div className="overview-description">
                {aiResponse.tripDescription}
              </div>
              <div className="overview-highlights">
                <h4>Trip Highlights</h4>
                <ul>
                  {aiResponse.highlights?.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="loading-message">
              Generating your personalized trip plan...
            </div>
          )}
        </div>
      </div>

      {mapCenter && isLoaded && (
        <div className="map-section">
          <h3><i className="fas fa-map-marker-alt"></i> Trip Map</h3>
          <GoogleMap
            options={mapOptions}
            zoom={14}
            center={mapCenter}
            mapContainerStyle={{
              width: '100%',
              height: '400px',
              borderRadius: '15px'
            }}
            onLoad={onLoad}
          >
            {markers.map((marker, index) => (
              <MarkerF
                key={index}
                position={marker.position}
                title={marker.title}
                icon={getMarkerIcon(marker.type)}
                onClick={() => setSelectedLocation(marker)}
                animation={window.google.maps.Animation.DROP}
              />
            ))}

            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.position}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div className="info-window">
                  <div className="info-window-header">
                    <h4>{selectedLocation.title}</h4>
                    <span className="location-badge">{selectedLocation.type}</span>
                  </div>
                  {selectedLocation.details && (
                    <div className="info-details">
                      {selectedLocation.type === 'hotel' && (
                        <>
                          <p><i className="fas fa-star"></i> Rating: {selectedLocation.details.rating}</p>
                          <p><i className="fas fa-dollar-sign"></i> Price: {selectedLocation.details.price}</p>
                        </>
                      )}
                      {selectedLocation.type === 'activity' && (
                        <>
                          <p><i className="fas fa-calendar-day"></i> Day {selectedLocation.details.day}</p>
                          <p><i className="fas fa-clock"></i> {selectedLocation.details.timeSlot}</p>
                          {selectedLocation.details.description && (
                            <p><i className="fas fa-info-circle"></i> {selectedLocation.details.description}</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
          <div className="marker-legend">
            <div className="marker-type">
              <img src={getMarkerIcon('destination')} alt="Destination" />
              <span>Destination</span>
            </div>
            <div className="marker-type">
              <img src={getMarkerIcon('hotel')} alt="Hotels" />
              <span>Hotels</span>
            </div>
            <div className="marker-type">
              <img src={getMarkerIcon('activity')} alt="Activities" />
              <span>Activities</span>
            </div>
          </div>
        </div>
      )}

      <DeepseekAI 
        formData={{
          ...formData,
          onResponse: handleAIResponse
        }} 
      />

      <button 
        onClick={handleNewPlan}
        className="new-plan-btn"
      >
        Create New Plan
      </button>

      <PlacePhotoPreview 
        place={previewPlace}
        visible={!!previewPlace}
        position={previewPosition}
        className={`place-photo-preview ${previewPlace ? 'visible' : ''}`}
      />
    </div>
  );
};

export default TravelPlanOutput; 