import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";
import axiosInstanceCommunitymon from "../../axiosConfigCommunitymon";
import { useUser } from "../../userContext";

function UpdateCommunitymon() {
  const [loading, setLoading] = useState(true);
  const [communitymon, setCommunitymon] = useState([]);
  const [idSelectedPokemon, setSelectedPokemon] = useState(0);
  const [pokemonForUpdate, setPokemonForUpdate] = useState(null);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const { verify, user } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sprite, setSprite] = useState("");
  const [specie, setSpecie] = useState("");

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

  function restartForm() {
    setName("");
    setDescription("");
    setType1("");
    setType2("");
    setHeight("");
    setWeight("");
    setSprite("");
    setSpecie("");
    setSelectedPokemon(0);
    setPokemonForUpdate(null);
  }

  const types = [
    "steel",
    "water",
    "bug",
    "dragon",
    "electric",
    "ghost",
    "fire",
    "fairy",
    "ice",
    "fighting",
    "normal",
    "grass",
    "psychic",
    "rock",
    "dark",
    "ground",
    "poison",
    "flying",
  ];

  useEffect(() => {
    if (!verify()) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [verify, user, navigate]);

  const handleSelectPokemon = (e) => {
    const idPokemon = Number(e.target.value);
    setSelectedPokemon(idPokemon);
    const selected = communitymon.find((pokemon) => pokemon.id === idPokemon);
    setPokemonForUpdate(selected || null);
  };

  const handleUpdatePokemon = async (event) => {
    event.preventDefault();
    if (!pokemonForUpdate) return;

    const updatedCommunitymon = {
      id_community_pokemon: pokemonForUpdate.id,
      name: name.trim() || pokemonForUpdate.name,
      type1:
        type1.charAt(0).toUpperCase() + type1.slice(1).toLowerCase() ||
        pokemonForUpdate.type1.charAt(0).toUpperCase() +
          pokemonForUpdate.type1.slice(1).toLowerCase(),
      type2:
        type2.charAt(0).toUpperCase() + type2.slice(1).toLowerCase() ||
        pokemonForUpdate.type2.charAt(0).toUpperCase() +
          pokemonForUpdate.type2.slice(1).toLowerCase(),
      description: description.trim() || pokemonForUpdate.description,
      specie: specie.trim() || pokemonForUpdate.specie,
      height: parseFloat(height) || pokemonForUpdate.height,
      weight: parseFloat(weight) || pokemonForUpdate.weight,
      sprite: sprite.trim() || pokemonForUpdate.sprite,
    };

    if (!updatedCommunitymon.name) return alert(t("name_required"));
    if (
      !updatedCommunitymon.description ||
      updatedCommunitymon.description.length < 10
    )
      return alert(t("description_min_length"));
    if (!updatedCommunitymon.specie || updatedCommunitymon.specie.length < 3)
      return alert(t("specie_min_length"));
    if (updatedCommunitymon.height <= 0 || updatedCommunitymon.height > 100)
      return alert(t("height_invalid"));
    if (updatedCommunitymon.weight <= 0 || updatedCommunitymon.weight > 1000)
      return alert(t("weight_invalid"));
    if (!/^https?:\/\/.+/i.test(updatedCommunitymon.sprite))
      return alert(t("sprite_invalid"));

    try {
      let response = await axiosInstanceCommunitymon.post("/update", {
        communitymon: updatedCommunitymon,
      });

      if (response.data) {
        restartForm();
        await fetchData();
        alert("ok");
      }
    } catch (error) {
      alert(t("error_update"));
      console.error(error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <h1>{t(error)}</h1>;

  return (
    <>
      <h1>{t("update_title")}</h1>
      <form>
        <div>
          <label htmlFor="formTypes">{t("choose_pokemon_update")}</label>
          <select
            id="formTypes"
            onChange={handleSelectPokemon}
            value={idSelectedPokemon}
          >
            <option value={0}>{t("selectPokemon")}</option>
            {communitymon.map((pokemon) => (
              <option key={pokemon.id} value={pokemon.id}>
                {pokemon.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      {pokemonForUpdate && (
        <form onSubmit={handleUpdatePokemon}>
          <label htmlFor="name">{t("name_label")}</label>
          <input
            type="text"
            placeholder={pokemonForUpdate.name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="specie">{t("specie_label")}</label>
          <input
            type="text"
            placeholder={pokemonForUpdate.specie}
            onChange={(e) => setSpecie(e.target.value)}
          />

          <label htmlFor="description">{t("description_label")}</label>
          <textarea
            placeholder={pokemonForUpdate.description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="type1">{t("type1_label")}</label>
          <select
            id="formTypes"
            value={type1 || types.at(types.indexOf(pokemonForUpdate.type1.toLowerCase()))}
            onChange={(e) => setType1(e.target.value)}
          >
            <option value="">{t("select_type")}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {t(type)}
              </option>
            ))}
          </select>

          <label htmlFor="type2">{t("type2_label")}</label>
          <select
            id="formTypes"
            value={type2 || types.at(types.indexOf(pokemonForUpdate.type2.toLowerCase()))}
            onChange={(e) => setType2(e.target.value)}
          >
            <option value="">{t("select_type")}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {t(type)}
              </option>
            ))}
          </select>

          <label htmlFor="height">{t("height_label")}</label>
          <input
            type="number"
            placeholder={pokemonForUpdate.height}
            onChange={(e) => setHeight(e.target.value)}
          />

          <label htmlFor="weight">{t("weight_label")}</label>
          <input
            type="number"
            placeholder={pokemonForUpdate.weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <label htmlFor="sprite">{t("sprite_label")}</label>
          <input
            type="url"
            placeholder={pokemonForUpdate.sprite}
            onChange={(e) => setSprite(e.target.value)}
          />

          <button type="submit">{t("submit_button_update")}</button>
        </form>
      )}
    </>
  );
}

export default UpdateCommunitymon;
