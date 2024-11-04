import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login.jsx'
import Details from './components/Details.jsx';
import Signup from './components/Signup.jsx';
import Request from './components/Request.jsx';
import ChatBox from './components/ChatBox.jsx';
import Camera from './components/Camera.jsx';

function App() {

  const [chatDetails,setChatDetails]=useState({});
  const [currentUser,setCurrentUser]=useState(null)

  const handleCreateChat=(chatDetails)=>{
    setChatDetails(chatDetails);
  }

  const handleSetCurrentUser=(userId)=>{
    setCurrentUser(userId);
  }

  return <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Signup/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/details' element={<Details/>} />
        <Route path='/request' element={<Request
        handleCreateChat={handleCreateChat}
        handleSetCurrentUser={handleSetCurrentUser}
        />}/>
        <Route path='/chatbox' element={<ChatBox
        chatDetails={chatDetails}
        currentUser={currentUser}
        />}/>
        <Route path='/verification' element={<Camera />} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App;