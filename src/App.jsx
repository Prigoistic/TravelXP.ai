import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/ui/custom/Header';
import Hero from './components/ui/custom/Hero';
import CreateTrip from './create-trip';
import Form from './form';
import TravelPlanOutput from './components/TravelPlanOutput';
import About from './components/ui/custom/About';
import Footer from './components/ui/custom/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <Footer />
            </>
          }
        />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/form" element={<Form />} />
        <Route path="/travel-plan" element={<TravelPlanOutput />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
