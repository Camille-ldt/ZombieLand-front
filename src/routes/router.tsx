import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login";
import Error404 from "../Pages/Error404";

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
				element: <HomePage />,
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
				path: "*",
				element: <Error404 />,
			},
		],
	},
]);

export default router;
