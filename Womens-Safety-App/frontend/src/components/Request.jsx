import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

import UserCard from './UserCard.jsx';

export default function Request({handleCreateChat,handleSetCurrentUser}) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptance, setAcceptance] = useState("Accept");

  const navigate = useNavigate();

  useEffect(() => {
    // const users = {
    //   availableUsers: [
    //     { id: 1, name: "Alice",From: "Dharwad", To: "Kolhapur"},
    //   ],
    //   sentRequests: [
    //     { id: 3, name: "Charlie", email: "charlie@example.com", status: "pending" }
    //   ],
    //   incomingRequests: [
    //     { id: 4, name: "David",From: "Dharwad", To: "Thane" },
        
    //   ]
    // };

    async function getUsers(){
      const res1=await axios.get('https://women-s-safety-app.onrender.com/api/signup/api/users',{
        headers:{
          'Authorization':localStorage.getItem('userAuthToken')
        }
      });

      const res2=await axios.get('https://women-s-safety-app.onrender.com/api/signup/api/pending-requests',{
        headers:{
          'Authorization':localStorage.getItem('userAuthToken')
        }
      });

      setAvailableUsers(res1.data.users);
      setIncomingRequests(res2.data.pendingRequests);
    }

    getUsers();

    // setSentRequests(users.sentRequests);
    // setIncomingRequests(users.incomingRequests);
    setLoading(false);
  }, []);

  const sendRequest =async (userId) => {
    console.log(`Request sent to user ${userId}`);

    const res=await axios.post('https://women-s-safety-app.onrender.com/api/signup/api/send-chat-request',{
      receiverId:userId
    },{
      headers:{
        'Authorization':localStorage.getItem('userAuthToken')
      }
    });

    if(res.status===200){
      handleCreateChat(prevDetails=>{
        return res.data.chatDetails
      });
      handleSetCurrentUser(prevUser=>{
        return res.data.chatDetails.sender._id
      });

      navigate('/chatbox');
    }
  };

  const acceptRequest =async (userId) => {
    console.log(`Request accepted from user ${userId}`);

    const res=await axios.post('https://women-s-safety-app.onrender.com/api/signup/api/update-chat-status',{
      senderId:userId
    },{
      headers:{
        'Authorization':localStorage.getItem('userAuthToken')
      }
    });

    if(res.status===200){
      handleCreateChat(res.data.chatDetails);
      handleSetCurrentUser(res.data.chatDetails.receiver._id);

      navigate('/chatbox');
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className='req-page'>
      <div className="req-card mb-3 mt-3 text-dark shadow p-4">
        <h2>Available Users</h2>
        <div className="user-list">
          {availableUsers.map((user) => (
            <UserCard
              key={user.userId._id}
              user={user.userId}
              actionLabel="Send Chat Request"
              onAction={() => sendRequest(user.userId._id)}
            />
          ))}
        </div>
      </div>
      
      <div className="req-card mb-3 mt-3 text-dark shadow p-4">
        <h2>Incoming Requests</h2>
        <div className="user-list">
          {incomingRequests.length > 0 ? (
            incomingRequests.map((request) => (
              <UserCard
                key={request.sender._id}
                user={request.sender}
                actionLabel={acceptance}
                onAction={() => acceptRequest(request.sender._id)}
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