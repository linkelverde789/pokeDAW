const db = require("../config/db");

async function insertFavouritePokemon(id_user, id_pokemon) {
    try {
      return await db.query('insert into favourite_pokemon(id_user, id_pokemon) values ($1, $2)', [id_user, id_pokemon]);
    } catch (error) {
      return null;
    }
  }
  
  async function insertCapturedPokemon(id_user, id_pokemon) {
    try {
      return await db.query('insert into catched_pokemon(id_user, id_pokemon) values ($1, $2)', [id_user, id_pokemon]);
    } catch (error) {
      return null;
    }
  }
  
  async function getCatchedPokemon(id_user, id_pokemon) {
    try {
      return await db.oneOrNone('select id_pokemon from catched_pokemon where id_user=$1 and id_pokemon=$2', [id_user, id_pokemon]);
    } catch (error) {
      return null;
    }
  }
  async function getFavouritePokemon(id_user, id_pokemon) {
    try {
      return await db.oneOrNone('select id_pokemon from favourite_pokemon where id_user=$1 and id_pokemon=$2', [id_user, id_pokemon]);
    } catch (error) {
      return null;
    }
  
  }
  
  async function getAllFavouritePokemon(id_user) {
    try {
      return await db.manyOrNone('select * from view_favourites where id_user = $1', [id_user]);
    } catch (error) {
      return null;
    }
  }
  
  async function getAllCatchedPokemon(id_user) {
    try {
      return await db.manyOrNone('select * from view_catched where id_user = $1', [id_user]);
    } catch (error) {
      return null;
    }
  }


  module.exports = {
    insertCapturedPokemon,
    insertFavouritePokemon,
    getCatchedPokemon,
    getFavouritePokemon,
    getAllCatchedPokemon,
    getAllFavouritePokemon,
  };