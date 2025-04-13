import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import Select from "react-select";
import confetti from "canvas-confetti";
import axiosInstance from "../../axiosConfigs/axiosConfigAPI";
import { useTranslation } from "react-i18next";

function Pokemondle() {
  const { t } = useTranslation();
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [allPokemon, setAllPokemon] = useState([]);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  async function loadPokemon() {
    try {
      let response = await axiosInstance.get("/names");
      setAllPokemon(response.data);
    } catch (error) {
      console.error("Error loading Pokémon names:", error);
    }
  }

  async function getPokemonData(id_pokemon) {
    try {
      let response = await axiosInstance.post("/pokeplay/pokemondle", {
        id_pokemon,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      return null;
    }
  }

  function checkPokemon(pokemon) {
    return (
      <tr key={pokemon.id}>
        <td
          className={pokemon.name === randomPokemon.name ? "correct" : "fail"}
        >
          {pokemon.name}
        </td>
        <td
          className={pokemon.type1 === randomPokemon.type1 ? "correct" : "fail"}
        >
          {t(pokemon.type1.toLowerCase())}
        </td>
        <td
          className={pokemon.type2 === randomPokemon.type2 ? "correct" : "fail"}
        >
          {pokemon.type2 ? t(pokemon.type2.toLowerCase()) : "-"}
        </td>
        <td
          className={
            pokemon.colour === randomPokemon.colour ? "correct" : "fail"
          }
        >
          {t(pokemon.colour)}
        </td>
        <td
          className={
            pokemon.generation === randomPokemon.generation ? "correct" : "fail"
          }
        >
          {pokemon.generation} {randomPokemon.generation>pokemon.generation ? '↑':randomPokemon.generation<pokemon.generation ? "↓":""}
        </td>
        <td
          className={
            pokemon.height === randomPokemon.height ? "correct" : "fail"
          }
        >
          {pokemon.height}m {randomPokemon.height>pokemon.height ?  '↑': pokemon.height>randomPokemon.height ? "↓":""}
        </td>
        <td
          className={
            pokemon.weight === randomPokemon.weight ? "correct" : "fail"
          }
        >
          {pokemon.weight}kg {randomPokemon.weight>pokemon.weight ?  '↑': pokemon.weight>randomPokemon.weight ? "↓":""}
        </td>
        <td
          className={
            pokemon.evolution_state === randomPokemon.evolution_state
              ? "correct"
              : "fail"
          }
        >
          {pokemon.evolution_state}
        </td>
        <td
          className={
            pokemon.can_evolve === randomPokemon.can_evolve ? "correct" : "fail"
          }
        >
          {pokemon.can_evolve ? t("yes") : "No"}
        </td>
      </tr>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedPokemon) return;

    if (result.some((p) => p.id === selectedPokemon)) return;
    const pokemonData = await getPokemonData(selectedPokemon);
    if (!pokemonData) return;


    setResult((prevResult) => [pokemonData, ...prevResult]);

    if (pokemonData.id === randomPokemon.id) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(start, 3000);
    }
  }

  async function start() {
    setLoading(true);
    setResult([]);

    const randomIndex = Math.floor(Math.random() * allPokemon.length);
    const pokemon = await getPokemonData(allPokemon[randomIndex]?.id);
    setRandomPokemon(pokemon);
    setTimeout(()=>{
      setLoading(false);
    }, 1500);
  }

  useEffect(() => {
    loadPokemon();
  }, []);

  useEffect(() => {
    if (allPokemon.length) start();
  }, [allPokemon]);

  if (loading) return <Loading />;

  return (
    <>
    <h1>Pokemondle</h1>
      <div className="baseForm">
        <div className="mainForm">
          <div className="form-section">
            <Select
              className="pokemon-select"
              classNamePrefix="react-select"
              options={allPokemon.map((pokemon) => ({
                value: pokemon.id,
                label: pokemon.name,
              }))}
              onChange={(option) => setSelectedPokemon(option.value)}
              placeholder={t("choose_pokemon")}
            />
            <button type="submit" id="pokemondleButton" onClick={handleSubmit}>
              {t("guess")}
            </button>
          </div>
        </div>
      </div>
<div className="tablePokemondle">

      <table className="displayTable">
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("type")} 1</th>
            <th>{t("type")} 2</th>
            <th>Color</th>
            <th>{t("gen")}</th>
            <th>{t("height")}</th>
            <th>{t("weight")}</th>
            <th>{t("evolution_state")}</th>
            <th>{t("can_evolve")}</th>
          </tr>
        </thead>
        <tbody>{result.map(checkPokemon)}</tbody>
      </table>
</div>
    </>
  );
}

export default Pokemondle;
