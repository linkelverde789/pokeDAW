const { insertCommunity,
    getAllCommunitymon,
    getOneCommunitymon,
    updateCommunitymon,
    deleteCommunitymonDatabase,
    getCommunitymonUser } = require("../models/communitymonModel");

async function create(req, res) {
    const { communitymon } = req.body;
    return res.json(await insertCommunity(communitymon));
}

async function readAll(req, res) {
    const result = await getAllCommunitymon();

    return res.json(result.map(pokemon => {
        return {
            id: pokemon.id_community_pokemon,
            name: pokemon.name,
            type1: pokemon.type1,
            type2: pokemon.type2,
            description: pokemon.description,
            height: pokemon.height,
            weight: pokemon.weight,
            sprite: pokemon.sprite,
            user: pokemon.user,
        }
    }));
}

async function readOne(req, res) {
    const { id_communitymon } = req.params;
    const pokemon = await getOneCommunitymon(id_communitymon);

    if (!pokemon) {
        return res.json({ error: "No Pokémon" });
    }

    return res.json({
        id: pokemon.id_community_pokemon,
        name: pokemon.name,
        type1: pokemon.type1,
        type2: pokemon.type2,
        description: pokemon.description,
        height: pokemon.height,
        weight: pokemon.weight,
        sprite: pokemon.sprite,
        user: pokemon.username,
    }
    );
}

async function update(req, res) {
    const { communitymon } = req.body;

    let response = await updateCommunitymon(communitymon);

    return res.json(response);
}

async function deleteCommunitymon(req, res) {
    const { id_communitymon } = req.body;

    let response = await deleteCommunitymonDatabase(id_communitymon);

    return res.json({ message: response });
}

async function readCommunitymonPerUser(req, res) {
    const { id_user } = req.body;

    let response = await getCommunitymonUser(id_user);

    if (!Array.isArray(response)) {
        return res.json({
            id: response.id_community_pokemon,
            name: response.name,
            type1: response.type1,
            type2: response.type2,
            sprite: response.sprite,
            description: response.description,
            height: response.height,
            weight: response.weight,
            specie: response.specie,
        })
    }


    return res.json(response.map(pokemon => {
        return {
            id: pokemon.id_community_pokemon,
            name: pokemon.name,
            type1: pokemon.type1,
            type2: pokemon.type2,
            sprite: pokemon.sprite,
            description: pokemon.description,
            height: pokemon.height,
            weight: pokemon.weight,
            specie: pokemon.specie,
        }
    }));
}


module.exports = {
    create,
    readAll,
    readOne,
    readCommunitymonPerUser,
    deleteCommunitymon,
    update
};
