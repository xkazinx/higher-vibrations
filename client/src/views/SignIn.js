import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Google } from './../google-credentials'
import { GoogleLogin } from '@react-oauth/google';
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { common } from '../common/common.mjs'
import { CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Copyright from '../components/Copyright';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();
  
function SignIn() {
  const router = useNavigate();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // #test if going to this route sets isLoggingIn to false with useEffect
  const initialized = useRef(false)

  useEffect(() => {
    if(initialized.current)
      return;
    
    initialized.current = true
    
  }, []);

  const onSignIn = async (event) => {
    event.preventDefault();

    setIsLoggingIn(true);

    const form_data = new FormData(event.currentTarget);
    const data = {
      email: form_data.get('email'),
      password: form_data.get('password'),
    };

    await axios.post(common.kDomain + 'signin/action', data)
      .then(res => 
        {
          console.log("Login success");
          setIsLoggingIn(false);
          //setUserData(res.data.user);
          //setUserLoaded(true);
          //onCountryLoaded(res.data.country_idx);
        })
      .catch(err => 
        {
          setIsLoggingIn(false);
          console.log(err)
        });
  };

  const onGoogleLogin = (response) => {
    console.log(response);
  };
  const onGoogleLoginError = (error) => {
    console.log(error);
  };

  const handleOnClickRegister = () => {
    router('/register');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Typography component="h1" variant="h5">
            Ingresar
          </Typography>
          <Box component="form" onSubmit={onSignIn} noValidate sx={{ mt: 1 }}>
            <TextField
              disabled={isLoggingIn}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              disabled={isLoggingIn}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/*<FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordar contraseña"
            />*/}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  ¿Olvidaste la contraseña?
                </Link>
              </Grid>
              {/*<Grid item>
                <Link href="#" variant="body2">
                  {"¿No tienes una cuenta? Regístrate"}
                </Link>
          </Grid>*/}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: -2 }}
              disabled={isLoggingIn}
            >
              {
                isLoggingIn ?
                (<CircularProgress size={24}></CircularProgress>)
                :
                (<span>Sign In</span>)
              }
            </Button>
            <Button
              color="secondary"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
              onClick={handleOnClickRegister}
            >
              ¿Sin cuenta? Regístrate
            </Button>
            <GoogleLogin onSuccess={onGoogleLogin} onError={onGoogleLoginError} />
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;