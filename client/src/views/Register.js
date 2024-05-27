import React from 'react';
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
import { styled } from '@mui/system';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import Copyright from '../components/Copyright';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { common } from '../common/common.mjs'
import { CircularProgress } from '@mui/material';
import Error from '../components/Error'

const theme = createTheme();
  
const useStyles = styled((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Register() {
  const router = useNavigate();
  const classes = useStyles(null);

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [errorData, setErrorData] = useState({});

  const handleOnClickSignIn = (event) =>
    {
        event.preventDefault();
        router('/signin');
    };

    /*useEffect(() => 
    {
        console.log(formErrorData);
    }, formErrorData);*/

    const onRegister = async (event) =>
    {
        event.preventDefault();

        const form_data = new FormData(event.currentTarget);

        const terms = form_data.get('acceptTerms');
        if(!terms)
        {
            setErrorData({ acceptTerms: 1 })
            return;
        }
        else
        {
            setErrorData({});
        }

        const data = {
            email: form_data.get('email'),
            password: form_data.get('password'),
            firstName: form_data.get('firstName'),
            lastName: form_data.get('lastName'),
        };

        setIsCreatingAccount(true);
       
        await axios.post(common.kDomain + 'register/action', data)
        .then(res => 
            {
            setIsCreatingAccount(false);
            
            if(res.data.errors?.length > 0)
            {
                setErrorData(res.data.errors);
                return;
            }
            })
        .catch(err => 
            {
                setIsCreatingAccount(false);
                console.log(err)
            });
    };

  return (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
          sx={{
            marginTop: 9,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
      <div className={classes.paper}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar className={classes.avatar} sx={{ mb: 1 }}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Registrarse
            </Typography>
        </Box>
        <Box component="form" onSubmit={onRegister} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="Nombre"
                autoFocus
                disabled={isCreatingAccount}
              />
              <Error 
                disabled={typeof errorData.firstName === 'undefined'}
                text={'*Ingresa un nombre válido.'}>
              </Error>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Apellido"
                name="lastName"
                autoComplete="lname"
                disabled={isCreatingAccount}
              />
              <Error 
                disabled={typeof errorData.lastName === 'undefined'}
                text={'*Ingresa un apellido válido.'}>
              </Error>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                disabled={isCreatingAccount}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                disabled={isCreatingAccount}
              />
              <Error 
                disabled={typeof errorData.password === 'undefined'}
                text={'*Ingresa una contraseña de al menos 8 caracteres.'}>
              </Error>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox 
                name="acceptTerms" value='1' color="primary" />}
                label="Acepto los términos y condiciones de uso."
              />
              <Error 
                disabled={typeof errorData.acceptTerms === 'undefined'}
                text={'*Tienes que aceptar los términos y condiciones de uso para continuar.'}>
              </Error>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isCreatingAccount}
          >
            {
                isCreatingAccount ?
                (<CircularProgress size={24}></CircularProgress>)
                :
                (<span>Registrarse</span>)
              }
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={handleOnClickSignIn}>
                ¿Ya tienes una cuenta? Ingresa
              </Link>
            </Grid>
          </Grid>
        </Box>
      </div>
      </Box>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
    </ThemeProvider>
  );
}

export default Register;