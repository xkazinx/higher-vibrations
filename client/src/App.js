//import logo from './logo.svg';
import './App.css';
import Home from './views/Home';
import SignIn from './views/SignIn';
import Register from './views/Register';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import CssBaseline from '@mui/material/CssBaseline';
// <img src={logo} className="App-logo" alt="logo" />
import axios from 'axios';
import { common } from './common/common.mjs'
import { useRef, useState, useEffect } from 'react'
import MenuAppBar from './components/Navbar.tsx';
import Cookies from 'js-cookie';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const [eventsData, setEventsData] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  const [countryIdx, setCountryIdx] = useState(null);
  const [countryLoaded, setCountryLoaded] = useState(false);
  
  const [userData, setUserData] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const initialized = useRef(false)

  useEffect(() => {
    if(initialized.current)
      return;
    
    initialized.current = true
    
    fetchData();
  }, []);

  /*useEffect(() => {
    console.log(countryLoaded)
  }, [countryLoaded]);*/

  // OnLogin
  // localStorage.setItem('user', response.data)

  // OnGetData
  /*const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }*/

  // OnLogOut
  // localStorage.removeItem("user")
  // or, for all data
  // localStorage.clear();
  
  const fetchData = async () => {
   // console.log("fetchData");
    let country_idx = -1;
    if(Cookies.get('country_idx') != undefined)
    {
      country_idx = Cookies.get('country_idx');
    }

    let mail = -1;
    if(Cookies.get('mail') != undefined)
    {
      mail = Cookies.get('mail');
    }

    let session_id = -1;
    if(Cookies.get('session_id') != undefined)
    {
      session_id = Cookies.get('session_id');
    }

    let data =
    {
        country_idx: country_idx,
        session_id: session_id,
        mail: mail,
    };
    
    await axios.post(common.kDomain + 'entry/', data)
      .then(res => 
        {
          setUserData(res.data.user);
          setUserLoaded(true);
          onCountryLoaded(res.data.country_idx);
        })
      .catch(err => console.log(err));
  };

  const onCountryLoaded = async (country_idx) => {

    setCountryIdx(country_idx);
    setCountryLoaded(true);
    setEventsLoaded(false);

    let data =
    {
        country_idx: country_idx,
    };

    await axios.post(common.kDomain + 'events/', data)
      .then(res => 
        {
          setEventsData(res.data);
          setEventsLoaded(true);
        })
      .catch(err => console.log(err));
  };

  return (
    <BrowserRouter>
      <div style={{ height: '100vh' }}>
        <CssBaseline/>
        <MenuAppBar userData={userData} userLoaded={userLoaded} onCountryLoaded={onCountryLoaded} countryLoaded={countryLoaded} countryIdx={countryIdx} />
        <Routes>
            <Route path='/' element={<Home eventsData={eventsData} eventsLoaded={eventsLoaded}/> } />
            <Route path='/signin' element={<SignIn/> } />
            <Route path='/register' element={<Register /> } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
