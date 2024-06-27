import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar.tsx';

// TODO remove, this demo shouldn't need to reset the theme.
function Profile({ userData }) {
  const router = useNavigate();

  const initialized = useRef(false)

  useEffect(() => {
    if(initialized.current)
      return;
    
    initialized.current = true
    
    if(userData.verified == 0)
      {
        router("/verify_email");
      }
  }, []);

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          Profile
        </Box>
      </Container>
  );
}

export default Profile;