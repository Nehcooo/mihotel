import { BiSolidDonateHeart } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";

function NavBar() {
    const navigations = [
        { name: "Déposer une annonce", page: "/post" },
    ];

	return (
        <div className="z-10 sticky top-0 h-[90px] w-full bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <div className="flex items-center justify-between h-full w-[70%] mx-auto">
                <Link to="/" className="flex items-center gap-2 text-2xl font-semibold cursor-pointer">
                    <BiSolidDonateHeart className="text-3xl text-red-500" />
                    <p className="text-red-500 font-bold">ledoncoin</p>
                </Link>

                <div className="flex items-center gap-10 text-xl font-semibold">
                    {navigations.map((nav, index) => (
                        <Link key={index} to={nav.page} className="bg-red-500 text-white flex items-center gap-2 text-lg font-semibold px-5 py-1 rounded-lg cursor-pointer hover:opacity-80 transition-all ease">
                            <HiPlus className="text-xl" />
                            <p className="max-md:hidden  font-bold">{nav.name}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
	);
}

export default NavBar;