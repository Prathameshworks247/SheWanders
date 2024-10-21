import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

import womenpic from '../assets/protection.png';

export default function Login(){
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit =async (e) => {
    e.preventDefault();
    const {email, password } = formData;
    console.log('User logged in:', formData);

    const res=await axios.post('https://women-s-safety-app.onrender.com/api/login',{
      email:email,
      password:password
    });

    if(res.status===200){
      localStorage.setItem('userAuthToken','Bearer '+res.data.token);

      navigate('/details');
    }
  };

  return (
    <div className="login-card mb-3 mt-3 text-dark shadow p-4">
      <div className="profile-image text-center ">
        <img src={womenpic} alt="profile" className="img-fluid" style={{ width: '250px' }} />
      </div>
      <div className="form-container-login  col-md-7">
        <div className="mb-4 fs-2 fw-bolder font-san-serif">Log In</div>      
          <form onSubmit={handleSubmit} className='login-form'>
            <input className="form-control" type="email" name="email" placeholder="Email" onChange={handleChange} required/>
            <input className="form-control" type="password" name="password" placeholder="Password" onChange={handleChange} required/>
            <button type="submit" className="btn btn-primary shadow w-100">
              Log In
            </button>
            <p>Not Registered? <a href="" onClick={()=>{
              navigate('/')
            }}>Sign Up</a></p>
          </form>
        <div/>
      </div>
    </div>
  );
};

