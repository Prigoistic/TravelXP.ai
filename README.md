# 🌍 TravelXP.ai : The AI-Powered Travel Planning Suite

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev/)
[![Google Maps API](https://img.shields.io/badge/Google_Maps_API-v3.55-red)](https://developers.google.com/maps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An intelligent travel planning platform combining AI-generated itineraries with real-time mapping and weather integration.

## ✨ Core Features

### 🧠 Intelligent Itinerary Engine

- **AI-Powered Recommendations**  
  Dynamic suggestions based on budget, travel style (Adventure/Luxury/Family), and interest categories
- **Multi-Day Planning**  
  Auto-generated daily schedules with time slot management
- **Smart Location Geocoding**  
  Automatic coordinate resolution for destinations/hotels/activities

### 🗺 Advanced Mapping System

- Interactive Google Maps integration
- Three marker types (Destinations/Hotels/Activities)
- Auto-zoom and bounds calculation
- Custom info windows with location details

### 🌦 Weather Integration

- 7-day forecast visualization
- Weather-adaptive activity suggestions
- Local timezone-aware predictions

### 🎨 Modern UI Components

- Responsive grid layouts with CSS animations
- Hover-activated tooltips and previews
- Loading spinners and smooth transitions

## 🚀 Installation Guide

1. **Clone Repository**

```bash
git clone https://github.com/yourusername/travel-planner.git
```

2. **Install Dependencies**

```bash
npm install
```

3. **Run the Application**

```bash
npm start
```

## 🛠️ Development Setup

1. **Install Dependencies**

```bash
npm install
```

2. **Run the Application**

```bash
npm start
```

## 📦 Project Structure

```bash

├── public/
├── src/
│ ├── components/
│ ├── pages/
│ ├── App.js
│ ├── index.css
│ └── index.js
```



### Map Configuration

```javascript
const { isLoaded } = useLoadScript({
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: ['places']
});
```

## 🛠 Key Technical Implementations

### Marker Management System

```javascript   
// TravelPlanOutput.jsx
const updateMapMarkers = useCallback(
  async (response) => {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((marker) => bounds.extend(marker.position));
    map.fitBounds(bounds);
  },
  [map, markers]
);
```

### AI Integration Flow

```javascript
const handleAIResponse = (response) => {
  setAiResponse(response);
  updateMapMarkers(response);
  processHotelData(response.hotelOptions);
  processActivities(response.itinerary);
};
``` 

## 📜 License

MIT License - Free for personal and commercial use with attribution

## 🤝 Contribution Guidelines

1. Fork repository
2. Create feature branch (`git checkout -b feature/feature-name`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/feature-name`)
5. Open Pull Request

---

**Optimized for modern browsers** | **Tested on Chrome, Firefox, Safari**

## 📧 Contact

For questions or feedback, please contact us at [priyamghosh9753@gmail.com](mailto:priyamghosh9753@gmail.com).
