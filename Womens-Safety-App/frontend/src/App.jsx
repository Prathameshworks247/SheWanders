import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login'
import Details from './components/Details';
import Signup from './components/SIgnup';

function App() {

  return <>
    <BrowserRouter>
      <Routes>
        
        <Route path='/' element = {<Signup/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/details' element={<Details/>} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
