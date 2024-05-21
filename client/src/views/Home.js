import React, { useEffect, useState } from 'react';
import axios from 'axios';

// https://www.youtube.com/watch?v=y5NvOade3sk 14:42
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SearchBar } from '../components/Navbar.tsx';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

export function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

function Categories()
{
    const [value, setValue] = React.useState(2);

    const handleChange = (val, idx) =>
    {
        setValue(idx);
        // Load events with given category_idx  
    };
    // From server
    let categories = ['Todos', 'Fiestas', 'Teatros', 'Familia', 'Deportes', 'Shows', 'Ferias', 'Festivales', 'Retiros'];
    return (
        <Tabs
        value={value}
        onChange={handleChange}
        scrollButtons
        allowScrollButtonsMobile
        aria-label="categories"
        variant="scrollable"
        >
            {categories.map((category, index) => (
                <Tab key={category} index={index} label={category} />
            ))}
        </Tabs>
    );
}

function Home({ eventsData, eventsLoaded })
{
    
    return (
        <div >
            <Box sx={{ paddingTop: '3vh' }}></Box>
            <Box sx={{ paddingLeft: '5vw', paddingRight: '5vw' }}>  
                <SearchBar></SearchBar>
                <Box>
                    <Categories></Categories>
                </Box>
                {
                    eventsLoaded == true ?
                    (<Grid>

                    </Grid>)
                    :
                    (<Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        sx={{ paddingTop: '30vh' }}
                        >
                            <CircularProgress></CircularProgress>
                    </Grid>)
                }
            </Box>
        </div>
    );
}

export default Home;