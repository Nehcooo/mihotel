import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Post from "./pages/Post";

function App() {
	return (
		<>
			<NavBar />

			<Routes>			
				<Route path="/" element={<Home />} />
				<Route path="/post/:id?" element={<Post />} />
			</Routes>
		</>

	);
}

export default App;
