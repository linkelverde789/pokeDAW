const axios = require('axios');
const {
  pokeplay_guess,
  pokeplay_entry,
  pokeplay_pokemondle
} = require("../models/pokeplayModel");

async function getPokemonGuess(req, res) {
  const randomNumber = Math.floor(Math.random() * 1025) + 1;
  let data = await pokeplay_guess(randomNumber);
  if (!data) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumber}`);
      return res.json({
        id: response.data.id,
        name: response.data.species.name
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching from PokeAPI', error: error.message });
    }
  }

  return res.json({ id: randomNumber, name: data.name });
}
async function getPokemonEntry(req, res) {
  const randomNumber = Math.floor(Math.random() * 1025) + 1;
  let data = await pokeplay_entry(randomNumber);

  return res.json({
    id: randomNumber, name: data.name, text: {
      es: data.description_es,
      en: data.description_en,
    }
  });

}

async function getPokemondle(req, res) {
  let {id_pokemon} = req.body;

  if (!id_pokemon||id_pokemon < 1 || id_pokemon > 1025) {
    id_pokemon = 1;
  }

  let data = await pokeplay_pokemondle(id_pokemon);


  if(!data){
    return res.json({error: 'No pokemon'});
  }

  return res.json({
    id: id_pokemon,
    name: data.name,
    type1: data.type1,
    type2: data.type2,
    colour: data.colour,
    height: data.height,
    weight: data.weight,
    generation: data.generation,
    can_evolve: data.can_evolve,
    evolution_state: data.evolution_state,
  });
}

module.exports = { getPokemonGuess, getPokemonEntry, getPokemondle };
