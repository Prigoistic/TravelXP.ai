import Button from '../components/ui/button';
import { Link } from 'react-router-dom';
const CreateTrip = () => {
  return (
    <div className="create-trip-container">
      <h1>
        <span className="fade-text">Get Started with your trip with your very </span>
        <br />
        <span className="create-trip-container-span">Own AI network</span>
        <br />

        <span>Over 100+ destinations to choose from with the best AI network curated by our team</span>
      </h1>
      <p>Hover over the images to see the magic</p>

      <Link to="/form">
        <Button text="CREATE YOUR JOURNEY" className="create-button" />
      </Link>


      <div className="list">
        <div className="list-item">
          <img src= '/public/image1.jpg' alt="list-item" />
        </div>
        <div className="list-item">
          <img src= '/public/image2.jpg' alt="list-item" />
        </div>
        <div className="list-item">
          <img src= '/public/image3.jpg' alt="list-item" />
        </div>
        <div className="list-item">
          <img src= '/public/image4.jpg' alt="list-item" />
        </div>
        <div className="list-item">
          <img src= '/public/image5.jpg' alt="list-item" />
        </div>
        <div className="list-item">
          <img src= '/public/image6.jpg' alt="list-item" />
        </div>
        <div className="list-item">
          <img src= '/public/image7.jpg' alt="list-item" />
        </div>
      </div>
    </div>
  )
}   

export default CreateTrip;
