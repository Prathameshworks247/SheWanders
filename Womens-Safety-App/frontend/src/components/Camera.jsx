import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Camera(){
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const navigate=useNavigate();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    } catch (err) {
      setError('Could not access camera. Please ensure camera permissions are granted.');
      console.log(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async (blob) => {
      console.log(blob);
      await processImage(blob);
    }, 'image/jpeg');
  };

  const processImage = async (imageBlob) => {
    stopCamera();
    setIsLoading(true);
    setError(null);
    
    try {
      // Send to your external gender recognition API
      const formData = new FormData();
      formData.append('image', imageBlob);

      const recognitionResponse = await fetch('http://127.0.0.1:3000/api/verify', {
        method: 'POST',
        body: formData
      });

      if(recognitionResponse.status!==200){
        navigate('/login');
      } else{
        navigate('/details');
      }

    } catch(err){
      console.log(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        {!stream ? (
          <button
            onClick={startCamera}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={stopCamera}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Stop Camera
            </button>
            <button
              onClick={captureImage}
              disabled={isLoading}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isLoading ? '#9ca3af' : '#22c55e',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: isLoading ? 'default' : 'pointer'
              }}
            >
              {isLoading ? 'Processing...' : 'Capture & Analyze'}
            </button>
          </>
        )}
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          border: '1px solid #ef4444', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginTop: '1rem' 
        }}>
          <p style={{ color: '#991b1b', margin: 0 }}>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          border: '1px solid #d1d5db', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginTop: '1rem' 
        }}>
          <pre style={{ margin: 0 }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Camera;