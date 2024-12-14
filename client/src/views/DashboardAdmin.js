import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { common } from '../common/common.mjs';
import Notification from '../components/Notification.tsx';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

function FieldEdit({ lookupUserKey, lookupUserValue, lookupUser, setLookupUser, setSaveEnabled, lookupUserCopy }) 
{
  function onChange(event)
  {
    let user = { ...lookupUser };
    user[lookupUserKey] = event.target.value;
    setLookupUser(user);
    setSaveEnabled(true);
  }

  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '55ch', width: '75vw', maxWidth: '650px' } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          onChange={onChange}
          label={lookupUserKey}
          id="outlined-size-small"
          defaultValue={lookupUserValue}
          size="small"
        />
      </div>
    </Box>
  );
}

function SelectLabels({ lookupEmail, setLookupEmail, emails, emailsLoaded, lookupUser, setLookupUser, setLookupUserCopy, setLookupUserLoaded }) {

  const handleChange = (event) => {
    setLookupEmail(event.target.value);
    fetchUserData(event.target.value);
  };

  async function fetchUserData(email) 
  {
    await axios.post(common.kDomain + 'dashboard/admin/getUserData', { email })
      .then(res => 
        {
          setLookupUser(res.data);
          setLookupUserCopy(res.data);
          setLookupUserLoaded(true);
        })
      .catch(err => console.log(err));
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: '75vw', maxWidth: '650px' }}>
        <InputLabel id="demo-simple-select-helper-label">Email</InputLabel>
        <Select
          disabled={!emailsLoaded}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={lookupEmail}
          label="Email"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
            emails.map((value, index) => {
              return <MenuItem key={index} value={value.email}>{value.email}</MenuItem>
            })
          }
        </Select>
      </FormControl>
    </div>
  );
}

function UserEdit({ lookupUser, setLookupUser, lookupUserCopy, setLookupUserLoaded })
{
  const [saveResultNotificationOpen, setSaveResultNotificationOpen] = useState(false);
  const [saveResultNotificationResult, setSaveResultNotificationResult] = useState(false);

  const [saveEnabled, setSaveEnabled] = useState(false);

  function Print({ setSaveEnabled, lookupUserCopy }) 
  {
    return (Object.values(lookupUser).map((value, index, arr) => {
      let key = Object.keys(lookupUser)[index];

      return <FieldEdit  
        key={key} 
        lookupUserKey={key}
        lookupUserValue={value} 
        lookupUser={lookupUser} 
        setLookupUser={setLookupUser}
        lookupUserCopy={lookupUserCopy}
        setSaveEnabled={setSaveEnabled}
      />
    })); 
  }

  function saveUser() 
  { 
    setSaveEnabled(false);
    axios.post(common.kDomain + 'dashboard/admin/saveUser', lookupUser)
      .then(res => 
        {
          setSaveResultNotificationOpen(true);
          setSaveResultNotificationResult(res.data.result);
        })
      .catch(err => console.log(err));
  }

  function discardUser()
  {
    setSaveEnabled(false);
    setLookupUser(lookupUserCopy);
    setLookupUserLoaded(true);
  }

  return (
    <>
      <Print 
        setSaveEnabled={setSaveEnabled}
        lookupUserCopy={lookupUserCopy} 
      />
      <Notification 
        setOpen={setSaveResultNotificationOpen}
        open={saveResultNotificationOpen} 
        result={saveResultNotificationResult}
        message={"Save user"}
      />
      {
        saveEnabled && (
          <>
            <Button onClick={saveUser}>Save</Button>
            <Button onClick={discardUser}>Discard</Button>
          </>
        )
      }
    </>)
}

function Admin({ userData, sideBarOpened }) {
  const router = useNavigate();

  const [initialized, setInitialized] = useState(false);
  const [initialized2, setInitialized2] = useState(false);
  const [emails, setEmails] = useState([]);
  const [emailsLoaded, setEmailsLoaded] = useState(false);
  const [lookupEmail, setLookupEmail] = React.useState('');
  const [lookupUser, setLookupUser] = React.useState({});
  const [lookupUserCopy, setLookupUserCopy] = React.useState({});
  const [lookupUserLoaded, setLookupUserLoaded] = React.useState(false);
    
  useEffect(() => {
    setTimeout(() => {
      if(initialized)
        return;
      
      setInitialized(true);
      fetchData();
    }, 1000);
  }, []);
  
  const fetchData = async () => {
    await axios.post(common.kDomain + 'dashboard/admin/getEmails')
      .then(res => 
        {
          setEmails(res.data.emails);
          setEmailsLoaded(true);
        })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if(initialized2)
      return;
    
    setInitialized2(true);
    
    if(userData && userData.verified == 0)
      {
        router("/verify_email");
      }
  }, [userData]);

  return (
      <Container component="main">
        <CssBaseline />
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h2>User manager</h2>
            <SelectLabels 
              emailsLoaded={emailsLoaded} 
              emails={emails} 
              lookupEmail={lookupEmail} 
              setLookupEmail={setLookupEmail} 
              lookupUser={lookupUser} 
              setLookupUser={setLookupUser} 
              setLookupUserCopy={setLookupUserCopy}
              setLookupUserLoaded={setLookupUserLoaded}
              />

            {
              lookupUserLoaded && <UserEdit 
                lookupUser={lookupUser} 
                setLookupUser={setLookupUser}
                lookupUserCopy={lookupUserCopy}
                setLookupUserLoaded={setLookupUserLoaded}
                />
            }
          </Box>
      </Container>
  );
}

export default Admin;