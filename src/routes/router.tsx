import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import { UsefulInformation } from "../components/UsefulInformation/UsefulInformation";
import Activities from "../Pages/Activities";
import Activity from "../Pages/Activity";
import Error404 from "../Pages/Error404";
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/activities",
        element: <Activities />,
      },
      {
        path: "/bookings",
        element: <HomePage />,
      },
      {
        path: "/informations-utiles",
        element: <UsefulInformation />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/activity",
        element: <Activity />,
      },
    ],
  },
]);

export default router;
