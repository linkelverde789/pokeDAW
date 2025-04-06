import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";
import FullPokemonSelect from "../select";
function QUE() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonInfo, setPokemonInfo] = useState(null);

  function handleChangePokemon(event){
    setSelectedPokemon(event.target.value);
  }

  useEffect(fetchPokemonInfo(selectedPokemon), [selectedPokemon]);

  async function fetchPokemonInfo(id_pokemon){
    try{
        let pokemon= await axiosInstance.get(`/pokemon/${id_pokemon}`);
        setPokemonInfo(pokemon.data);
    }catch(error){console.error(error);}
  }


  return <>
  <FullPokemonSelect onChange={handleChangePokemon} />
  
  </>
}
export default QUE;
