import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Layout from "./components/Layout/Layout";
import Channel from "./components/Channel/Channel";
import Analytics from "./components/Analytics/Analytics";
import Bulkupload from "./components/Bulkupload/Bulkupload";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Login from "./components/Login/Login";
import Callback from "./components/Callback/Callback";
import AuthPage from "./components/AuthPage/AuthPage";
import Integrations from "./components/Integrations/Integrations";
import { getAxios } from './scripts/sdk-client';
const axios = getAxios()

function App() {
  const [channels, setChannels] = useState([]);
  const [auth_url, setAuthUrl] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [addedChannels, setAddedChannels] =useState([])
  
  useEffect(() => {
    // const getUserInformation = async () => {
    //   const res = await axios.get("/auth/login/");
    //   if (res.status === 200) {
    //     setLogin(true);
    //   }
    //   console.log(res);
    // };

    const getAuthUrl = async () => {
      const res = await axios.get("/youtube_auth/authorize/");
      if (res.data.message === "authorized") {
        setAuthorized(true);
      }
      setAuthUrl(res.data.auth_url);
      console.log(res);
    };
    // getUserInformation();
    getAuthUrl();
    if(authorized){
      const getChannels = async () => {
        const res = await axios.get("/youtube_auth/retrieveyoutubechannels/");
        setChannels(res.data.channels);
        console.log((res));
      };
      getChannels()
      const getAddedChannels = async () => {
        const res = await axios.get("/channels/");
        setAddedChannels(res.data);
        console.log(res);
      };
      getAddedChannels()
      

    }
  }, [authorized]);

  // alerts
  const [open, setOpen] = useState(false);
  const [alertDetails, setAlertDetails] = useState({
    message: "",
    color: "",
  });

  const setAlert = (message, color) => {
    setAlertDetails({ message: message, color: color });
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertDetails.color}
          sx={{ width: "100%" }}>
          {alertDetails.message}
        </Alert>
      </Snackbar>

      <BrowserRouter>
        <Routes>
            <>
              {authorized ? <> 
              <Route path="/" element={<Layout addedChannels={addedChannels} authorized={authorized}/>}>
                <Route
                  index
                  element={
                    <Dashboard
                      channels={channels}
                      setChannels={setChannels}
                      auth_url={auth_url}
                      authorized={authorized}
                      addedChannels={addedChannels}
                      setAddedChannels={setAddedChannels}
                    />
                  }
                />
                <Route path="channel" element={<Channel authorized={authorized}/>} />
                <Route path="analytics" element={<Analytics addedChannels={addedChannels} authorized={authorized}/>} />
                <Route path="bulkupload" element={<Bulkupload authorized={authorized}/>} />
                <Route path="integrations" element={<Integrations/>} />
                <Route path="manageteam" element={<Integrations/>} />
                <Route path="calender" element={<Integrations/>} />
                <Route path="tasksassigned" element={<Integrations/>} />


                
              <Route path="callback" element={<Callback setAuthorized={setAuthorized}/>} />

                
              </Route></> :
               <>
              <Route element={<Layout authorized={authorized}/>}>
              <Route path="callback" element={<Callback setAuthorized={setAuthorized}/>} />
              <Route
                path="*"
                element={<AuthPage
                  auth_url={auth_url}
                
                />}
              />
              <Route path="channel" element={<Channel authorized={authorized}/>} />
                <Route path="analytics" element={<Analytics addedChannels={addedChannels}  authorized={authorized}/>} />
                <Route path="bulkupload" element={<Bulkupload authorized={authorized}/>} />
              </Route>
              </>}              
            </>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
