import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Auth/authContext";
import router from "./routes/router";

const App = () => {
	return (
	<AuthProvider>
		<RouterProvider router={router} />
	</AuthProvider>
	);
};
export default App;
