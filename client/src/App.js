//import logo from './logo.svg';
import './App.css';
import Home from './views/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CssBaseline from '@mui/material/CssBaseline';
// <img src={logo} className="App-logo" alt="logo" />

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

/*
import darkScrollbar from '@mui/material/darkScrollbar';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: themeParam.palette.mode === 'dark' ? darkScrollbar() : null,
      }),
    },
  },
});
*/
function App() {
  return (
    <BrowserRouter>
      <CssBaseline/>
      <Routes>
          <Route path='/' element={<Home/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
