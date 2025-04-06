import React, { useEffect, useState } from "react";
import FullPokemonSelect from "../select";
import { useTranslation } from "react-i18next";

function Damage() {
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [result, setResult] = useState(null);
  const { t, i18n } = useTranslation();

  const typeChart = {
    steel: {
      effective: ["fairy", "ice", "rock"],
      notEffective: ["steel", "water", "electric", "fire"],
      weakTo: ["fighting", "fire", "ground"],
      immune: ["poison"],
    },
    flying: {
      effective: ["bug", "fighting", "grass"],
      notEffective: ["electric", "rock", "steel"],
      weakTo: ["electric", "ice", "rock"],
      immune: ["ground"],
    },
    water: {
      effective: ["fire", "rock", "ground"],
      notEffective: ["water", "dragon", "grass"],
      weakTo: ["electric", "grass"],
      immune: [],
    },
    ice: {
      effective: ["dragon", "grass", "ground", "flying"],
      notEffective: ["steel", "water", "fire", "ice"],
      weakTo: ["steel", "fire", "fighting", "rock"],
      immune: [],
    },
    grass: {
      effective: ["water", "rock", "ground"],
      notEffective: [
        "steel",
        "bug",
        "dragon",
        "fire",
        "grass",
        "poison",
        "flying",
      ],
      weakTo: ["bug", "fire", "ice", "poison", "flying"],
      immune: [],
    },
    bug: {
      effective: ["grass", "psychic", "dark"],
      notEffective: [
        "steel",
        "ghost",
        "fire",
        "fairy",
        "fighting",
        "poison",
        "flying",
      ],
      weakTo: ["fire", "rock", "flying"],
      immune: [],
    },
    electric: {
      effective: ["water", "flying"],
      notEffective: ["dragon", "electric", "grass"],
      weakTo: ["ground"],
      immune: [],
    },
    normal: {
      effective: [],
      notEffective: ["rock", "steel"],
      weakTo: ["fighting"],
      immune: ["ghost"],
    },
    rock: {
      effective: ["bug", "fire", "ice", "flying"],
      notEffective: ["steel", "fighting", "ground"],
      weakTo: ["water", "steel", "fighting", "grass", "ground"],
      immune: [],
    },
    ground: {
      effective: ["steel", "electric", "fire", "rock", "poison"],
      notEffective: ["bug", "grass"],
      weakTo: ["water", "ice", "grass"],
      immune: ["electric"],
    },
    fire: {
      effective: ["steel", "bug", "ice", "grass"],
      notEffective: ["water", "dragon", "fire", "rock"],
      weakTo: ["water", "rock", "ground"],
      immune: [],
    },
    fighting: {
      effective: ["steel", "ice", "normal", "rock", "dark"],
      notEffective: ["bug", "fairy", "psychic", "poison", "flying"],
      weakTo: ["fairy", "psychic", "flying"],
      immune: [],
    },
    fairy: {
      effective: ["dragon", "fighting", "dark"],
      notEffective: ["steel", "fire", "poison"],
      weakTo: ["steel", "poison"],
      immune: ["dragon"],
    },
    psychic: {
      effective: ["fighting", "poison"],
      notEffective: ["steel", "psychic"],
      weakTo: ["bug", "ghost", "dark"],
      immune: [],
    },
    poison: {
      effective: ["fairy", "grass"],
      notEffective: ["ghost", "rock", "ground", "poison"],
      weakTo: ["psychic", "ground"],
      immune: [],
    },
    dragon: {
      effective: ["dragon"],
      notEffective: ["steel"],
      weakTo: ["dragon", "fairy", "ice"],
      immune: [],
    },
    ghost: {
      effective: ["ghost", "psychic"],
      notEffective: ["dark"],
      weakTo: ["ghost", "dark"],
      immune: ["normal", "fighting"],
    },
    dark: {
      effective: ["ghost", "psychic"],
      notEffective: ["fairy", "fighting", "dark"],
      weakTo: ["bug", "fairy", "fighting"],
      immune: ["psychic"],
    },
  };

  function handleChangePokemon(event, position) {
    const newPokemon = [...selectedPokemon];
    newPokemon[position] = event.value;
    setSelectedPokemon(newPokemon);
  }

  function checkTypeAdvantage(attackType, targetType) {
    if (!targetType) return 1;
    if (typeChart[targetType]?.immune.includes(attackType)) return 0;
    if (typeChart[attackType]?.effective.includes(targetType)) return 2;
    if (typeChart[attackType]?.notEffective.includes(targetType)) return 0.5;
    return 1;
  }

  function generateNumberToString(number) {
    let result = number.toString();
    while (result.length < 4) {
      result = "0" + result;
    }

    return result;
  }

  useEffect(() => {
    setResult(
      <div className="displayTable">
        <table className="displayTable" id="PokemonDirect">
        <thead>
          <tr>
            <th>{t("type")}s</th>
            {Array.from({ length: 6 }).map((_, index) => (
              <th key={index} className="noBueno">
                <p>{selectedPokemon[index]?.name || `Pokemon ${index + 1}`}</p>
                {selectedPokemon[index] && (
                  <img
                    src={`https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${generateNumberToString(selectedPokemon[index].id)}/Normal.png`}
                    // src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon[index].id}.png`}
                  ></img>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(typeChart).map(([type]) => (
            <tr key={type}>
              <td className={type}>{t(type)}</td>
              {Array.from({ length: 6 }).map((_, index) => {
                let result = "";
                if (selectedPokemon[index]) {
                  result =
                    checkTypeAdvantage(
                      type,
                      selectedPokemon[index].type1.toLowerCase()
                    ) *
                    checkTypeAdvantage(
                      type,
                      selectedPokemon[index].type2?.toLowerCase()
                    );
                }

                return (
                  <td key={index} className={result}>
                    {result}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  }, [selectedPokemon, i18n.language]);

  return (
    <>
      <h1>{t("damage_title")}</h1>
      <div className="spacer"></div>
      <div className="damage-container">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="pokemon-select-item">
            <label htmlFor={`pkm${index + 1}`}>
              {t("choose_pokemon")} {index + 1}
            </label>
            <FullPokemonSelect
              id={`pkm${index + 1}`}
              onChange={(e) => handleChangePokemon(e, index)}
            />
          </div>
        ))}
      </div>
      <div className="spacer"></div>
      {result}
    </>
  );
}

export default Damage;
