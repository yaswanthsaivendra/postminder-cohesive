import axios from "axios";
let url = "http://localhost:8000/";


const client = axios.create({
  baseURL: url,
});

export default client;