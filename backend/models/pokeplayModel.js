const db = require("../config/db");

async function pokeplay_guess(randomNumber) {
    try {
      const result = await db.oneOrNone("SELECT * FROM pokeplay_guess WHERE id_pokemon=$1", [randomNumber]);
      return result;
    } catch (error) {
      return null;
    }
  }
  
  async function pokeplay_entry(randomNumber) {
    try {
      return await db.oneOrNone("select * from pokeplay_entry where id_pokemon=$1", [randomNumber]);
    } catch (error) {
      return null;
    }
  }

  async function pokeplay_pokemondle(id_pokemon) {
    try {
      let data = await db.oneOrNone('select * from pokeplay_pokemondle where id_pokemon=$1', [id_pokemon]);
      return data;
    } catch (error) { 
      return null;
    }
  }

  module.exports = {
    pokeplay_guess,
    pokeplay_entry,
    pokeplay_pokemondle,
  };