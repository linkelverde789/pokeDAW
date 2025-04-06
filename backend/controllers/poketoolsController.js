const axios = require('axios');
const { calculator } = require("../models/poketoolsModel");
async function pokeapi() {
  try {
    const URL = 'https://pokeapi.co/api/v2/pokemon/';
    const batchSize = 41;
    const result = [];

    for (let i = 1; i < 1025; i += batchSize) {
      const batchRequests = Array.from({ length: batchSize }, (_, j) =>
        axios.get(`${URL}${i + j}`)
          .then((res) => res.data)
          .catch((err) => {
            console.error(`Error fetching Pokémon #${i + j}:`, err);
            return null;
          })
      );

      const batchResults = await Promise.all(batchRequests);
      const filteredResults = batchResults.filter((data) => data !== null);

      result.push(...filteredResults);
    }

    return result;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    return null;
  }
}

async function getPokemonCalculator(req, res) {
  const data = await calculator();

  if (!data) {
    const statName = {
      attack: 'Ataque',
      defense: 'Defensa',
      hp: 'PS',
      speed: 'Velocidad',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
    };

    let filteredResults = await pokeapi();
    const batchData = filteredResults.map((data) => ({
      value: data.species.name,
      label:
        data.species.name.charAt(0).toUpperCase() +
        data.species.name.slice(1),
      id: data.id,
      stats: data.stats.map((stat) => ({
        name: statName[stat.stat.name],
        base_stat: stat.base_stat,
      })),
    }));
    return res.json(batchData);
  }

  return res.json(data.map(pokemon => {
    return {
      id: pokemon.id_pokemon,
      label: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase(),
      value: pokemon.name.toLowerCase(),
      stats: [
        { name: 'PS', base_stat: pokemon.base_hp },
        { name: 'Ataque', base_stat: pokemon.base_attack },
        { name: 'Defensa', base_stat: pokemon.base_defense },
        { name: 'Ataque Especial', base_stat: pokemon.base_special_attack },
        { name: 'Defensa Especial', base_stat: pokemon.base_special_defense },
        { name: 'Velocidad', base_stat: pokemon.base_speed },
      ],
    };
  }));
};



module.exports = { getPokemonCalculator};
