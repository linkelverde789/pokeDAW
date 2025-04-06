const db = require("../config/db");

async function insertPokemonMember(newPokemember) {
    try {
        const result = await db.query(
            'INSERT INTO pokemon_member (id_pokemon,id_user, name, id_ability, nature, hp_ev, attack_ev, defense_ev, special_attack_ev, special_defense_ev, speed_ev, hp_iv, attack_iv, defense_iv, special_attack_iv, special_defense_iv, speed_iv, id_item, level) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *',
            [
                newPokemember.id_pokemon,
                newPokemember.id_user,
                newPokemember.name,
                newPokemember.id_ability,
                newPokemember.nature,
                ...newPokemember.evs,
                ...newPokemember.ivs,
                newPokemember.id_item,
                newPokemember.level,
            ]
        );

        const newPokemonMemberId = result[0].id_pokemon_member;

        for (let i = 0; i < newPokemember.moves.length; i++) {
            await db.query(
                'INSERT INTO pokemon_member_move (id_pokemon_member, id_move, position) VALUES ($1, $2, $3)',
                [newPokemonMemberId, newPokemember.moves[i], i + 1]
            );
        }

        return newPokemonMemberId;
    } catch (error) {
        console.error("Error inserting Pokémon member:", error);
        return null;
    }
}

async function createTeam(teamData) {
    try {
        // Primero insertamos el equipo
        const teamResult = await db.query(
            'INSERT INTO teams (name, user_id) VALUES ($1, $2) RETURNING id_team',
            [teamData.team_name, teamData.id_user]
        );

        if (!teamResult || !teamResult[0]) {
            throw new Error('Error al crear el equipo');
        }

        const teamId = teamResult[0].id_team;

        // Luego insertamos las relaciones con los Pokémon
        for (let i = 0; i < teamData.pokemon_members.length; i++) {
            await db.query(
                'INSERT INTO pokemon_team (id_pokemon_member, id_team, position) VALUES ($1, $2, $3)',
                [teamData.pokemon_members[i], teamId, i + 1]
            );
        }

        return teamId;
    } catch (error) {
        console.error("Error creating team:", error);
        return null;
    }
}

async function getAllPokemonTeam(id_user) {
    try {
        return await db.manyOrNone("select * from pokemon_member_stats where id_user = $1", [id_user]);
    } catch (error) {
        return null;
    }
}

async function getPokememberMoves(id_pokemon_member) {
    try{
        return await db.manyOrNone("select * from pokemon_member_moves where id_pokemon_member=$1 order by move_position asc", [id_pokemon_member])
    }catch(error){
        return null;
    }
}

async function getTeamsByUser(id_user) {
    try {
        return await db.manyOrNone(
            'select * from pokemon_team_members where user_id=$1 order by id_team asc, position asc',
            [id_user]
        );
    } catch (error) {
        console.error("Error getting teams:", error);
        return null;
    }
}

module.exports = {
    insertPokemonMember,
    getPokememberMoves,
    getAllPokemonTeam,
    createTeam,
    getTeamsByUser
};
