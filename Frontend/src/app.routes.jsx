import { createBrowserRouter } from "react-router-dom"; 
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/componets/protected.jsx";
import Home from "./features/auth/pages/Home";
import Interview from "./features/interview/pages/interview.jsx";




export const router = createBrowserRouter([
    {
        path:"/Login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register />
    },
    {
        path:"/",
        element: <Protected>< Home/></Protected>
    },
    {
        path:"/interview/:interviewId",
        element:<Protected><Interview/></Protected>
    }
])