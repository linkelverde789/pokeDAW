import { useEffect, useState } from "react";
import axiosPoketeam from "../../axiosConfigTeams";
import { useTranslation } from "react-i18next";
import { useUser } from "../../userContext";
import Loading from "./../Loading";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function CreatePoketeam() {
    const [data, setData] = useState([]);
    const [team, setTeam] = useState([null, null, null, null, null, null]);
    const [teamName, setTeamName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user, verify } = useUser();
    const navigate = useNavigate();
    
    const { t } = useTranslation();

    async function fetchInfo(id_user) {
        try {
            setIsLoading(true);
            let response = await axiosPoketeam.post("pokemember/readAll", { id_user: id_user });
            if (!response || !response.data) return setData([]);
            setData(response.data);
        } catch (err) {
            setError(t("error.fetching_pokemon"));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!verify()) {
            navigate("/login");
            return;
        }
        fetchInfo(user.id);
    }, [user, navigate]);

    function handleSelectChange(index, selectedValue) {
        if (!selectedValue) {
            const newTeam = [...team];
            newTeam[index] = null;
            setTeam(newTeam);
            return;
        }

        const newTeam = [...team];
        newTeam[index] = selectedValue;
        setTeam(newTeam);
        setError("");
    }

    async function handleSaveTeam() {
        try {
            setIsLoading(true);
            const teamIds = team.map(pokemon => pokemon?.value).filter(Boolean);
            
            if (teamIds.length === 0) {
                setError(t("error.at_least_one_pokemon"));
                return;
            }

            if (!teamName.trim()) {
                setError(t("error.team_name_required"));
                return;
            }

            await axiosPoketeam.post("create", {
                id_user: user.id,
                pokemon_members: teamIds,
                team_name: teamName
            });

            setSuccess(t("success.team_created"));
            setTimeout(() => navigate("/my-teams"), 2000);
        } catch (err) {
            setError(t("error.saving_team"));
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading && data.length === 0) {
        return <Loading />;
    }

    if (data.length === 0 || data.error) {
        return (
            <div className="error-message">
                <h1>{t("create_team.title")}</h1>
                <p>{t("error.no_pokemon_available")}</p>
            </div>
        );
    }

    return (
        <div className="create-team-container">
            <h1>{t("create_team.title")}</h1>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="team-name-input">
                <label>{t("create_team.team_name")}</label>
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder={t("create_team.enter_team_name")}
                />
            </div>

            <div className="team-selectors">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="pokemon-selector">
                        <label>{t("create_team.pokemon")} {index + 1}</label>
                        <Select
                            value={team[index]}
                            onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                            options={data.map((item) => ({
                                value: item.id_team_member,
                                label: item.name,
                            }))}
                            placeholder={t("create_team.select_pokemon")}
                            isClearable
                        />
                    </div>
                ))}
            </div>

            <button 
                className="save-team-button"
                onClick={handleSaveTeam}
                disabled={isLoading || team.every(pokemon => !pokemon) || !teamName.trim()}
            >
                {isLoading ? t("common.saving") : t("create_team.save_team")}
            </button>
        </div>
    );
}
