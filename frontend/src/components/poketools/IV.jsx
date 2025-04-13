import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../Loading";
import Select from "react-select";
import axiosInstance from '../../axiosConfigs/axiosConfig';
import Error from "../error";

const IVCalculator = () => {
  const { t } = useTranslation();

  const [pokemonData, setPokemonData] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedNature, setNature] = useState("Fuerte");
  const [selectedLevel, setLevel] = useState(100);
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    PS: 0,
    Ataque: 0,
    Defensa: 0,
    "Ataque Especial": 0,
    "Defensa Especial": 0,
    Velocidad: 0,
  });

  const [evs, setEvs] = useState({
    PS: 0,
    Ataque: 0,
    Defensa: 0,
    "Ataque Especial": 0,
    "Defensa Especial": 0,
    Velocidad: 0,
  });

  const [natures, setNaturesNames] = useState({
    Fuerte: { increase: null, decrease: null },
    Huraña: { increase: "Ataque", decrease: "Defensa" },
    Audaz: { increase: "Ataque", decrease: "Velocidad" },
    Firme: { increase: "Ataque", decrease: "Ataque Especial" },
    Pícara: { increase: "Ataque", decrease: "Defensa Especial" },
    Osada: { increase: "Defensa", decrease: "Ataque" },
    Dócil: { increase: null, decrease: null },
    Plácida: { increase: "Defensa", decrease: "Velocidad" },
    Agitada: { increase: "Defensa", decrease: "Ataque Especial" },
    Floja: { increase: "Defensa", decrease: "Defensa Especial" },
    Miedosa: { increase: "Velocidad", decrease: "Ataque" },
    Activa: { increase: "Velocidad", decrease: "Defensa" },
    Seria: { increase: null, decrease: null },
    Alegre: { increase: "Velocidad", decrease: "Ataque Especial" },
    Ingenua: { increase: "Velocidad", decrease: "Defensa Especial" },
    Modesta: { increase: "Ataque Especial", decrease: "Ataque" },
    Afable: { increase: "Ataque Especial", decrease: "Defensa" },
    Mansa: { increase: "Ataque Especial", decrease: "Velocidad" },
    Tímida: { increase: null, decrease: null },
    Alocada: { increase: "Ataque Especial", decrease: "Defensa Especial" },
    Serena: { increase: "Defensa Especial", decrease: "Ataque" },
    Amable: { increase: "Defensa Especial", decrease: "Defensa" },
    Grosera: { increase: "Defensa Especial", decrease: "Velocidad" },
    Cauta: { increase: "Defensa Especial", decrease: "Ataque Especial" },
    Rara: { increase: null, decrease: null },
  });

  const handlePokemonChange = (selectedOption) => {
    setSelectedPokemon(
      pokemonData.find((pokemon) => pokemon.value === selectedOption.value)
    );
  };

  const handleNatureChange = (selectedOption) => {
    setNature(selectedOption.value);
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setStats((prevStats) => ({ ...prevStats, [name]: Number(value) }));
  };

  const handleIvChange = (e) => {
    const { name, value } = e.target;
    setEvs((prevEvs) => ({ ...prevEvs, [name]: Number(value) }));
  };

  const handleCalculation = () => {
    if (!selectedPokemon) {
      return;
    }

    const results = selectedPokemon.stats.map(({ name, base_stat }) => {
      const statValue = stats[name];
      const evValue = evs[name];
      const natureBonus = checkNature(selectedNature, name);
      const ev = calculateIV(
        statValue,
        natureBonus,
        selectedLevel,
        base_stat,
        evValue,
        name
      );
      return { name, ev: ev };
    });
    setResultados(results);
  };

  const generateResults = () => {
    if (!selectedPokemon) return null;

    return (
      <table className="displayTable" style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>Sprite</th>
            <th>{t("stat")}</th>
            <th>IV</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan="7" style={{ verticalAlign: "middle" }}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`}
                alt={selectedPokemon.label}
                style={{ width: "150px", height: "auto" }}
              />
            </td>
          </tr>
          {selectedPokemon.stats.map(({ name, base_stat }) => {
            const statValue = stats[name];
            const evValue = evs[name];
            const natureBonus = checkNature(selectedNature, name);
            const ev = calculateIV(
              statValue,
              natureBonus,
              selectedLevel,
              base_stat,
              evValue,
              name
            );

            return (
              <tr key={name}>
                <td>{t(name.charAt(0).toUpperCase() + name.slice(1))}</td>
                <td>{ev < 0 || ev > 31 ? ev : ev}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  function checkNature(nature, statName) {
    if (natures[nature].increase === statName) {
      return 1.1;
    }

    if (natures[nature].decrease === statName) {
      return 0.9;
    }

    return 1;
  }

  const calculateIV = (stat, natureBonus, level, baseStat, ev, statName) => {
    if (statName === "hp") {
      return Math.ceil(
        ((stat - 10) * 100) / level - 2 * baseStat - ev / 4 - 100
      );
    }
    return Math.ceil(
      ((stat / natureBonus - 5) * 100) / level - 2 * baseStat - ev / 4
    );
  };

  useEffect(() => {
    async function getPokemonData() {
      try {
        const pokemon = await axiosInstance.get(
          "poketools/calculator"
        );

        if (!pokemon.data || pokemon.data.length == 0) {
          throw new Error();
        }

        setPokemonData(pokemon.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    getPokemonData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error_type="error_load" />;
  }

  return (
    <main>
      <h1>{t("iv_title")}</h1>
      <div id="baseForm">
        <div className="mainForm">
          <div id="form-section">
            <label htmlFor="pokemon-select" id="choose-pokemon-label">
              {t("choose_pokemon")}:
            </label>

            <Select
              id="pokemon-select"
              options={pokemonData.map((pokemon) => ({
                value: pokemon.value,
                label: pokemon.label,
              }))}
              onChange={handlePokemonChange}
              placeholder={t("choose_pokemon")}
            />
            
          </div>

          <div id="form-section">
            <label htmlFor="nature-select" id="choose-nature-label">
              {t("choose_nature")}:
            </label>
            <Select
              id="nature-select"
              options={Object.keys(natures).map((nature) => ({
                value: nature,
                label: t(nature),
              }))}
              onChange={handleNatureChange}
              placeholder={t("choose_nature")}

            />
          </div>

          <div className="form-section">
            <label htmlFor="level-select" id="level-label">
              {t("choose_level")}
            </label>
            <input
              type="number"
              name="level-select"
              id="level-select"
              style={{ width: "150px" }}
              min="1"
              max="100"
              value={selectedLevel}
              onChange={(e) => setLevel(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>{t("choose_stat")}</h3>
          <table className="displayTable">
            <thead>
              <tr>
                <th>{t("stat")}</th>
                <th>{t("value")}</th>
                <th>EV</th>
              </tr>
            </thead>
            <tbody>
              {[
                "PS",
                "Ataque",
                "Defensa",
                "Ataque Especial",
                "Defensa Especial",
                "Velocidad",
              ].map((stat) => (
                <tr key={stat}>
                  <td>{t(stat.charAt(0).toUpperCase() + stat.slice(1))}</td>
                  <td>
                    <input
                      type="number"
                      name={stat}
                      value={stats[stat]}
                      onChange={handleStatChange}
                      min="0"
                      max="999"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name={stat}
                      value={evs[stat]}
                      onChange={handleIvChange}
                      min="0"
                      max="252"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="buttons">
        <button onClick={handleCalculation}>{t("calculate")} IV</button>
        <button onClick={() => setResultados(null)}>{t("clear")}</button>
        </div>
      </div>

      {resultados && generateResults()}
    </main>
  );
};

export default IVCalculator;
