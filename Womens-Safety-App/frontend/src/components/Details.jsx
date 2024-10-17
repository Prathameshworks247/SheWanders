import { useState, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';

import womenpic from '../assets/protection.png';

const mapContainerStyle = { width: '100%', height: '450px' };
const center = { lat: 20.5937, lng: 78.9629 }; // India’s coordinates

export default function Details() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCl0C-lGa1dKfuPPypqbU87sCA2ATcPTPY', // Replace with a valid API key
    libraries: ['places'],
  });

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const [formData, setFormData] = useState({
    name:"",
    from: '',
    to: '',
    phone: '',
    time: '',
    date:'',
    fromCoords: { lat: null, lng: null },
    toCoords: { lat: null, lng: null },
  });

  const [activeMarker, setActiveMarker] = useState('from'); // Tracks which marker to set (From/To)
  const [directionsResponse, setDirectionsResponse] = useState(null); // For holding directions response

  const handlePlaceChanged = (field) => {
    const autocomplete = field === 'from' ? fromRef.current : toRef.current;
    const place = autocomplete.getPlace();
    const location = place.geometry?.location;

    if (location) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: place.formatted_address,
        [`${field}Coords`]: { lat: location.lat(), lng: location.lng() },
      }));

      // Fetch directions if both locations are set
      if (field === 'to' && formData.fromCoords.lat) {
        fetchDirections(formData.fromCoords, { lat: location.lat(), lng: location.lng() });
      }
    }
  };

  const fetchDirections = (origin, destination) => {
    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING, // Change travel mode if needed
        },
        (response, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(response);
          } else {
            console.error('Error fetching directions:', response);
          }
        }
      );
    }
  };

  const handleMapClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    setFormData((prevData) => ({
      ...prevData,
      [`${activeMarker}Coords`]: coords,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Send formData to backend here
  };

  if (loadError) {
    return <p>Error loading map</p>;
  }

  return isLoaded ? (
    <div className="login-card mb-3 mt-3 text-dark shadow p-4">
      <div className="profile-image text-center ">
        <img src={womenpic} alt="profile" className="img-fluid" style={{ width: '150px' }} />
      </div>

      <div className="form-container col-12 col-md-6 mx-auto mt-4">
        <div className="mb-4 w-100 fs-2 fw-bolder font-monospace">Enter Details</div>

        <form className="form" onSubmit={handleSubmit}>
            <div className="mb-3">
            <label>User Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Username"
                required
              />
          </div>
          <div className="mb-3">
            <label>Starting Point:</label>
            <Autocomplete
              onLoad={(ref) => (fromRef.current = ref)}
              onPlaceChanged={() => handlePlaceChanged('from')}
            >
              <input
                className="form-control"
                type="text"
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="Enter From Location"
                required
              />
            </Autocomplete>
          </div>

          <div className="mb-3">
            <label>Destination:</label>
            <Autocomplete
              onLoad={(ref) => (toRef.current = ref)}
              onPlaceChanged={() => handlePlaceChanged('to')}
            >
              <input
                className="form-control"
                type="text"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="Enter To Location"
                required
              />
            </Autocomplete>
          </div>

          <div className="mb-3">
            <label>Phone:</label>
            <input
              className="form-control"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit Phone Number"
              required
            />
          </div>
          <div className="mb-3">
            <label>Date:</label>
            <input
              className="form-control"
              type="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Time:</label>
            <input
              className="form-control"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>


          <button type="submit" className="btn btn-primary shadow w-100">
            Submit
          </button>
        </form>
        </div>
        <div className="map-container">
        <GoogleMap

          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
          onClick={handleMapClick}
        >
          {formData.fromCoords.lat && <Marker position={formData.fromCoords} label="From" />}
          {formData.toCoords.lat && <Marker position={formData.toCoords} label="To" />}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <p>Loading map...</p>
  );
}
