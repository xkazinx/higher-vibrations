import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.

function VerifyEmail({ userData }) {
  const router = useNavigate();

  const handleOnClickRegister = () => {
    router('/register');
  };

  const onClickVerifyEmail = () => {
    if(!userData)
      return;
    
    router('/verify_email/action/' + userData.sessionId);
  };

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" pb={5}>
            Verificar email
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            Hemos enviado un correo a { userData == null ? '[mail]' : userData.email },<br/>
            haz click en el enlace enviado para continuar
          </Box>
          <Box pt={2}>
            {
              process.env.NODE_ENV == 'development' ?
              (<Button
                variant="contained" color="primary" onClick={onClickVerifyEmail}>Emular verificación de email</Button>) :
              (<span></span>)
            }
          </Box>
        </Box>
      </Container>
  );
}

export default VerifyEmail;