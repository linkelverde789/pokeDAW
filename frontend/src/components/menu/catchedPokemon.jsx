import React, { useEffect, useState } from "react";

import { useUser } from "../../userContext";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";
import axiosUserPokemon from "../../axiosConfigs/axiosConfigUser";

function CatchedPokemon() {
  const { t } = useTranslation();
  const [catchedPokemons, setPokemons] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, verify } = useUser();
  const [error, setError] = useState();
  const navigate = useNavigate();
  async function getData(id_user) {
    try {
      const response = await axiosUserPokemon.post("getCatchedPokemon", {
        id_user: id_user,
      });
      if (response.data.many) {
        setPokemons(response.data.pokemons);
      } else {
        setPokemons(null);
      }
    } catch (error) {
      setError("catched_error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!verify()) {
      navigate("/login");
    }
    async function fetchData() {
      await getData(user.id);
    }

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (!catchedPokemons||catchedPokemons.length===0) {
    return (
      <>
        <h1>{t("catched_title")}</h1><h3 className="no_pokemon">{t("no_catch_pokemon")}</h3>
      </>
    );
  }

  return (
    <>
      <h1>{t("catched_title")}</h1>
    <div className="pokemonMain">
      {catchedPokemons.map((pokemon) => {
        return (
          <div
            className="pokemonDIV"
            key={pokemon.id}
            onClick={() => navigate(`/pokedex/pokemon/${pokemon.id}`)}
          >
            <div className={`image ${pokemon.type1.toLowerCase()}`}>
              <p className="pokemonID">#{pokemon.id}</p>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
              />
            </div>
            <div className="pokemonInfo">
              <p className="name">{pokemon.name}</p>
              <div className="types">
                <p className={`type1 text-${pokemon.type1.toLowerCase()}`}>
                  {t(pokemon.type1.toLowerCase())}
                </p>
                {pokemon.type2 && (
                  <p className={`type2 text-${pokemon.type2.toLowerCase()}`}>
                    {t(pokemon.type2.toLowerCase())}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </>
  );
}

export default CatchedPokemon;
