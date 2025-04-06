import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";
import axiosInstanceCommunitymon from "../../axiosConfigCommunitymon";
import { useUser } from "../../userContext";

function DeleteCommunitymon() {
  const [loading, setLoading] = useState(true);
  const [communitymon, setCommunitymon] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(0);
  const { t } = useTranslation();
  const [error, setError] = useState();
  const { verify, user } = useUser();
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const response = await axiosInstanceCommunitymon.post(
        "/my_communitymon",
        { id_user: user.id }
      );
      setCommunitymon(response.data);
    } catch (error) {
      setError("error_load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!verify()) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [verify, user, navigate]);

  if (error) {
    return <h1>{t("error_load")}</h1>;
  }

  if (loading) {
    return <Loading />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const selected = communitymon.find(
      (pokemon) => pokemon.id === selectedPokemon
    );
    if (!selected) {
      return;
    }

    if (!selectedPokemon || selectedPokemon === 0) {
      return;
    }

    try {
      await axiosInstanceCommunitymon.post("delete", {
        id_communitymon: selectedPokemon,
      });

      // navigate('/communitymon/delete');

      await fetchData();
      setSelectedPokemon(0);

    } catch (error) {
      console.error(error);
    }
  }

  function handleSelectPokemon(e) {
    setSelectedPokemon(Number(e.target.value));
  }

  return (
    <>
      <h1>{t("delete_title")}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="formTypes">{t('choose_pokemon_delete')}</label>
        <select id="formTypes" onChange={handleSelectPokemon} value={selectedPokemon}>
          <option value={0}>{t("selectPokemon")}</option>
          {communitymon.map((pokemon) => (
            <option key={pokemon.id} value={pokemon.id}>
              {pokemon.name}
            </option>
          ))}
        </select>
        <button type="submit">{t("submit_button_delete")}</button>
      </form>
    </>
  );
}

export default DeleteCommunitymon;
