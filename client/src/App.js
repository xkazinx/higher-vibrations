//import logo from './logo.svg';
import './App.css';
import Home from './views/Home';
import SignIn from './views/SignIn';
import Register from './views/Register';
import VerifyEmail from './views/VerifyEmail';
import VerifyEmailAction from './views/VerifyEmailAction';
import Dashboard from './views/Dashboard';
import Profile from './views/DashboardProfile';

import {BrowserRouter, Routes, Route, Outlet} from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import CssBaseline from '@mui/material/CssBaseline';
// <img src={logo} className="App-logo" alt="logo" />
import axios from 'axios';
import { common } from './common/common.mjs';
import { useRef, useState, useEffect } from 'react'
import MenuAppBar from './components/Navbar.tsx';
import Cookies from 'js-cookie';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function DashboardContainer({ sideBarOpened }) {
  return (
    <Box sx={{
      marginTop: (sideBarOpened ? document.getElementById("appbar").offsetHeight : 0) + 'px !important',
    }}>
      {/* This element will render either <DashboardMessages> when the URL is
          "/messages", <DashboardTasks> at "/tasks", or null if it is "/"
      */}
      <Outlet />
    </Box>
  );
}

function App() {
  const [eventsData, setEventsData] = useState([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  const [countryIdx, setCountryIdx] = useState(null);
  const [countryLoaded, setCountryLoaded] = useState(false);
  
  const [userData, setUserData] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const [initialized, setInitialized] = useState(false);

  const [sideBarOpened, setSideBarOpened] = useState(false);

  const [sideBarAvailable, setSideBarAvailable] = useState(false);

  useEffect(() => {
    if(initialized)
      return;
    
    setInitialized(true);
    axios.defaults.withCredentials = true;
    fetchData();
  }, []);
  
  const fetchData = async () => {
    console.log("fetchData");
    let countryIdx = -1;
    let userId = -1;
    let sessionId = -1;

    const localCountryIdx = Cookies.get("countryIdx");
    
    if(localCountryIdx)
    {
      countryIdx = localCountryIdx;
    }

    const localUserId = Cookies.get("userId");
    const localSessionId = Cookies.get("sessionId");

    if(localUserId !== undefined) {  
      userId = localUserId;
    }

    if(localSessionId !== undefined) {
      sessionId = localSessionId;
    }

    let data =
    {
        countryIdx: countryIdx,
        sessionId: sessionId,
        userId: userId,
    };
    
    await axios.post(common.kDomain + 'entry/', data)
      .then(res => 
        {
          setUserData(res.data.user);
          setUserLoaded(true);
          onCountryLoaded(res.data.countryIdx);
          
          if(res.data.user == null)
          {
            Cookies.remove('sessionId');
            Cookies.remove('userId');
          }
          console.log(res.data.user.role);
        })
      .catch(err => console.log(err));
  };

  const onCountryLoaded = async (countryIdx) => {

    setCountryIdx(countryIdx);
    setCountryLoaded(true);
    setEventsLoaded(false);

    Cookies.set('countryIdx', countryIdx);

    let data =
    {
      countryIdx: countryIdx,
    };

    await axios.post(common.kDomain + 'events/', data)
      .then(res => 
        {
          setEventsData(res.data);
          setEventsLoaded(true);
        })
      .catch(err => console.log(err));
  };

  const setUserCookies = async (user) => {
    Cookies.set('userId', user.id);
    Cookies.set('sessionId', user.sessionId);
  }

  function SideBar({ setSideBarAvailable, sideBarAvailable, userData, userLoaded, countryLoaded, countryIdx }) {
    const location = useLocation();
  
    useEffect(() => {
      console.log(location);
      console.log(location.pathname.includes("dashboard/"));
      if(location.pathname.includes("dashboard/"))
      {
        setSideBarAvailable(true);
      }
    }, [location]);

    return (<MenuAppBar 
      sideBarAvailable={sideBarAvailable}
      sideBarOpened={sideBarOpened} setSideBarOpened={setSideBarOpened} 
      userData={userData} setUserData={setUserData} 
      userLoaded={userLoaded} onCountryLoaded={onCountryLoaded} 
      countryLoaded={countryLoaded} countryIdx={countryIdx} 
      />);
  };  

  return (
    <BrowserRouter>
      <div style={{ height: '100vh' }}>
        <CssBaseline/>
        <SideBar setSideBarAvailable={setSideBarAvailable} sideBarAvailable={sideBarAvailable} userData={userData} userLoaded={userLoaded} countryLoaded={countryLoaded} countryIdx={countryIdx} />
        <Routes>
            <Route path='/' element={<Home eventsData={eventsData} eventsLoaded={eventsLoaded}/> } />
            <Route path='/signin' element={<SignIn setUserData={setUserData} setUserLoaded={setUserLoaded} setUserCookies={setUserCookies} /> } />
            <Route path='/register' element={<Register setUserData={setUserData} /> } />
            <Route path='/verify_email' element={<VerifyEmail userData={userData} /> } />
            <Route path='/verify_email/action/:sessionId' element={<VerifyEmailAction userData={userData} setUserData={setUserData} /> } />
            <Route path="/dashboard" element={<DashboardContainer sideBarOpened={sideBarOpened}/>}>
              
              <Route path='/dashboard/main' element={<Dashboard sideBarOpened={sideBarOpened} userData={userData} /> } />
              <Route path='/dashboard/profile' element={<Profile sideBarOpened={sideBarOpened} userData={userData} /> } />
            </Route>
        </Routes>
      </div>
      
    </BrowserRouter>
  );
}

export default App;
