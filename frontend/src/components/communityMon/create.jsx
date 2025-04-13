import { useEffect, useState } from "react";
import { useUser } from "../../userContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosInstanceCommunitymon from "../../axiosConfigs/axiosConfigCommunitymon";

function CreateCommunityMon() {
  const { t } = useTranslation();
  const navigate=useNavigate();
  const { user, verify } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sprite, setSprite] = useState("");
  const [specie, setSpecie] = useState("");

useEffect(()=>{
  if(!verify()){
    navigate('/login');
    return;
  }
},[])

  const types = [
    { key: "steel", es: "Acero", en: "Steel" },
    { key: "water", es: "Agua", en: "Water" },
    { key: "bug", es: "Bicho", en: "Bug" },
    { key: "dragon", es: "Dragón", en: "Dragon" },
    { key: "electric", es: "Eléctrico", en: "Electric" },
    { key: "ghost", es: "Fantasma", en: "Ghost" },
    { key: "fire", es: "Fuego", en: "Fire" },
    { key: "fairy", es: "Hada", en: "Fairy" },
    { key: "ice", es: "Hielo", en: "Ice" },
    { key: "fighting", es: "Lucha", en: "Fighting" },
    { key: "normal", es: "Normal", en: "Normal" },
    { key: "grass", es: "Planta", en: "Grass" },
    { key: "psychic", es: "Psíquico", en: "Psychic" },
    { key: "rock", es: "Roca", en: "Rock" },
    { key: "dark", es: "Siniestro", en: "Dark" },
    { key: "ground", es: "Tierra", en: "Ground" },
    { key: "poison", es: "Veneno", en: "Poison" },
    { key: "flying", es: "Volador", en: "Flying" },
  ];

  function restartForm() {
    alert(t("pokemon_created"));
    setName("");
    setDescription("");
    setType1("");
    setType2("");
    setHeight("");
    setWeight("");
    setSprite("");
    setSpecie("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || name.trim() === "") {
      alert(t("name_required"));
      return;
    }

    if (!description || description.trim().length < 10) {
      alert(t("description_min_length"));
      return;
    }

    if (!specie || specie.trim().length < 3) {
      alert(t("specie_min_length"));
      return;
    }

    if (type1 === type2 || type2 === "") {
      setType2(null);
    }

    if (height <= 0 || height > 100) {
      alert(t("height_invalid"));
      return;
    }

    if (weight <= 0 || weight > 1000) {
      alert(t("weight_invalid"));
      return;
    }

    const spriteRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    if (!sprite || !spriteRegex.test(sprite)) {
      alert(t("sprite_invalid"));
      return;
    }

    let communitymon = {
      name: name,
      description: description,
      type1: type1.charAt(0).toUpperCase() + type1.slice(1).toLowerCase(),
      type2: type2
        ? type2.charAt(0).toUpperCase() + type2.slice(1).toLowerCase()
        : null,
      height: height,
      weight: weight,
      sprite: sprite,
      id_user: user.id,
      specie: specie,
      // specie: specie.toLowerCase().include('pokémon') || specie.toLowerCase().include('pokemon') ? specie : 'Pokémon' + specie,
    };


    try {
      await axiosInstanceCommunitymon.post("create", {
        communitymon: communitymon,
      });
      restartForm();
    } catch (error) {
      alert(t("pokemon_creation_error"));
    }
  };

  return (
    <> <h1>{t('create_title')}</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">{t("name_label")}</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="specie">{t("specie_label")}</label>
        <input
          type="text"
          id="specie"
          value={specie}
          onChange={(e) => setSpecie(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description">{t("description_label")}</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="type1">{t("type1_label")}</label>
        <select
          id="formTypes"
          value={type1}
          onChange={(e) => setType1(e.target.value)}
        >
          <option value="" disabled>
            {t("select_type")}
          </option>
          {types.map((type) => (
            <option key={type.key} value={type.key}>
              {t(type.key)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="type2">{t("type2_label")}</label>
        <select
          id="formTypes"
          value={type2}
          onChange={(e) => setType2(e.target.value)}
        >
          <option value="" disabled>
            {t("select_type")}
          </option>
          {types.map((type) => (
            <option key={type.key} value={type.key}>
              {t(type.key)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="height">{t("height_label")}</label>
        <input
          type="number"
          id="height"
          value={height}
          step={0.01}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="weight">{t("weight_label")}</label>
        <input
          type="number"
          id="weight"
          value={weight}
          step={0.01}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="sprite">{t("sprite_label")}</label>
        <input
          type="url"
          id="sprite"
          value={sprite}
          onChange={(e) => setSprite(e.target.value)}
        />
      </div>

      <button type="submit">{t("submit_button_create")}</button>
    </form>

    </>
  );
}

export default CreateCommunityMon;
