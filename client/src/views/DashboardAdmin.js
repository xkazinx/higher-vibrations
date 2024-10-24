import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from 'react'

// TODO remove, this demo shouldn't need to reset the theme.
function Admin({ userData, sideBarOpened }) {
  const router = useNavigate();

  const initialized = useRef(false)

  useEffect(() => {
    if(initialized.current)
      return;
    
    initialized.current = true
    
    if(userData && userData.verified == 0)
      {
        router("/verify_email");
      }
  }, [userData]);

  return (
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          Dashboard Admin
        </Box>
      </Container>
  );
}

export default Admin;