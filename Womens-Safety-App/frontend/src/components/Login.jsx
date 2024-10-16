import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import womenpic from '../assets/protection.png'
export default function Login() {
    return(
        <div className="login-card mb-3 mt-3 text-dark shadow">
            <div className=""><img src={womenpic} alt="profile" className="img"/></div>
            <div className="div-2 col-6">
            <h1>Login</h1>
            <form action="" className="form">
            <div class="mb-3 mt-3">
                {/* <label for="email" className="form-label">Email:</label> */}
                <input type="email" className="form-control" id="email" placeholder="Enter email" name="email"/>
            </div>
            <div className="mb-3">
                {/* <label for="pwd" class="form-label">Password:</label> */}
                <input type="password" className="form-control" id="pwd" placeholder="Enter password" name="pswd"/>
            </div>
            <div className="form-check mb-3">
                <label className="form-check-label">
                <input className="form-check-input" type="checkbox" name="remember"/> Remember me
                </label>
            </div>
            <button type="submit" className="btn shadow">Submit</button>
            </form>
            </div>

            
        </div>

    )
}