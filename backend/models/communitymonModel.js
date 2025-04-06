const db = require("../config/db");

async function insertCommunity(communitymon) {
    try {
      return await db.query('insert into community_pokemon (name, type1, type2, description, specie, height,weight, id_user, sprite) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [communitymon.name,
        communitymon.type1,
        communitymon.type2,
        communitymon.description,
        communitymon.specie,
        communitymon.height,
        communitymon.weight,
        communitymon.id_user,
        communitymon.sprite]);
    } catch (error) {
      return null;
    }
  }
  
  async function getAllCommunitymon() {
    try {
      return await db.manyOrNone('select * from communitydex_general order by id_community_pokemon');
    } catch (error) { return null; }
  }
  
  async function getOneCommunitymon(id_communitymon) {
    try {
      return await db.oneOrNone('select * from communitydex_global where id_community_pokemon=$1', [id_communitymon]);
    } catch (error) { return null; }
  }
  
  async function updateCommunitymon(communitymon) {
    try {
      return await db.query('update community_pokemon set name=$1, specie=$2, type1=$3, type2=$4, description=$5, height=$6, weight=$7, sprite=$8 where id_community_pokemon=$9 returning *',
        [communitymon.name,
        communitymon.specie,
        communitymon.type1,
        communitymon.type2,
        communitymon.description,
        communitymon.height,
        communitymon.weight,
        communitymon.sprite,
        communitymon.id_community_pokemon]);
    } catch (error) { return error; }
  }
  
  async function deleteCommunitymonDatabase(id_community_pokemon) {
    try {
      return await db.query('delete from community_pokemon where id_community_pokemon=$1', [id_community_pokemon]);
    } catch (error) { return error; }
  }
  
  async function getCommunitymonUser(id_user) {
    try {
      return await db.manyOrNone('select * from community_pokemon where id_user=$1 order by id_community_pokemon ', [id_user]);
    } catch (error) {
      return null;
    }
  }


  module.exports = {
    insertCommunity,
    getAllCommunitymon,
    getOneCommunitymon,
    updateCommunitymon,
    deleteCommunitymonDatabase,
    getCommunitymonUser,
  };