const {
    insertPokemonMember,
    getPokememberMoves,
    getAllPokemonTeam,
    createTeam,
    getTeamsByUser
} = require("../models/poketeamModel");

async function createPokemonMember(req, res) {
    const { newPokemember } = req.body;

    try {
        let response = await insertPokemonMember(newPokemember);
        if (!response) {
            return res.json({ error: 'Error' });
        }
        return res.json({ ok: 'ok', value: newPokemember });
    } catch (error) {
        res.json({ error: error.message });
    }
}

async function createPokemonTeam(req, res) {
    const { team_name, id_user, pokemon_members } = req.body;

    try {
        if (!team_name || !id_user || !pokemon_members || !Array.isArray(pokemon_members)) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        const teamId = await createTeam({
            team_name,
            id_user,
            pokemon_members
        });

        if (!teamId) {
            return res.status(500).json({ error: 'Error al crear el equipo' });
        }

        return res.json({ 
            message: 'Equipo creado exitosamente',
            team_id: teamId
        });
    } catch (error) {
        console.error('Error en createPokemonTeam:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function updatePokemonMember(req, res) {
    const { newPokemember } = req.body;

    try {
        let response = await updatePokemember(newPokemember);

        if (!response) {
            return res.json({ error: 'Error' });

        }
        return res.json({ ok: 'ok' });

    } catch (error) {
        res.json({ error: error.message });

    }
}

async function deletePokemonMember(req, res) {
    const { id_pokemember } = req.body;

    try {
        let response = await deletePokemember(id_pokemember);

        if (!response) {
            return res.json({ error: 'Error' });

        }
        return res.json({ ok: 'ok' });

    } catch (error) {
        res.json({ error: error.message });

    }
}

// async function readOnePokemonTeam(req, res) {
//     const { id_pokemember } = req.body;
//     try {
//         let response = await readOnePokemember(id_pokemember);

//         if (!response) {
//             return res.json({ error: 'Error' });

//         }

//     } catch (error) {
//         res.json({ error: error.message });

//     }
// }

async function obtainMovesPokemember(id_pokemon_member) {
    let moves = await getPokememberMoves(id_pokemon_member);
    if(!moves){
        throw Error("No moves");
    }

    if (moves.length == 1) {
        return [
            {
                text: {
                    es: {
                        name: moves.move_name_es,
                        description: moves.move_description_es,
                    },
                    en: {
                        name: moves.move_name_en,
                        description: moves.move_description_en,
                    }
                },
                accuracy: moves.accuracy,
                power: moves.power,
                type: moves.move_type,
                category: moves.category
            }
        ]
    }


    return moves.map(move=>{
        return {
            text: {
                es: {
                    name: move.move_name_es,
                    description: move.move_description_es,
                },
                en: {
                    name: move.move_name_en,
                    description: move.move_description_en,
                }
            },
            accuracy: move.accuracy,
            power: move.power,
            type: move.move_type,
            category: move.category
        }
    }
)

}

async function readAllPokemonTeam(req, res) {
    const { id_user } = req.body;

    try {
        let response = await getAllPokemonTeam(id_user)
        if (!response) {
            throw Error("Error")
        }

        
        if (response.length == 1) {
            let moves = await obtainMovesPokemember(response.id_pokemon_member)
            return res.json({
                name: response.pokemon_member_name,
                id_pokemon: response.id_pokemon,
                nature: response.nature,
                item: {
                    text: {
                        es: {
                            name: response.item_name_es,
                            description: response.item_description_es,
                        },
                        en: {
                            name: response.item_name_en,
                            description: response.item_description_en,
                        }
                    }
                },
                level: response.level,
                ability: {
                    text: {
                        es: {
                            name: response.ability_name_es,
                            description: response.ability_description_es,
                        },
                        es: {
                            name: response.ability_name_en,
                            description: response.ability_description_en,
                        },
                    }
                },
                stats: {
                    "hp": {
                        ev: response.hp_ev,
                        iv: response.hp_iv,
                    },
                    "attack": {
                        ev: response.attack_ev,
                        iv: response.attack_iv,
                    },
                    "defense": {
                        ev: response.defense_ev,
                        iv: response.defense_iv,
                    },
                    "special_attack": {
                        ev: response.special_attack_ev,
                        iv: response.special_attack_iv,
                    },
                    "special_defense": {
                        ev: response.special_defense_ev,
                        iv: response.special_defense_iv,
                    },
                    "speed": {
                        ev: response.speed_ev,
                        iv: response.speed_iv,
                    },
                },
                moves: moves,
            })
        }

        let movesPepe = {};
        for (let item of response) {
            movesPepe[item.id_pokemon_member] = await obtainMovesPokemember(item.id_pokemon_member);
        }

        const result = response.map((item) => {
            return {
                name: item.pokemon_member_name,
                base_pokemon: item.id_pokemon,
                id_team_member: item.id_pokemon_member,
                nature: item.nature,
                item: {
                    text: {
                        es: {
                            name: item.item_name_es,
                            description: item.item_description_es,
                        },
                        en: {
                            name: item.item_name_en,
                            description: item.item_description_en,
                        }
                    }
                },
                level: item.level,
                ability: {
                    text: {
                        es: {
                            name: item.ability_name_es,
                            description: item.ability_description_es,
                        },
                        en: {
                            name: item.ability_name_en,
                            description: item.ability_description_en,
                        },
                    }
                },
                stats: {
                    "hp": {
                        ev: item.hp_ev,
                        iv: item.hp_iv,
                    },
                    "attack": {
                        ev: item.attack_ev,
                        iv: item.attack_iv,
                    },
                    "defense": {
                        ev: item.defense_ev,
                        iv: item.defense_iv,
                    },
                    "special_attack": {
                        ev: item.special_attack_ev,
                        iv: item.special_attack_iv,
                    },
                    "special_defense": {
                        ev: item.special_defense_ev,
                        iv: item.special_defense_iv,
                    },
                    "speed": {
                        ev: item.speed_ev,
                        iv: item.speed_iv,
                    },
                },
                moves: movesPepe[item.id_pokemon_member],
            }
        });

        return res.json(result);
        
    } catch (error) {
        return res.json({ error: error.message })
    }
}

async function getTeams(req, res) {
    const { id_user } = req.body;

    try {
        if (!id_user) {
            return res.status(400).json({ error: 'Se requiere el ID del usuario' });
        }

        const teams = await getTeamsByUser(id_user);
        
        if (!teams) {
            return res.status(404).json({ error: 'No se encontraron equipos para este usuario' });
        }


        let finalTeam = teams.reduce((acc, team) => {
            let existingTeam = acc.find(t => t.id_team === team.id_team);
            
            if (!existingTeam) {
                existingTeam = {
                    team_name: team.team_name,
                    id_team: team.id_team,
                    members: []
                };
                acc.push(existingTeam);
            }
            existingTeam.members.push({
                position: team.position,
                name: team.name,
                id_pokemon: team.id_pokemon,
                id_pokemon_member: team.id_pokemon_member,
            });
        
            return acc;
        }, []);

        finalTeam = finalTeam.map(team => ({
            ...team,
            members: team.members.map(member => ({
                ...member
            }))
        }));

        
        
        return res.json(finalTeam);
    } catch (error) {
        console.error('Error en getTeams:', error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { 
    createPokemonMember, 
    updatePokemonMember, 
    deletePokemonMember, 
    readAllPokemonTeam,
    createPokemonTeam,
    getTeams
};