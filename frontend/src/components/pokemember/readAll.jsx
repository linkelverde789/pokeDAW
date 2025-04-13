import { useEffect, useState } from "react";
import PokemonCard from "./pokememberCard";
import { useTranslation } from "react-i18next";
import { useUser } from "../../userContext";
import Loading from "./../Loading";
import { useNavigate } from "react-router-dom";
import axiosPoketeam from "../../axiosConfigs/axiosConfigTeams";

export default function ReadAllPokemember() {
    const { t } = useTranslation();
    const { user, verify } = useUser();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    async function fetchInfo(id_user) {
        let response = await axiosPoketeam.post("/pokemember/readAll", { id_user: id_user })
        if (!Array.isArray(response.data)) {
            response.data=[response.data]
        }
        setData(response.data);
    }

    useEffect(() => {
        if (!verify()) {
            navigate("/login");
            return;
        }
        fetchInfo(user.id)
    }, [])

    if (!data) {
        return <Loading />
    }

    if (data.length === 0 || data.error) {
        return (
            <div className="error-message">
                <h1>{t("Pokemember_title")}</h1>
                <p>{t("No_pokemembers_message")}</p>
            </div>
        );
    }

    return <>
        <h1>{t("Pokemember_title")}</h1>
        <div className="pokememberCards">
            {data.map(item => {
                return <PokemonCard key={item.id} pokemonData={item} />
            })}
        </div>
    </>
}