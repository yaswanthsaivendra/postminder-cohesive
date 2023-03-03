import { getAxios } from "./sdk-client";


var postMinderAxios;

export function getAxiosForPostminder(){
    if (postMinderAxios){
        return postMinderAxios;
    }
    postMinderAxios = getAxios();
    postMinderAxios.defaults.baseURL = "http://127.0.0.1:8000/";
    return postMinderAxios;
}
