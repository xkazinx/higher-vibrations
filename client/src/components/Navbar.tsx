import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../assets/logo.png';
import FlagAR  from '../assets/flag-ar.png';
import FlagCL  from '../assets/flag-cl.png';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useRef, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

//const pages = ['Products', 'Pricing', 'Blog'];
const pages = [];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const countries = [
  {
    name: 'Chile',
    image: FlagCL,
  },
  {
    name: 'Argentina',
    image: FlagAR,
  }
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  /*'&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },*/
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    /*transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },*/
  },
}));

export function SearchBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Buscar por lugar, evento, organizador..."
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
    </Box>
  );
}

function Navbar({ userData, userLoaded, onCountryLoaded, countryLoaded, countryIdx }) {
  const router = useNavigate();

  /*useEffect(() => {
    if(app_data.length == 0)
      return;
    
    setAppData(app_data);
  }, [app_data]);*/
  
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElCountries, setAnchorElCountries] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenCountriesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElCountries(event.currentTarget);
  };

  const anchorElContriesOnChange = (ev) => {
    console.log(ev);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseCountriesMenu = (ev) => {
    setAnchorElCountries(null);
  };

  const handleClickCountriesMenu = (ev, value) => {
    handleCloseCountriesMenu(ev);
    
    onCountryLoaded(value);

    Cookies.set('country_idx', value);
  };

  const handleClickLogin = () => {
    router('/signin');
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(-90deg, #d38312, #a83279)'}}>
      <Container maxWidth="xl">
        <Toolbar sx={{  paddingLeft: '5vw', paddingRight: '5vw' }} disableGutters>
          <Link to="/">
            <Box
              component="img"
              sx={{
                maxWidth: 75,
                maxHeight: 75,
              }}
              alt="TuTicket logo"
              src={Logo}
            />
          </Link>
          { 
          /*
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
            
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          */}
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Cambiar pais">
              {
              countryLoaded === false ?
              (
                <IconButton>
                  <CircularProgress/>
                </IconButton>
              )
              : (
              <IconButton onClick={handleOpenCountriesMenu} sx={{ p: 0 }} sx={{ width: '50%', height: '50%' }}>
                <Avatar alt={countries[countryIdx].name} src={countries[countryIdx].image} />
              </IconButton>
              )
            }
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElCountries}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElCountries)}
              onClose={handleCloseCountriesMenu}
            >
              {countries.map((country, idx) => (
                <MenuItem dense={true} value={idx} key={idx} onClick={(event) => handleClickCountriesMenu(event, idx)} sx={{ width: '200px' }} disableGutters>
                  <IconButton sx={{ p: 0 }} sx={{ width: '50%', height: '50%' }}>
                    <Avatar alt={country.name} src={country.image} />
                  </IconButton>
                  <Typography textAlign="center">{country.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
              userLoaded == false ? 
              (<IconButton>
                <CircularProgress/>
              </IconButton>)
              :
              (
                userData == null ? 
                (
                  <Tooltip title={ "Ingresar" }>
                    <IconButton onClick={handleClickLogin}>
                      <Avatar>
                      <AccountCircle sx={{ color: '#a83279', width: '100%', height: '100%' }} />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                )
                :
                (
                  <span>
                    <Tooltip title={ "Open settings" }>
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar>
                        <AccountCircle sx={{ color: '#a83279', width: '100%', height: '100%' }} />
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      {settings.map((setting) => (
                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">{setting}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                </span>
                )
              )
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
