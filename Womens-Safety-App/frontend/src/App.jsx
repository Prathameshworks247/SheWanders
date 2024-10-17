import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Details from './components/Details';

function App() {

  return <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Details/>} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
