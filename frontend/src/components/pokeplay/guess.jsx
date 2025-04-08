import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../Loading";
import confetti from "canvas-confetti";
import axios from "axios";
import axiosInstance from '../../axiosConfig';

import FullPokemonSelect from "../select";


async function getPokemon() {
  try {
    const pokemon = await axiosInstance.get("pokeplay/guess");
    return pokemon.data;
  } catch (error) {
    const data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 1025) + 1}`);
    return { name: data.data.species.name, id: data.data.id };
  }
}

function PokeplayGuess() {
  const { t } = useTranslation();
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [points, setPoints] = useState(0);
  const [bestScore, setBestScore]=useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [pepe, setPepe] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      const pokemon = await getPokemon();
      setRandomPokemon(pokemon);
    };
    fetchPokemon();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPepe(false);
    if (guess.id == randomPokemon.id) {
      setPoints((prevPoints) => prevPoints + 1);
      setResult("Correct!");

      // Disparar confetti
      confetti({
        particleCount: 100 * (points + 1),
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      if (bestScore<points){
        setBestScore(points)
      }
      setPoints(0);
      setResult("Incorrect!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setGuess("");

    setTimeout(async () => {
      const newPokemon = await getPokemon();
      setRandomPokemon(newPokemon);
      setResult(null);
    }, 1000);
  };

  const handleImageLoad = () => {
    setPepe(true);
  };

  if (!randomPokemon) {
    return <Loading />;
  }

  return (
    <div className={`mainGuess ${shake ? "shake" : ""}`}>
      <h1>{t("guessTitle")}</h1>

      <div className={`result ${pepe ? "visible" : "hidden"}`}>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomPokemon.id}.png`}
          alt={randomPokemon.name}
          className="pokemonImage"
          onLoad={handleImageLoad}
        />
      </div>

      <FullPokemonSelect onChange={(selectedOption) => setGuess(selectedOption.value)} />
      <button type="submit" id="pokemondleButton" onClick={handleSubmit}>
        {t("guess")}
      </button>


      <p className="Points">
        {t("points")}: {points}
      </p>
      <div className="spacer"></div>
      {bestScore!==0 && <p>
        {t("best_points")}: {bestScore}
      </p>}
    </div>
  );
}

export default PokeplayGuess;
