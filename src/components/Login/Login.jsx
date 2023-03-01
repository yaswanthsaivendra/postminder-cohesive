import React from "react";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "../../axios";


const Login = ({setAlert,setToken}) => {
  const [option, setOption] = useState("login");
  const [loginFormDetails, setLoginFormDetails] = useState({
    username: "",
    password: "",
  });
  const [registerFormDetails, setRegisterFormDetails] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const loginHandleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setLoginFormDetails({ ...loginFormDetails, [name]: newValue });
  };
  const registerHandleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setRegisterFormDetails({ ...registerFormDetails, [name]: newValue });
  };
  const loginSubmit = async (evt) => {
    evt.preventDefault();

    let data =  loginFormDetails ;
    console.log(data)
    try{
      const res = await axios.post("/auth/login/",data);
      console.log(res)
      if(res.status===200){
        setAlert("successfully logged in","success") 
        setToken(res.data.token)
        localStorage.setItem("token", res.data.token);
      }
    }
    catch(error){
      console.log(error)
      setAlert(error.response.data.message,"error")
    }
   
  };

  const registerSubmit = async (evt) => {
    evt.preventDefault();
    if(registerFormDetails.password!==registerFormDetails.cpassword){
      setAlert("passwords didn't match","error");
      return
    }

    let data = {
      username: registerFormDetails.username,
      password: registerFormDetails.password,
      email: registerFormDetails.email,
    };
    try{
        console.log(data);
      const res = await axios.post("/auth/signup/",data);
      console.log(res);
      if(res.status===201){
        console.log('hi')
        setAlert("successfully registered, please login","success")
        setOption("login")
  
      }
    }
    catch(error){
      console.log(error)

      
        
    }
    
    
   
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <br /> <br />
      <br />
      {option === "login" ? (
        <>
          <div
            className="container m-auto mt-5 border rounded"
            style={{ maxWidth: "500px", minHeight: "400px" }}>
            <h2 className="p-4 text-center">Login</h2>
            <div className="p-2 pt-0 ">
              <form onSubmit={loginSubmit}>
                <TextField
                  style={{ margin: "10px 5px" }}
                  fullWidth
                  type="text"
                  label="username"
                  variant="outlined"
                  name="username"
                  defaultValue={loginFormDetails.username}
                  onChange={loginHandleInput}
                  required
                />

                <TextField
                  style={{ margin: "10px 5px" }}
                  fullWidth
                  type="password"
                  label="password"
                  variant="outlined"
                  name="password"
                  defaultValue={loginFormDetails.password}
                  onChange={loginHandleInput}
                  required
                />
                <br />
                <br />
                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large">
                    Login
                  </Button>
                </div>
                <p className="p-3">
                  Do not have an account?{" "}
                  <Button
                    onClick={() => {
                      setOption("register");
                    }}>
                    register
                  </Button>{" "}
                </p>
              </form>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {option === "register" ? (
        <>
          <div
            className="container m-auto mt-5 border rounded"
            style={{ maxWidth: "500px", minHeight: "400px" }}>
            <h2 className="p-4 text-center">Register</h2>
            <div className="p-2 pt-0 ">
              <form onSubmit={registerSubmit}>
                <TextField
                  style={{ margin: "10px 5px" }}
                  fullWidth
                  type="text"
                  label="username"
                  variant="outlined"
                  name="username"
                  defaultValue={registerFormDetails.username}
                  onChange={registerHandleInput}
                  required
                />
                <TextField
                  style={{ margin: "10px 5px" }}
                  fullWidth
                  type="email"
                  label="email"
                  variant="outlined"
                  name="email"
                  defaultValue={registerFormDetails.email}
                  onChange={registerHandleInput}
                  required
                />

                <TextField
                  style={{ margin: "10px 5px" }}
                  fullWidth
                  type="password"
                  label="password"
                  variant="outlined"
                  name="password"
                  defaultValue={registerFormDetails.password}
                  onChange={registerHandleInput}
                  required
                />
                <TextField
                  style={{ margin: "10px 5px" }}
                  fullWidth
                  type="password"
                  label="confirm password"
                  variant="outlined"
                  name="cpassword"
                  defaultValue={registerFormDetails.cpassword}
                  onChange={registerHandleInput}
                  required
                />
                <br />
                <br />
                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large">
                    Register
                  </Button>
                </div>
                <p className="p-3">
                  already have an account?
                  <Button
                    onClick={() => {
                      setOption("login");
                    }}>
                    Login
                  </Button>
                </p>
              </form>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Login;