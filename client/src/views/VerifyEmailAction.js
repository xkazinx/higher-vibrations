import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { common } from '../common/common.mjs'
import { useRef, useState, useEffect } from 'react'

function VerifyEmailAction({ userData, setUserData }) {
  const { sessionId } = useParams();
  const router = useNavigate();

  const initialized = useRef(false)

  useEffect(() => {
    if(initialized.current)
      return;
    
    initialized.current = true
    
    const data = {
      sessionId: sessionId
    };

    axios.post(common.kDomain + "verify_email/action", data)
      .then(res => 
        {
          setUserData(res.data.user);
          router("/");
        })
      .catch(err => console.log(err));
  }, []);

  const onClickVerifyEmail = () => {
    router('/verify_email/action/' + userData.sessionId);
  };

  return (
      <Container component="main" maxWidth="xs">
        <Box pt={10}>
        Verificación de email en proceso...</Box>
      </Container>
  );
}

export default VerifyEmailAction;