import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import womenpic from '../assets/protection.png';
import { GoogleMap, useJsApiLoader, Autocomplete, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '400px' };
const center = { lat: 20.5937, lng: 78.9629 }; // India’s coordinates

export default function Details() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAG0n8gOgNs3K553GuINenuDG1Qdfa8A4s', // Replace with a valid API key
    libraries: ['places'],
  });

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    phone: '',
    time: '',
    fromCoords: { lat: null, lng: null },
    toCoords: { lat: null, lng: null },
  });

  const [activeMarker, setActiveMarker] = useState('from'); // Tracks which marker to set (From/To)

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
      <div className="text-center">
        <img src={womenpic} alt="profile" className="img-fluid" style={{ width: '150px' }} />
      </div>

      <div className="col-12 col-md-6 mx-auto mt-4">
        <h1 className="text-center mb-4">Enter Details</h1>

        <form className="form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>From:</label>
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
              />
            </Autocomplete>
          </div>

          <div className="mb-3">
            <label>To:</label>
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
            <label>Time:</label>
            <input
              className="form-control"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Select Active Marker:</label>
            <select
              className="form-control"
              value={activeMarker}
              onChange={(e) => setActiveMarker(e.target.value)}
            >
              <option value="from">From</option>
              <option value="to">To</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary shadow w-100">
            Submit
          </button>
        </form>
      
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
          onClick={handleMapClick}
        >
          {formData.fromCoords.lat && <Marker position={formData.fromCoords} label="From" />}
          {formData.toCoords.lat && <Marker position={formData.toCoords} label="To" />}
        </GoogleMap>
      </div>
    </div>
  ) : (
    <p>Loading map...</p>
  );
}
