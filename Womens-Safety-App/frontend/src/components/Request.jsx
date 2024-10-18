import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserCard from './UserCard';

export default function Request() {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptance, setAcceptance] = useState("Accept");
  const navigate = useNavigate();

  // Simulate fetching users on component mount
  useEffect(() => {
    const users = {
      availableUsers: [
        { id: 1, name: "Alice",From: "Dharwad", To: "Kolhapur"},
        { id: 2, name: "Bob",From: "Dharwad", To: "Thane" }
      ],
      sentRequests: [
        { id: 3, name: "Charlie", email: "charlie@example.com", status: "pending" }
      ],
      incomingRequests: [
        { id: 4, name: "David",From: "Dharwad", To: "Thane" }
      ]
    };

    // Update state with user data
    setAvailableUsers(users.availableUsers);
    setSentRequests(users.sentRequests);
    setIncomingRequests(users.incomingRequests);
    setLoading(false);
  }, []); // Empty dependency array ensures it runs only once on mount

  const sendRequest = (userId) => {
    console.log(`Request sent to user ${userId}`);
    navigate('/chatbox')
  };

  const acceptRequest = (userId) => {
    console.log(`Request accepted from user ${userId}`);
    navigate('/chatbox');
  };

  if (loading) return <p>Loading users...</p>;

  return (
    
    <div>
    <div className="req-card mb-3 mt-3 text-dark shadow p-4">
      <h2>Available Users</h2>
      <div className="user-list">
        {availableUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            actionLabel="Send Chat Request"
            onAction={() => sendRequest(user.id)}
          />
        ))}
      </div>
      </div>
      
      <div className="req-card mb-3 mt-3 text-dark shadow p-4">
      <h2>Incoming Requests</h2>
      <div className="user-list">
        {incomingRequests.length > 0 ? (
          incomingRequests.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              actionLabel={acceptance}
              onAction={() => acceptRequest(user.id)}
            />
          ))
        ) : (
          <p>No incoming requests.</p>
        )}
      </div>
    </div>
    </div>
  );
}


//   const fetchUsers = async () => {
//     try {
//       const response = await fetch('');
//       const data = await response.json();

//       setAvailableUsers(data.availableUsers);
//       setSentRequests(data.sentRequests);
//       setIncomingRequests(data.incomingRequests);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };
   
//   useEffect(() => {
//     fetchUsers();
//   }, []);