import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstanceCommunitymon from "../../axiosConfigs/axiosConfigCommunitymon";
import Error from "../error";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";
function ReadOne() {
  const [communitymon, setCommunitymon] = useState(null);
  const location = useLocation();
  const {t}= useTranslation();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  async function getData(id_communitymon) {
    setLoading(true);
    try {
      let response = await axiosInstanceCommunitymon.get(id_communitymon);

      if(response.data.error){
          setError(true);
        return;
      }

      setCommunitymon(response.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let pokemonInfo = location.pathname.match(/\/([^\/]+)\/?$/)[1];
    if (!pokemonInfo || isNaN(Number(pokemonInfo))) {
      setError(true);
      return;
    }
    getData(pokemonInfo);
  }, []);

  if (error) {
    return <Error error_type={"no_communitymon"} />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <main className="mainPokemonInfo">
        <h1>{communitymon.name}</h1>
        <h2>{communitymon.specie}</h2>
        <div className="basicInfo">
          <div className="infoImage">
            <img src={communitymon.sprite} alt={communitymon.name} />
          </div>
          <div className="info">
            <p>
              <em className="pokedexEntry">{communitymon.description}</em>
            </p>
            <p>{communitymon.height} m</p>
            <p>{communitymon.weight} kg</p>
            <p>{`${t("username")}: ${communitymon.user}`}</p>
          </div>
        </div>
      </main>
    </>
  );
}

export default ReadOne;
