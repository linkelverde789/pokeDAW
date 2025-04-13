import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import axiosInstance from '../axiosConfigs/axiosConfigAPI';

function FullPokemonSelect({onChange}) {
  const [allPokemon, setAllPokemon] = useState([]);
    const { t } = useTranslation();
  
  async function loadPokemon() {
    try {
      let response = await axiosInstance.get("/pokedex/all");
      setAllPokemon(response.data);
    } catch (error) {
      console.error("Error loading Pokémon names:", error);
    }
  }

  useEffect(() => {
    loadPokemon();
  }, []);

  return (
          <Select
            id="guessUser"
            name="guessUser"
            className="pokemon-select"
            classNamePrefix="react-select"
            options={allPokemon.map((pokemon) => ({
              value: pokemon,
              label: pokemon.name,
            }))}
            onChange={onChange}
            placeholder={t("choose_pokemon")}
          />
  );
}


export default FullPokemonSelect;