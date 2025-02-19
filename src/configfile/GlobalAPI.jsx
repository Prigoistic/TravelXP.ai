import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const config ={
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_API_KEY,
        'X-Goog-FieldMask': [
            'places.displayName',
            'places.photos',
            'places.id'
        ],
    },
};

export const getPlacesData = (data) => axios.post(BASE_URL, data, config);
