import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login'
import Details from './components/Details';
import Signup from './components/Signup';
import Request from './components/Request';
import ChatBox from './components/ChatBox';

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
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
