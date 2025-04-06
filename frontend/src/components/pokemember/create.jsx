import React, { useEffect, useState } from "react";
import { useUser } from "../../userContext";
import { useNavigate } from "react-router-dom";
import FullPokemonSelect from "../select";
import Select from "react-select";
import axiosInstance from "../../axiosConfig";
import axiosPoketeam from "../../axiosConfigTeams";
import { useTranslation } from "react-i18next";

function CreatePokemonMember() {
  const [basePokemon, setBasePokemon] = useState(null);
  const [pokemonInfo, setPokemonInfo] = useState(null);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [nature, setNature] = useState(null);
  const [evs, setEvs] = useState(new Array(6).fill(0));
  const [ivs, setIvs] = useState(new Array(6).fill(0));
  const [moves, setMoves] = useState([null, null, null, null]);
  const [ability, setAbility] = useState(null);
  const [item, setItem] = useState(null);
  const { user, verify } = useUser();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!verify()) {
      navigate("/login");
    }
  }, [verify, navigate]);

  useEffect(() => {
    if (!basePokemon) {
      return setPokemonInfo(null)
    }
    fetchPokemonInfo(basePokemon.id);
  }, [basePokemon]);

  useEffect(() => {
    fetchItems();
  }, []);

  function addMove(position, id_move) {

    setMoves(moves[position - 1] = id_move);
  }

  async function fetchPokemonInfo(id_pokemon) {
    try {
      const { data } = await axiosInstance.get(`/pokemon/${id_pokemon}`);
      setPokemonInfo(data[0]);
    } catch (error) {
      console.error("Error fetching Pokémon info:", error);
    }
  }

  async function fetchItems() {
    try {
      const { data } = await axiosInstance.get("/items?holdable=true");
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }

  async function handleSubmit() {

    let newMoves=moves.filter(item=>item!==null);

    if (!name.trim() || !nature || !ability) {
      alert("Faltan campos obligatorios.");
      return;
    }

    if (evs.reduce((sum, val) => sum + val, 0) > 510) {
      alert("Los EV totales no pueden superar los 510 puntos.");
      return;
    }

    if (newMoves.length < 1) {
      alert("Debes elegir al menos un movimiento.");
      return;
    }

    if (new Set(newMoves.filter(Boolean)).size !== newMoves.filter(Boolean).length) {
      alert("No puedes elegir movimientos repetidos.");
      return;
    }

    const pokemonData = {
      name,
      id_pokemon: basePokemon.id,
      nature,
      evs,
      ivs,
      moves: newMoves,
      id_ability: ability,
      id_item: item,
      id_user: user.id,
      level: 100,
    };
    try {
      let result=await axiosPoketeam.post("/pokemember/create", {newPokemember: pokemonData});
      if(result.data.error){
        throw Error(result.data.error);
      }
      alert("Pokémon creado exitosamente");
      setBasePokemon(null);
    } catch (error) {
      console.error("Error creando el Pokémon:", error);
      alert("Hubo un error al crear el Pokémon. Inténtalo de nuevo.");
    }
  }

  function generateItems() {
    return (
      <>
        <label>{t("Objeto")}</label>
        <Select
          className="pokemonMemberSelect"
          options={items.map((item) => ({
            value: item.id,
            label: item.text[i18n.language].name,
          }))}
          onChange={(option) => setItem(option.value)}
        />
      </>
    );
  }

  function generateMoves() {
    return (<>

      <div className="moves-container">
        {[...Array(4)].map((_, i) => (
          <div className="moves-one" key={i}>
            <label>
              {t("move")} {i + 1}
            </label>
            <Select
              onChange={(option) => {
                let newArray = moves;
                newArray[i] = option.value;
                setMoves(newArray);
              }}
              className="pokemonMemberSelect"
              options={pokemonInfo.moves.map((move) => ({
                value: move.id_move,
                label: move.text[i18n.language].name,
              }))}
            />
          </div>
        ))}
      </div>
    </>
    );
  }

  function generateAbilities() {
    return (
      <>
        <label htmlFor="abilities">{t("abilities")}</label>
        <Select
          className="pokemonMemberSelect"
          options={pokemonInfo?.abilities.map((ability) => ({
            value: ability.id,
            label: ability.text[i18n.language].name,
          }))}
          onChange={(option) => setAbility(option.value)}
        />
      </>
    );
  }

  function generateForm() {
    const natures = [
      'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
      'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
      'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
      'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
      'Calm', 'Gentle', 'Careful', 'Sassy', 'Quirky'
    ];
    return (
      <>
        <label htmlFor="name">{t("name")}</label>
        <input
          type="text"
          name="name"
          id="name"
          className="banano"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="nature">{t("choose_nature")}</label>
        <Select
          className="pokemonMemberSelect"
          onChange={(option) => setNature(option.value)}
          options={natures.map(nature => ({
            value: nature,
            label: t(nature)
          }))}
        />

        <label htmlFor="stats">{t("Stats")}</label>
        <div className="tableContainer">
          <table className="displayTable">
            <thead>
              <tr>
                <th>STAT</th>
                <th>{t("PS")}</th>
                <th>{t("Ataque")}</th>
                <th>{t("Defensa")}</th>
                <th>{t("Ataque Especial")}</th>
                <th>{t("Defensa Especial")}</th>
                <th>{t("Velocidad")}</th>
              </tr>
            </thead>
            <tbody>
              {["EV", "IV"].map((type) => (
                <tr key={type}>
                  <td>{type}</td>
                  {[...Array(6)].map((_, i) => (
                    <td key={i}>
                      <input type="number" min={0} max={type === "EV" ? 252 : 31} defaultValue={0} className="banano" onChange={(e) => {
                        const value = parseInt(e.target.value, 10) || 0;
                        type === "EV"
                          ? setEvs((prev) => prev.map((ev, j) => (j === i ? value > 252 ? 252 : value : ev)))
                          : setIvs((prev) => prev.map((iv, j) => (j === i ? value > 31 ? 31 : value : iv)));
                      }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pokemonInfo && generateMoves()}
        {pokemonInfo && generateAbilities()}
        {pokemonInfo && generateItems()}

        <button onClick={handleSubmit}>{t("Crear Pokémon")}</button>
      </>
    );
  }

  return (
    <div className="createPokemonMember">
      <h1>{t("pokemember_create")}</h1>
      <label htmlFor="pokemon_base">{t("Elige el Pokémon base")}</label>
      <FullPokemonSelect
        onChange={(selectedOption) => setBasePokemon(selectedOption.value)}
      />
      {pokemonInfo && generateForm()}
    </div>
  );
}

export default CreatePokemonMember;
