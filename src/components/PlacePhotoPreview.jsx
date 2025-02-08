import { useState, useEffect } from 'react';

const PlacePhotoPreview = ({ place }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!place?.photos?.[0]) return;

      try {
        const photoReference = place.photos[0].photo_reference;
        const maxWidth = 400;
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
        setPhotoUrl(url);
      } catch (error) {
        console.error('Error fetching place photo:', error);
      }
    };

    fetchPhoto();
  }, [place]);

  if (!photoUrl) return null;

  return (
    <div className="place-photo">
      <img src={photoUrl} alt={place.name} loading="lazy" />
    </div>
  );
};

export default PlacePhotoPreview; 