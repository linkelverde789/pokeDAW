import { useEffect, useState } from "react";
import axiosPoketeam from "../../axiosConfigTeams";
import TeamCard from "./TeamCard";
import { useTranslation } from "react-i18next";
import { useUser } from "../../userContext";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";

export default function ReadAllPoketeam() {
    const { t } = useTranslation();
    const { user, verify } = useUser();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    async function fetchInfo(id_user) {
        let response = await axiosPoketeam.post("readAll", { id_user: id_user })
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

    if (data.length === 0) {
        return (
            <div className="error-message">
                <h1>{t("Teams_title")}</h1>
                <p>{t("No_teams_message")}</p>
            </div>
        );
    }

    return <>
        <h1>{t("Teams_title")}</h1>
        <div className="teamCards">
            {data.length > 1 ? data.map(item => {
                return <TeamCard key={item.id} teamData={{...item}} />
            }) : <TeamCard teamData={data[0]} />}
        </div>
    </>
} 