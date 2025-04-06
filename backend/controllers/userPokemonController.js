const { insertFavouritePokemon,
    insertCapturedPokemon,
    getCatchedPokemon,
    getFavouritePokemon,
    getAllCatchedPokemon,
    getAllFavouritePokemon } = require("../models/userPokemonModel");

async function addFavPokemon(req, res) {
    const { id_user, id_pokemon } = req.body;


    try {
        insertFavouritePokemon(id_user, id_pokemon);
        res.json(true);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

async function addCapturedPokemon(req, res) {
    const { id_user, id_pokemon } = req.body;

    try {
        insertCapturedPokemon(id_user, id_pokemon);
        res.json(true);
    } catch (error) {
        res.status(500).json({ error: error });
    }

}

async function getInfo(req, res) {
    const { id_user, id_pokemon } = req.body;

    if (!id_user || !id_pokemon) {
        return;
    }

    let favourite = await getFavouritePokemon(id_user, id_pokemon);
    let catched = await getCatchedPokemon(id_user, id_pokemon);

    favourite = favourite ? favourite.id_pokemon == id_pokemon : false;
    catched = catched ? catched.id_pokemon == id_pokemon : false;

    return res.json({ fav: favourite, catched: catched })
}

async function catchedPokemon(req, res){
const {id_user}=req.body;
if(!id_user){
    res.status(500).json({message: 'no id?'});
    return;
}

const response=await getAllCatchedPokemon(id_user);

if(!response){
    return res.json({many: false});
}

return res.json({pokemons: response.map(pokemon=>{
    return {
        id: pokemon.id_pokemon,
        name: pokemon.name,
        type1: pokemon.type1,
        type2: pokemon.type2,
    }
}), many: true})

}

async function favouritesPokemon(req, res){
    const {id_user}=req.body;
    if(!id_user){
        res.status(500).json({message: 'no id?'});
    }

    const response=await getAllFavouritePokemon(id_user);

    if(!response){
        res.status(500).json({message: 'Can`t load pokemons'});
    }

    if(response.length==0){
        return res.json({many: false});
    }


    return res.json({pokemons: response.map(pokemon=>{
        return {
            id: pokemon.id_pokemon,
            name: pokemon.name,
            type1: pokemon.type1,
            type2: pokemon.type2,
        }
    }), many: true})

    }


module.exports = { addFavPokemon, addCapturedPokemon, getInfo, catchedPokemon, favouritesPokemon };
