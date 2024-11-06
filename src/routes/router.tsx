import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login";
import Error404 from "../Pages/Error404";
import Activity from "../Pages/Activity";
import Activities from "../Pages/Activities";
import Register from "../Pages/Register";
import BackOfficeActivities from "../Pages/BackOfficeActivities";
import BackOfficeDashboard from "../Pages/BackOfficeDashboard";

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
				path: "/adminactivities",
				element: <BackOfficeActivities/>,
			},
			{
				path: "/admindashboard",
				element: <BackOfficeDashboard />,
			},
		],
	},
]);

export default router;
