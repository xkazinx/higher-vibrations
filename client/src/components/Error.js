import React from 'react';
import Box from '@mui/material/Box';

function Error({ disabled, text })
{
    return (
        <span>
        {
            disabled ? 
            (<span></span>)
            :
            (<Box sx={{ color: 'red' }}>{text}</Box>)
        }
        </span>
    );
}

export default Error;