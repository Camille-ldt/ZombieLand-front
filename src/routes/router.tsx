// src/routes/router.tsx

import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import { UsefulInformation } from "../components/UsefulInformation/UsefulInformation";
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login";
import Error404 from "../Pages/Error404";
import Activity from "../Pages/Activity";
import Activities from "../Pages/Activities";
import Profil from "../Pages/Profil";
import Register from "../Pages/Register";
import BackOfficeActivities from "../Pages/BackOfficeActivities";
import BackOfficeDashboard from "../Pages/BackOfficeDashboard";
import BackOfficeReservations from "../Pages/BackOfficeReservations";
import ProtectedRoute from '../components/ProtectedRoute'; 

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
        path: "/aboutus",
        element: <HomePage />, 
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/activity",
        element: <Activity />,
      },
      {
        path: "/user/:userId",
        element: <Profil />
      },
      {
        path: "/informations-utiles",
        element: <UsefulInformation />,
      },
      // Routes administratives protégées
      {
        path: "/adminactivities",
        element: (
          <ProtectedRoute requiredRole={3}> 
            <BackOfficeActivities />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admindashboard",
        element: (
          <ProtectedRoute requiredRole={3}> 
            <BackOfficeDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/adminreservations",
        element: (
          <ProtectedRoute requiredRole={3}> 
            <BackOfficeReservations />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
