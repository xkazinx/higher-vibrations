import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";

function Dashboard({ userData, sideBarOpened }) {
  const router = useNavigate();

  const handleOnClickRegister = () => {
    router('/register');
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          Dashboard
        </Box>
      </Container>
  );
}

export default Dashboard;