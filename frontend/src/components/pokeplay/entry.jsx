import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../Loading";
import confetti from "canvas-confetti";
import axiosInstance from "../../axiosConfigs/axiosConfig";
import FullPokemonSelect from "../select";

async function getPokemon() {
  try {
    const pokemon = await axiosInstance.get("pokeplay/entry");
    return pokemon.data;
  } catch (error) {
    console.error(error);
  }
}

function PokeplayEntry() {
  const { t, i18n } = useTranslation();
  const [randomPokemon, setRandomPokemon] = useState(null);
  const [points, setPoints] = useState(0);
  const [bestScore, setBestScore]=useState(0);
  const [guess, setGuess] = useState("");
  const [shake, setShake] = useState(false);
  const [answer, setAnswer] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      const pokemon = await getPokemon();
      setRandomPokemon(pokemon);
    };
    fetchPokemon();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAnswer(true);

    if (guess.id === randomPokemon.id) {
      setPoints((prevPoints) => prevPoints + 1);

      // Disparar confetti
      confetti({
        particleCount: 100 * (points + 1),
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      if (bestScore<points) setBestScore(points)
      setPoints(0);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setGuess("");

    setTimeout(async () => {
      setAnswer(false);
      const newPokemon = await getPokemon();
      setRandomPokemon(newPokemon);
    }, 1250);
  };

  if (!randomPokemon) {
    return <Loading />;
  }

  if (i18n.language == "es-ES") {
    i18n.language = "es";
  }

  return (
    <div className={`mainGuess ${shake ? "shake" : ""}`}>
      <h1>{t("guessTitle")}</h1>

      <div className="entryDescription">
        <p className="descriptionText">
          <em>{randomPokemon.text[i18n.language]}</em>
        </p>
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

      <img
        src="https://media.tenor.com/ihqN6a3iiYEAAAAM/pikachu-shocked-face-stunned.gif"
        alt=""
        id="gif"
      />
    </div>
  );
}

export default PokeplayEntry;