import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login";

const router = createBrowserRouter([
    {
        path:"/",
        element: <Layout />,
        children: [
            { 
                path: "/",
                element: <HomePage/>
            },
            { 
                path: "/activities",
                element: <HomePage/>
            },
            { 
                path: "/bookings",
                element: <HomePage/>
            },
            { 
                path: "/aboutus",
                element: <HomePage/>
            },
            { 
                path: "/login",
                element: <Login/>
            },
        ]
    }
]);

export default router;