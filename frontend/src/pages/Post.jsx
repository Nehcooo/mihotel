import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

function Post() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [condition, setCondition] = useState("");
    const [availability, setAvailability] = useState({ date: "", time: "" });
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                const response = await fetch(`http://localhost:5000/api/post/${id}`);
                const data = await response.json();

                if (data.success) {
                    setName(data.post.item_name);
                    setLocation(data.post.pickup_location);
                    setCondition(data.post.condition);
                    setAvailability({
                        date: new Date(data.post.availability.date).toLocaleDateString("fr-FR", {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        }),
                        time: data.post.availability.time
                    });
                    setDescription(data.post.description);
                }
            }

            fetchPost();
        }
    }, [id]);

    const handleInputDateChange = (e) => {
        let input = e.target.value.replace(/[^\d]/g, "");
        if (input.length > 8) input = input.slice(0, 8);

        let formatted = "";
        if (input.length >= 2) {
            formatted += input.slice(0, 2) + "/";
        } else {
            formatted += input;
        }

        if (input.length >= 4) {
            formatted += input.slice(2, 4) + "/";
        } else if (input.length > 2) {
            formatted += input.slice(2);
        }

        if (input.length > 4) {
            formatted += input.slice(4);
        }

        setAvailability((prev) => ({
            ...prev,
            date: formatted
        }));
    }

    const handleInputDateKeyDown = (e) => {
        if (e.key === "Backspace") {
            e.preventDefault();

            setAvailability((prev) => ({
                ...prev,
                date: prev.date.slice(0, -1)
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !location || !condition || !availability.date || !availability.time || !description) {
            setError("Veuillez remplir tous les champs obligatoires.");

            return;
        }

        const response = await fetch(id ? `http://localhost:5000/api/post/${id}` : `http://localhost:5000/api/post`, {
            method: id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                location: location,
                condition: condition,
                availability: availability,
                description: description,
            })
        });

        const data = await response.json();

        if (!data.success) {
            setError("Une erreur s'est produite.");
        }

        if (id) {
            navigate("/");
        }

        setName("");
        setLocation("");
        setCondition("");
        setAvailability({ date: "", time: "" });
        setDescription("");
    }

    return (
        <div className="w-[70%] mx-auto flex flex-col items-center justify-center mt-10 py-5">
            <h1 className="text-3xl font-bold text-center text-gray-950">{id ? "Modification d'une annonce" : "Déposer une annonce"}</h1>

            <div className="h-auto w-[80vh] ">
                <button onClick={() => navigate(-1)} className="cursor-pointer hover:opacity-80 transition-all ease bg-red-500 text-white flex items-center gap-1 mt-10 mb-2 text-lg font-semibold px-5 py-1 rounded-lg w-auto">
                    <IoIosArrowBack className="text-xl" />
                    <p className="font-bold">Retour</p>
                </button>

                {error && <p className="text-red-500 text-lg font-semibold mb-4 text-center p-3">{error}</p>}

                <form onSubmit={handleSubmit} className="h-full w-full p-6 flex flex-col items-center justify-center gap-4 mt-4 border border-gray-300 rounded-lg">
                    <div className="w-full flex flex-col items-start justify-center mb-4 gap-2">
                        <label className="text-gray-950 text-lg font-semibold text-left">Nom de l'objet <span className="text-red-500 font-bold">*</span></label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Exemple : Vélo de course"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="w-full flex flex-col items-start justify-center mb-4 gap-2">
                        <label className="text-gray-950 text-lg font-semibold text-left">Lieu de retrait <span className="text-red-500 font-bold">*</span></label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Exemple : 12 Rue de la Liberté, 75001 Paris"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="w-full flex flex-col items-start justify-center mb-4 gap-2">
                        <label className="text-gray-950 text-lg font-semibold text-left">État <span className="text-red-500 font-bold">*</span></label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                        >
                            <option value="">Sélectionnez un état</option>
                            <option value="new">Neuf</option>
                            <option value="good">Bon état</option>
                            <option value="used">Usagé</option>
                            <option value="damaged">Endommagé</option>
                        </select>
                    </div>

                    <div className="w-full flex flex-col items-start justify-center mb-4 gap-2">
                        <label className="text-gray-950 text-lg font-semibold text-left">Disponibilité <span className="text-red-500 font-bold">*</span></label>

                        <div className="flex items-center justify-between w-full gap-4">
                            <div className="w-full">
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={availability.date}
                                    onChange={handleInputDateChange}
                                    onKeyDown={handleInputDateKeyDown}
                                    name="birthdate"
                                    placeholder="Saissisez une date (JJ/MM/AAAA)"
                                />
                            </div>

                            <div className="w-full">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Horaires (ex : 9h-18h)"
                                    value={availability.time}
                                    onChange={(e) => setAvailability((prev) => ({ ...prev, time: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-start justify-center mb-4 gap-2">
                        <label className="text-gray-950 text-lg font-semibold mb-2">Description <span className="text-red-500 font-bold">*</span></label>

                        <textarea
                            className="w-full px-3 py-2  border border-gray-300 rounded-lg"
                            placeholder="Informations complémentaires sur l'objet..."
                            rows="5"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <button className="cursor-pointer hover:opacity-80 transition-all ease bg-red-500 text-white flex items-center gap-2 text-lg font-semibold px-5 py-1 rounded-lg w-full justify-center">
                        <p className="font-bold">{id ? "Modifier mon annonce" : "Déposer mon annonce"}</p>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Post;