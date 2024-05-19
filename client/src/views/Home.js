import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuAppBar from '../components/Navbar.tsx';
// https://www.youtube.com/watch?v=y5NvOade3sk 14:42
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SearchBar } from '../components/Navbar.tsx';

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

function Home()
{
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8081/')
        .then(res => setData(res.data))
        .catch(err => console.log(err));
    });

    return (
        <div>
            <MenuAppBar/>
            <Box sx={{ paddingTop: '3vh' }}></Box>
            <Box sx={{ paddingLeft: '5vw', paddingRight: '5vw' }}>  
                <SearchBar></SearchBar>
                <Box
                >
                        <Categories></Categories>
                </Box>
                
            </Box>
        </div>
    );
}

export default Home;