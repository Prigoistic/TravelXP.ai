import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import CreateTrip from './create-trip';
import Form from './form';
import TravelPlanOutput from './components/TravelPlanOutput';
import About from './components/ui/custom/About';
import Footer from './components/ui/custom/Footer';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/create-trip" element={<CreateTrip />} />
      <Route path="/form" element={<Form />} />
      <Route path="/travel-plan" element={<TravelPlanOutput />} />
      <Route
        path="/"
        element={
          <>
            <About />
            <Footer />
          </>
        }
      />
    </Routes>
  </Router>
);

export default AppRouter; 