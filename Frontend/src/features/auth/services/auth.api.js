import axios from "axios"


const API= axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})

export async function register ({username, email , password}){

try{


    const response = await API.post('/api/auth/register',{
    username,email, password
})

return response.data

} catch (err) {
    console.log("REGISTER ERROR:", err.response?.data);
    console.log("STATUS:", err.response?.status);
    throw err;
}
}

// export async function login({ email, password }) {
//     try {
//         const response = await api.post(
//             "/api/auth/login",
//             {
//                 email,
//                 password
//             }
//         )

//         return response.data

//     } catch (err) {
//         console.log(err)
//     }
// }
export async function login({ email, password }) {

    console.log("LOGIN API RUNNING");

    try {
        const response = await API.post(
            "/api/auth/login",
            {
                email,
                password
            }
        );

        console.log("LOGIN RESPONSE:", response.data);

        return response.data;

    } catch (err) {
        console.log("LOGIN ERROR:", err);
        throw err;
    }
}



export async function logout(){
    try{
      const response = await API.get("/api/auth/logout")

      return response.data

    }catch(err){


    }
}

export async function getMe(){

    try{
        const response =await API.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.error("getMe failed:", err);
        throw err; // <-- important
    }
}