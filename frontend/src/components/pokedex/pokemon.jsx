import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfigs/axiosConfigAPI";
import axiosUserPokemon from "../../axiosConfigs/axiosConfigUser";
import Loading from "../Loading";
import Error from "../error";
import { useTranslation } from "react-i18next";
import { useUser } from "../../userContext";

function Pokemon() {
  const { user } = useUser();
  const [info, setInfo] = useState(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function getData() {
    let pokemonInfo = location.pathname.match(/\/([^\/]+)\/?$/)[1];
    
    try {
      const data = await axiosInstance.get(`pokemon/${pokemonInfo}`);
      return data.data[0];
    } catch (error) {
      console.error("Error fetching data: ", error);
      setError(true);
    }
  }
  async function getInfo(userID, pokemonID) {
    try {
      const response = await axiosUserPokemon.post("info", {
        id_pokemon: pokemonID,
        id_user: userID,
      });
      if (!response) {
        return { fav: false, catched: false };
      }
      return { fav: response.data.fav, catched: response.data.catched };
    } catch (error) {
      return { fav: false, catched: false };
    }
  }

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      if (result) {
        setPokemon(result);
      }
      setLoading(false);
    }
    fetchData();
  }, [location]);

  useEffect(() => {
    if (!user.id || !pokemon) {
      return;
    }
    async function fetchInfo(userID, pokemonID) {
      const result = await getInfo(userID, pokemonID);
      setInfo(result);
    }

    fetchInfo(user.id, pokemon.id);
  }, [pokemon]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error_type="error_load" />;
  }

  if (!pokemon) {
    return <Error error_type="no_data" />;
  }

  if (i18n.language == "es-ES") {
    i18n.language = "es";
  }

  async function handleFav(event) {
    event.preventDefault();
    if (!user.id || info.fav) {
      alert(t("duplicateAction"));
      return;
    }

    try {
      await axiosUserPokemon.post("putFav", {
        id_pokemon: pokemon.id,
        id_user: user.id,
      });
      setInfo({ fav: true, catched: info.catched });
    } catch (error) {
      return;
    }
  }
  async function handleCapture(event) {
    event.preventDefault();
    if (!user.id || info.catched) {
      alert(t("duplicateAction"));

      return;
    }

    try {
      await axiosUserPokemon.post("putCapture", {
        id_pokemon: pokemon.id,
        id_user: user.id,
      });
      setInfo({ fav: info.fav, catched: true });
    } catch (error) {
      console.error(error);
      return;
    }
  }

  return (
    <main className="mainPokemonInfo">
      {info && user.id && (
        <>
          <div className="buttons">
            <button id="captured" onClick={handleCapture}>
              <img
                className={info.catched.toString()}
                src="/images/catch.png"
                alt=""
              />
            </button>
            <button onClick={handleFav}>
              <img
                id="fav"
                className={info.fav.toString()}
                src="/images/fav.png"
                alt=""
              />
            </button>
          </div>
        </>
      )}
      <h1>{pokemon.name}</h1>
      <h2>{pokemon.text[i18n.language].specie}</h2>
      <div className="basicInfo">
        <div className="infoImage">
          {/* <p className="pokemonID">#{pokemon.id}</p> */}

          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
          />
        </div>
        <div className="info">
          <p>
            {t("gen")}: {pokemon.generation}
          </p>
          <p>
            <em className="pokedexEntry">
              {pokemon.text[i18n.language].description}
            </em>
          </p>
          <p>
            {t("height")}: {pokemon.height} m
          </p>
          <p>
            {t("weight")}: {pokemon.weight} kg
          </p>
        </div>
      </div>
      <details>
        <summary>{t("abilities")}</summary>
        <table className="displayTable">
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("description")}</th>
              <th>{t("type")}</th>
            </tr>
          </thead>
          <tbody>
            {pokemon.abilities.map((ability, index) => {
              return (
                <tr key={index}>
                  <td>
                    {ability.text[i18n.language].name[0].toUpperCase() +
                      ability.text[i18n.language].name.substring(1)}
                  </td>
                  <td>
                    {ability.text[i18n.language].description[0].toUpperCase() +
                      ability.text[i18n.language].description.substring(1)}
                  </td>
                  <td>
                    {ability.type == "hidden" ? t("hidden") : t("primary")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
      <details>
        <summary>{t("stat") + "s"}</summary>
        <div className="pokemonStats">
          <table className="displayTable">
            <tbody>
              <tr>
                <th>{t("stat")}</th>
                <th>Base</th>
                <th>{t("range")}</th>
                <th>Max</th>
              </tr>
              <tr>
                <td>{t("PS")}</td>
                <td>{pokemon.base_stat.hp}</td>
                <td>
                  <progress
                    value={pokemon.base_stat.hp}
                    max={
                      Math.floor(
                        0.01 *
                          (2 * pokemon.base_stat.hp +
                            31 +
                            Math.floor(0.25 * 252)) *
                          100
                      ) +
                      100 +
                      10
                    }
                  ></progress>
                </td>
                <td>
                  {Math.floor(
                    0.01 *
                      (2 * pokemon.base_stat.hp + 31 + Math.floor(0.25 * 252)) *
                      100
                  ) +
                    100 +
                    10}
                </td>
              </tr>
              <tr>
                <td>{t("Ataque")}</td>
                <td>{pokemon.base_stat.attack}</td>

                <td>
                  <progress
                    value={pokemon.base_stat.attack}
                    max={Math.floor(
                      (Math.floor(
                        0.01 *
                          (2 * pokemon.base_stat.attack +
                            31 +
                            Math.floor(0.25 * 252)) *
                          100
                      ) +
                        5) *
                        1.1
                    )}
                  ></progress>
                </td>
                <td>
                  {Math.floor(
                    (Math.floor(
                      0.01 *
                        (2 * pokemon.base_stat.attack +
                          31 +
                          Math.floor(0.25 * 252)) *
                        100
                    ) +
                      5) *
                      1.1
                  )}
                </td>
              </tr>
              <tr>
                <td>{t("Defensa")}</td>
                <td>{pokemon.base_stat.defense}</td>

                <td>
                  <progress
                    value={pokemon.base_stat.defense}
                    max={Math.floor(
                      (Math.floor(
                        0.01 *
                          (2 * pokemon.base_stat.defense +
                            31 +
                            Math.floor(0.25 * 252)) *
                          100
                      ) +
                        5) *
                        1.1
                    )}
                  ></progress>
                </td>
                <td>
                  {Math.floor(
                    (Math.floor(
                      0.01 *
                        (2 * pokemon.base_stat.defense +
                          31 +
                          Math.floor(0.25 * 252)) *
                        100
                    ) +
                      5) *
                      1.1
                  )}
                </td>
              </tr>
              <tr>
                <td>{t("Ataque Especial")}</td>
                <td>{pokemon.base_stat.special_attack}</td>

                <td>
                  <progress
                    value={pokemon.base_stat.special_attack}
                    max={Math.floor(
                      (Math.floor(
                        0.01 *
                          (2 * pokemon.base_stat.special_attack +
                            31 +
                            Math.floor(0.25 * 252)) *
                          100
                      ) +
                        5) *
                        1.1
                    )}
                  ></progress>
                </td>
                <td>
                  {Math.floor(
                    (Math.floor(
                      0.01 *
                        (2 * pokemon.base_stat.special_attack +
                          31 +
                          Math.floor(0.25 * 252)) *
                        100
                    ) +
                      5) *
                      1.1
                  )}
                </td>
              </tr>
              <tr>
                <td>{t("Defensa Especial")}</td>
                <td>{pokemon.base_stat.special_defense}</td>

                <td>
                  <progress
                    value={pokemon.base_stat.special_defense}
                    max={Math.floor(
                      (Math.floor(
                        0.01 *
                          (2 * pokemon.base_stat.special_defense +
                            31 +
                            Math.floor(0.25 * 252)) *
                          100
                      ) +
                        5) *
                        1.1
                    )}
                  ></progress>
                </td>
                <td>
                  {Math.floor(
                    (Math.floor(
                      0.01 *
                        (2 * pokemon.base_stat.special_defense +
                          31 +
                          Math.floor(0.25 * 252)) *
                        100
                    ) +
                      5) *
                      1.1
                  )}
                </td>
              </tr>
              <tr>
                <td>{t("Velocidad")}</td>
                <td>{pokemon.base_stat.speed}</td>

                <td>
                  <progress
                    value={pokemon.base_stat.speed}
                    max={Math.floor(
                      (Math.floor(
                        0.01 *
                          (2 * pokemon.base_stat.speed +
                            31 +
                            Math.floor(0.25 * 252)) *
                          100
                      ) +
                        5) *
                        1.1
                    )}
                  ></progress>
                </td>
                <td>
                  {Math.floor(
                    (Math.floor(
                      0.01 *
                        (2 * pokemon.base_stat.speed +
                          31 +
                          Math.floor(0.25 * 252)) *
                        100
                    ) +
                      5) *
                      1.1
                  )}
                </td>
              </tr>
              <tr>
                <th>Total</th>
                <td colSpan={3}>{pokemon.base_stat.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
      <details>
        <summary>{t("evolutions")}</summary>
        <div className="pokemonEvolution">
          {pokemon.evolution_chain.pokemon1.name && (
            <div
              className="evolution-stage"
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/pokedex/pokemon/${pokemon.evolution_chain.pokemon1.id}`
                );
              }}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.evolution_chain.pokemon1.id}.png`}
                alt={pokemon.evolution_chain.pokemon1.name}
              />
              <p>{pokemon.evolution_chain.pokemon1.name}</p>
            </div>
          )}

          {pokemon.evolution_chain.pokemon2.name && (
            <>
              <p className="evolution-arrow">→</p>
              <div
                className="evolution-stage"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/pokedex/pokemon/${pokemon.evolution_chain.pokemon2.id}`
                  );
                }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.evolution_chain.pokemon2.id}.png`}
                  alt={pokemon.evolution_chain.pokemon2.name}
                />
                <p>{pokemon.evolution_chain.pokemon2.name}</p>
              </div>
            </>
          )}

          {pokemon.evolution_chain.pokemon3.name && (
            <>
              <p className="evolution-arrow">→</p>
              <div
                className="evolution-stage"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/pokedex/pokemon/${pokemon.evolution_chain.pokemon3.id}`
                  );
                }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.evolution_chain.pokemon3.id}.png`}
                  alt={pokemon.evolution_chain.pokemon3.name}
                />
                <p>{pokemon.evolution_chain.pokemon3.name}</p>
              </div>
            </>
          )}
        </div>
      </details>

      <details>
        <summary>{t("moves")}</summary>
        <div className="moves">
          <table className="displayTable">
            <thead>
              <tr>
                <th>{t("name")}</th>
                <th>{t("description")}</th>
                <th>{t("type")}</th>
                <th>{t("power")}</th>
                <th>{t("accuracy")}</th>
                <th>{t("category")}</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.moves.map((move, index) => (
                <tr key={index}>
                  <td>{move.text[i18n.language].name}</td>
                  <td>{move.text[i18n.language].description}</td>
                  <td id="types">{t(move.type)}</td>
                  <td>{move.power ?? "-"}</td>
                  <td>{move.accuracy ?? "-"}</td>
                  <td>
                    {move.category == "special"
                      ? t("special")
                      : move.category == "status"
                      ? t("status")
                      : t("physical")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </main>
  );
}

export default Pokemon;
