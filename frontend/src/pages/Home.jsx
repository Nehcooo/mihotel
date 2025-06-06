import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { MdDelete, MdEdit, MdOutlineDateRange } from "react-icons/md";
import { GiLifeBar } from "react-icons/gi";
import { GrFormNext } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";

function Home() {
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPage = parseInt(searchParams.get("page")) || 1;
	const currentSearch = searchParams.get("search") || "";

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);
	const [search, setSearch] = useState(currentSearch);
	const [sortType, setSortType] = useState("recents");
	const [condition, setCondition] = useState("all");

	useEffect(() => {
		const fetchPosts = async () => {			
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_BACKEND_URL}/api/post?page=${currentPage}&search=${currentSearch}&sort=${sortType}&condition=${condition}`, {
					method: "GET",
				});
				const data = await response.json();

				setPosts(data.posts);
				setTotalPages(data.totalPages || 1);
			} catch (error) {
				console.error("Error fetching posts : ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [searchParams, sortType, condition]);

	const handleDeletePost = async (postId) => {
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_BACKEND_URL}/api/post/${postId}`, {
				method: "DELETE",
			});
			const data = await response.json();

			if (data.success) {
				setPosts(posts.filter(post => post._id !== postId));
			}
		} catch (error) {
			console.error("Error deleting post : ", error);
		}
	}

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setSearchParams({ page: currentPage - 1 });
		}
	}

	const handleNextPage = () => {
		if (currentPage >= totalPages) {
			return;
		}

		setSearchParams({ page: currentPage + 1 });
	}

	const getConditionLabel = (condition) => {
		switch (condition) {
			case "new":
				return "Neuf";
			case "good":
				return "Bon état";
			case "used":
				return "Usagé";
			default:
				return "Endommagé";
		}
	}

	return (
		<div className="w-[70%] mx-auto flex flex-col items-start justify-center mt-10 py-5">
			<div className="w-full flex flex-col items-end justify-center mb-5">
				<div className="w-[300px] max-md:w-[200px] flex items-center gap-2 h-[35px]">
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Rechercher..."
						className="border border-gray-300 rounded-lg h-full px-5 w-full"
					/>
					<div
						onClick={() => setSearchParams({ search })}
						className="bg-red-500 text-white h-full flex items-center justify-center px-3 rounded-lg hover:bg-red-400 transition-colors cursor-pointer"
					>
						<FaSearch className="text-lg" />
					</div>
				</div>

				<div className="w-[300px] max-md:w-[200px] flex items-start justify-center mb-0 gap-2 mt-2">					
					<select
						className="w-full px-3 py-2 border border-gray-300 rounded-lg"
						value={sortType}
						onChange={(e) => setSortType(e.target.value)}
					>
						<option value="recents">Les plus récents</option>
						<option value="old">Les plus anciens</option>
					</select>
				</div>

				<div className="w-[300px] max-md:w-[200px] flex items-start justify-center mb-0 gap-2 mt-2">					
					<select
						className="w-full px-3 py-2 border border-gray-300 rounded-lg"
						value={condition}
						onChange={(e) => setCondition(e.target.value)}
					>
						<option value="">Tous les états</option>
						<option value="new">Neuf</option>
						<option value="good">Bon état</option>
						<option value="used">Usagé</option>
						<option value="damaged">Endommagé</option>
					</select>
				</div>
			</div>

			<h1 className="text-3xl font-bold text-center text-gray-950 mt-5">Liste des annonces</h1>

			{(!loading && posts.length === 0) && (
				<div className="mt-10 h-[30vh] w-full p-6 flex items-center justify-center border border-gray-200 shadow-lg rounded-lg">
					<p className="text-gray-500 text-2xl">Aucune annonce trouvée :/</p>
				</div>
			)}

			{loading ? (
				<p>Chargement...</p>
			) : (
				<div className="h-auto w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-10">
					{posts.map((post) => (
						<div key={post._id} className="group relative hover:-translate-y-2 transition-all ease-in duration-100 h-auto w-full p-6 flex flex-col items-start justify-center gap-1 border border-gray-200 shadow-lg rounded-lg">
							<h2 className="text-xl font-semibold group-hover:text-red-500 truncate max-w-[100%]">{post.item_name}</h2>

							<p className="mt-4 text-gray-700 truncate max-w-[100%]">{post.description}</p>

							<div className="flex items-center gap-2 mt-2">
								<IoLocationOutline className="text-red-500" />

								<p className="text-gray-700 truncate max-w-[100%]">{post.pickup_location}</p>
							</div>

							<div className="flex items-center gap-2 mt-0">
								<MdOutlineDateRange className="text-black" />

								<p className="text-gray-700 truncate max-w-[100%]">{post.availability.date} | {post.availability.time}</p>
							</div>

							<div className="flex items-center gap-2 mt-0">
								<GiLifeBar className="text-blue-500" />

								<p className="text-gray-700">{getConditionLabel(post.condition)}</p>
							</div>

							<p className="text-gray-500 text-sm mt-4">Créer le {new Date(post.createdAt).toLocaleDateString("fr-FR")} à {new Date(post.createdAt).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</p>

							<div className="flex items-center justify-between gap-4 w-full mt-4">
								<Link to={`/post/${post._id}`} className="cursor-pointer hover:opacity-80 transition-all ease bg-black/80 text-white flex items-center gap-2 text-lg font-semibold px-5 py-1 rounded-lg w-full justify-center">
									<p className="font-bold max-xl:hidden">Modifier</p>
									<MdEdit className="xl:hidden text-xl" />
								</Link>

								<button onClick={() => handleDeletePost(post._id)} className="cursor-pointer hover:opacity-80 transition-all ease border-2 border-red-500 text-red-500 flex items-center gap-2 text-lg font-semibold px-5 py-1 rounded-lg w-full justify-center">
									<p className="font-bold max-xl:hidden">Supprimer</p>
									<MdDelete className="xl:hidden text-xl" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="w-full flex items-center justify-between gap-5 mt-10">
				<button onClick={handlePrevPage} className={`${currentPage <= 1 && "opacity-60 pointer-events-none"} cursor-pointer hover:opacity-80 transition-all ease bg-red-500 text-white flex items-center gap-1 text-lg font-semibold px-5 py-1 rounded-lg w-auto`}>
					<GrFormNext className="text-xl mt-0.5 rotate-180" />
					<p className="max-md:hidden">Page précédente</p>
				</button>

				<p className="transition-all ease bg-black/80 text-white flex items-center gap-1 text-lg font-semibold px-5 py-1 rounded-lg w-auto">{currentPage}/{totalPages}</p>

				<button onClick={handleNextPage} className={`${currentPage >= totalPages && "opacity-60 pointer-events-none"} cursor-pointer hover:opacity-80 transition-all ease bg-red-500 text-white flex items-center gap-1 text-lg font-semibold px-5 py-1 rounded-lg w-auto`}>
					<p className="max-md:hidden">Page suivante</p>
					<GrFormNext className="text-xl mt-0.5" />
				</button>
			</div>
		</div>
	);
}

export default Home;