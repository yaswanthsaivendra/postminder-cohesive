import { getAxios } from "./sdk-client";


var postMinderAxios;

export function getAxiosForPostminder(){
    if (postMinderAxios){
        return postMinderAxios;
    }
    postMinderAxios = getAxios();
    postMinderAxios = postMinderAxios.create({baseURL : "https://postminder-backend-yaswanthsaivendra-79cu.live.cohesive.so"})
    console.log(process.env)
    return postMinderAxios;
}
