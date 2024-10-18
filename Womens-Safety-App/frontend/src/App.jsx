import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login'
import Details from './components/Details';
import Signup from './components/Signup';
import Request from './components/Request';
import ChatBox from '../../chat-app/reactsdk/src/App'
function App() {

  return <>
    <BrowserRouter>
      <Routes>
        
        <Route path='/' element = {<Signup/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/details' element={<Details/>} />
        <Route path = '/request' element={<Request/>}/>
        <Route path='/chatbox' element={<ChatBox/>}/>
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
