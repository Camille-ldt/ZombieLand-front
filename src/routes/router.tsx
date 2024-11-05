import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../Pages/HomePage";
import Login from "../Pages/Login";
import Error404 from "../Pages/Error404";
import Activity from "../Pages/Activity";
import Activities from "../Pages/Activities";
import { UsefulInformation } from "../components/UsefulInformation";
import SiteMap from "../Pages/SiteMap";
import AboutUs from "../Pages/AboutUs";

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
				path: "/informations",
				element: <UsefulInformation />,
				children: [
					{
						path: "/informations/aboutus",
						element: <AboutUs />,
					}, 
					{
						path: "/informations/sitemap",
						element: <SiteMap />
					}
				]
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
