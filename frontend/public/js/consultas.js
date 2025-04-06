function obtenerID(url) {
    const id = url.split("/").filter(Boolean).pop();
    return id;
}

const TYPES = [
    'Steel', 'Water', 'Bug', 'Dragon', 'Electric', 'Ghost',
    'Fire', 'Fairy', 'Ice', 'Fighting', 'Normal',
    'Grass', 'Psychic', 'Rock', 'Dark', 'Ground',
    'Poison', 'Flying'
];
const output = document.getElementById("sql-output");

document.getElementById("fetch-pokemon").addEventListener("click", async () => {
    const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=1025";
    output.value = "Obteniendo datos...";

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const promises = data.results.map(p => fetch(p.url).then(res => res.json()));
        const pokemonData = await Promise.all(promises);

        let sqlStatement = "INSERT INTO pokemon (name, type1, type2, base_attack, base_special_attack, base_defense, base_special_defense, base_speed, base_hp) VALUES\n";
        const values = pokemonData.map(pokemon => {
            const name = pokemon.species.name;
            const types = pokemon.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));
            const baseStats = pokemon.stats.reduce((acc, stat) => {
                acc[stat.stat.name] = stat.base_stat;
                return acc;
            }, {});

            const type1 = TYPES.includes(types[0]) ? `'${types[0]}'` : "NULL";
            const type2 = types[1] && TYPES.includes(types[1]) ? `'${types[1]}'` : "NULL";

            const baseAttack = baseStats.attack || 0;
            const baseSpecialAttack = baseStats["special-attack"] || 0;
            const baseDefense = baseStats.defense || 0;
            const baseSpecialDefense = baseStats["special-defense"] || 0;
            const baseSpeed = baseStats.speed || 0;
            const baseHp = baseStats.hp || 0;

            return `('${name}', ${type1}, ${type2}, ${baseAttack}, ${baseSpecialAttack}, ${baseDefense}, ${baseSpecialDefense}, ${baseSpeed}, ${baseHp})`;
        }).join(",\n");

        sqlStatement += values + ";";
        output.value = sqlStatement;
    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});

document.getElementById("fetch-abilities").addEventListener("click", async () => {
    const API_URL = "https://pokeapi.co/api/v2/ability?limit=307";
    output.value = "Obteniendo datos...";

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const promises = data.results.map(a => fetch(a.url).then(res => res.json()));
        const abilitiesData = await Promise.all(promises);

        let sqlStatement = "INSERT INTO abilities (name_es, name_en, description_en, description_es) VALUES\n";


        const values = abilitiesData.map(ability => {
            const nameEn = ability.name;
            const nameEs = ability.names.find(n => n.language.name === "es")?.name || nameEn;
            const descriptionEn = ability.flavor_text_entries.find(e => e.language.name === "en")?.flavor_text || "";
            const descriptionEs = ability.flavor_text_entries.find(e => e.language.name === "es")?.flavor_text || descriptionEn;

            return `('${nameEs}', '${nameEn}', '${descriptionEn.replace(/'/g, "''")}', '${descriptionEs.replace(/'/g, "''")}')`;
        }).join(",\n");

        sqlStatement += values + ";";
        output.value = sqlStatement;
    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});

document.getElementById("abilities-pokemon").addEventListener("click", async () => {
    const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=1025";

    output.value = "Obteniendo datos...";

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const idPromises = data.results.map(a => obtenerID(a.url));
        const dataPromises = data.results.map(a => fetch(a.url).then(res => res.json()));

        const ids = await Promise.all(idPromises);
        const pokemonData = await Promise.all(dataPromises);

        let sqlStatement = "INSERT INTO pokemon_abilities (id_pokemon, id_ability, type) VALUES\n";
        const values = pokemonData.map((pokemon, index) => {
            const pokemonId = ids[index];
            return pokemon.abilities.map(ability => {
                const abilityId = obtenerID(ability.ability.url);
                const abilityType = ability.is_hidden ? 'hidden' : 'primary';
                return `(${pokemonId}, ${abilityId}, '${abilityType}')`;
            }).join(",\n");
        }).filter(Boolean).join(",\n");

        sqlStatement += values + ";";
        output.value = sqlStatement;
    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});

document.getElementById("fetch-item").addEventListener('click', async () => {
    const API_URL = "https://pokeapi.co/api/v2/item";
    output.value = "Obteniendo datos...";
    const LIMIT = 100;
    let offset = 0;
    let allItems = [];

    try {
        const initialResponse = await fetch(`${API_URL}?limit=1`);
        const initialData = await initialResponse.json();
        const totalItems = initialData.count;

        while (offset < totalItems) {
            const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();
            const promises = data.results.map(a => fetch(a.url).then(res => res.json()));
            const items = await Promise.all(promises);
            allItems = allItems.concat(items);
            offset += LIMIT;
        }

        // Generar la consulta SQL
        let sqlStatement = "INSERT INTO ITEM (name_es, name_en, description_en, description_es, holdable) VALUES\n";
        const values = allItems.map(ability => {
            const nameEn = ability.names.find(n => n.language.name === "en")?.name || ability.name;
            const nameEs = ability.names.find(n => n.language.name === "es")?.name || nameEn;
            const descriptionEn = ability.flavor_text_entries.find(e => e.language.name === "en")?.text || "";
            const descriptionEs = ability.flavor_text_entries.find(e => e.language.name === "es")?.text || descriptionEn;
            const holdable = ability.attributes.some(e => e.name === "holdable");

            return `('${nameEs}', '${nameEn}', '${descriptionEn.replace(/'/g, "''")}', '${descriptionEs.replace(/'/g, "''")}', ${holdable})`;
        }).join(",\n");

        sqlStatement += values + ";";
        output.value = sqlStatement;
    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});

document.getElementById("fetch-move").addEventListener('click', async () => {
    const API_URL = "https://pokeapi.co/api/v2/move";
    output.value = "Obteniendo datos...";
    const LIMIT = 100;
    let offset = 0;
    let allItems = [];

    try {
        const initialResponse = await fetch(`${API_URL}?limit=1`);
        const initialData = await initialResponse.json();
        const totalItems = initialData.count;

        while (offset < totalItems) {
            const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();
            const promises = data.results.map(a => fetch(a.url).then(res => res.json()));
            const items = await Promise.all(promises);
            allItems = allItems.concat(items);
            offset += LIMIT;
        }

        const excludedDescriptions = [
            "This move can’t be used.\nIt’s recommended that this move is forgotten.\nOnce forgotten, this move can’t be remembered.",
            "Este movimiento no se puede usar, por lo que sería\nmejor olvidarlo, aunque eso implique que no se pueda\nrecordar posteriormente."
        ];

        // Generar la consulta SQL
        let sqlStatement = 'INSERT INTO move (name_es, name_en, description_es, description_en, accuracy, power, type, category) VALUES';
        const values = allItems.map(ability => {

            const nameEn = ability.names.find(n => n.language.name === "en")?.name || ability.name;
            const nameEs = ability.names.find(n => n.language.name === "es")?.name || nameEn;

            const flavorTextEntries = ability.flavor_text_entries;
            const getDescription = (language, game = null) => {
                const filteredEntries = flavorTextEntries.filter(entry =>
                    entry.language.name === language &&
                    (!game || entry.version_group.name === game) &&
                    !excludedDescriptions.includes(entry.flavor_text.trim())
                );
                return filteredEntries[0]?.flavor_text || "";
            };


            const descriptionEn = getDescription("en", "sword-shield") || getDescription("en");
            const descriptionEs = getDescription("es", "sword-shield") || getDescription("es") || descriptionEn;

            const accuracy = ability.accuracy || "NULL";
            const power = ability.power || "NULL";
            const type = ability.type.name;
            const category = ability.damage_class.name;

            return `('${nameEs}', '${nameEn}', '${descriptionEn.replace(/'/g, "''")}', '${descriptionEs.replace(/'/g, "''")}', ${accuracy}, ${power}, '${type}', '${category}')`;
        }).join(",\n");

        sqlStatement += values + ";";
        output.value = sqlStatement;
    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});


document.getElementById("level-move").addEventListener('click', async () => {
    output.value = "No";
    return; //quitar el return para que se ejecute la consulta

    const API_URL = "https://pokeapi.co/api/v2/move";
    output.value = "Obteniendo datos...";

    const LIMIT = 100;
    let offset = 0;
    let allMoves = [];

    const uniqueEntries = new Set();

    try {
        const initialResponse = await fetch(`${API_URL}?limit=1`);
        const initialData = await initialResponse.json();
        const totalMoves = initialData.count;

        while (offset < totalMoves) {
            const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();
            const promises = data.results.map(a => fetch(a.url).then(res => res.json()));
            const moves = await Promise.all(promises);
            allMoves = allMoves.concat(moves);
            offset += LIMIT;
        }

        let sqlStatement = 'INSERT INTO move_pokemon (id_move, id_pokemon) VALUES\n';
        const values = [];

        for (const move of allMoves) {
            const moveId = move.id; // ID del movimiento

            for (const pokemon of move.learned_by_pokemon) {
                const pokemonResponse = await fetch(pokemon.url);
                const pokemonData = await pokemonResponse.json();
                const pokemonId = pokemonData.id; // ID del Pokémon

                // Saltar Pokémon con ID superior a 1025
                if (pokemonId > 1025) {
                    continue;
                }

                const entryKey = `${moveId}-${pokemonId}`;
                console.log(`${moveId}-${pokemonId}`);

                // Verificar si ya se registró esta combinación
                if (!uniqueEntries.has(entryKey)) {
                    uniqueEntries.add(entryKey);
                    console.log(`(${moveId}, ${pokemonId})`);
                    values.push(`(${moveId}, ${pokemonId})`);
                }
            }
        }

        sqlStatement += values.join(",\n") + ";";
        output.value = sqlStatement;

    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});


document.getElementById("fetch-generation").addEventListener('click', async () => {
    const API_URL = "https://pokeapi.co/api/v2/version-group/";
    output.value = "Obteniendo datos...";
    const LIMIT = 100;
    let offset = 0;
    let allItems = [];

    const traducciones = {
        "red": "Rojo",
        "blue": "Azul",
        "yellow": "Amarillo",
        "gold": "Oro",
        "silver": "Plata",
        "crystal": "Cristal",
        "ruby": "Rubí",
        "sapphire": "Zafiro",
        "emerald": "Esmeralda",
        "firered": "Rojo Fuego",
        "leafgreen": "Verde Hoja",
        "diamond": "Diamante",
        "pearl": "Perla",
        "platinum": "Platino",
        "heartgold": "Oro Heartgold",
        "soulsilver": "Plata SoulSilver",
        "black": "Negro",
        "white": "Blanco",
        "colosseum": "Coliseo",
        "xd": "XD",
        "black-2": "Negro 2",
        "white-2": "Blanco 2",
        "x": "X",
        "y": "Y",
        "omega-ruby": "Rubí Omega",
        "alpha-sapphire": "Zafiro Alfa",
        "sun": "Sol",
        "moon": "Luna",
        "ultra-sun": "Ultrasol",
        "ultra-moon": "Ultraluna",
        "lets-go-pikachu": "Lets Go Pikachu",
        "lets-go-eevee": "Lets Go Eevee",
        "sword": "Espada",
        "shield": "Escudo",
        "the-isle-of-armor": "La Isla de la Armadura",
        "the-crown-tundra": "La Corona Nevada",
        "brilliant-diamond": "Diamante Brillante",
        "shining-pearl": "Perla Reluciente",
        "legends-arceus": "Leyendas: Arceus",
        "scarlet": "Escarlata",
        "violet": "Púrpura",
        "the-teal-mask": "La Máscara Turquesa",
        "the-indigo-disk": "El Disco Índigo"
    };

    const limpiarNombre = (nombre) => {
        return nombre.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
    };

    const traducir = (nombre) => {
        return traducciones[nombre] || limpiarNombre(nombre);
    };

    try {
        const initialResponse = await fetch(`${API_URL}?limit=1`);
        const initialData = await initialResponse.json();
        const totalItems = initialData.count;

        while (offset < totalItems) {
            const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();
            const promises = data.results.map(a => fetch(a.url).then(res => res.json()));
            const items = await Promise.all(promises);
            allItems = allItems.concat(items);
            offset += LIMIT;
        }

        let sqlStatement = 'INSERT INTO versions (name_es, name_en, generation) VALUES\n';
        const values = allItems.flatMap(ability => {
            const generation = obtenerID(ability.generation.url);


            return ability.versions.map(version =>
                `('${traducir(version.name)}', '${limpiarNombre(version.name)}', ${generation})`
            );
        }).join(",\n");

        sqlStatement += values + ";";
        output.value = sqlStatement;
    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});

async function obtenerDatosPokemon(id) {
    const URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const datoEnBruto = await fetch(URL);
    return datoEnBruto.json();
}

async function obtenerGeneracion(id) {
    const URL = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const datoEnBruto = await fetch(URL);
    const data = await datoEnBruto.json();
    return data.generation.name; // Ejemplo: "generation-i"
}

async function obtenerEvolucion(pokemonName) {
    try {
        // Normaliza el nombre del Pokémon
        const normalizedName = pokemonName.toLowerCase();

        // Obtén la información básica del Pokémon
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${normalizedName}`);
        if (!pokemonResponse.ok) throw new Error(`Pokémon no encontrado en la cadena evolutiva: ${normalizedName}`);
        const pokemonData = await pokemonResponse.json();

        // Obtén la URL de la cadena evolutiva
        const evolutionChainUrl = pokemonData.evolution_chain.url;

        // Obtén la cadena evolutiva completa
        const evolutionResponse = await fetch(evolutionChainUrl);
        if (!evolutionResponse.ok) throw new Error("No se pudo obtener la cadena evolutiva");
        const evolutionData = await evolutionResponse.json();

        // Recorre la cadena evolutiva para determinar el estadio
        let stage = 1;
        let currentEvolution = evolutionData.chain;

        while (currentEvolution) {
            if (currentEvolution.species.name === normalizedName) {
                return stage;
            }
            currentEvolution = currentEvolution.evolves_to[0];
            stage++;
        }
        // throw new Error(`Pokémon no encontrado en la cadena evolutiva: ${normalizedName}`);
        return 1;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function canEvolvePokemon(pokemonName) {
    try {
        // Normaliza el nombre del Pokémon
        const normalizedName = pokemonName.toLowerCase();

        // Obtén la información básica del Pokémon
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${normalizedName}`);
        if (!pokemonResponse.ok) throw new Error(`Pokémon no encontrado en la cadena evolutiva: ${normalizedName}`);
        const pokemonData = await pokemonResponse.json();

        // Obtén la URL de la cadena evolutiva
        const evolutionChainUrl = pokemonData.evolution_chain.url;

        // Obtén la cadena evolutiva completa
        const evolutionResponse = await fetch(evolutionChainUrl);
        if (!evolutionResponse.ok) throw new Error("No se pudo obtener la cadena evolutiva");
        const evolutionData = await evolutionResponse.json();

        // Recorre la cadena evolutiva para verificar si puede evolucionar
        let currentEvolution = evolutionData.chain;

        while (currentEvolution) {
            if (currentEvolution.species.name === normalizedName) {
                return currentEvolution.evolves_to.length > 0;
            }
            currentEvolution = currentEvolution.evolves_to[0];
        }

        // throw new Error(`Pokémon no encontrado en la cadena evolutiva: ${normalizedName}`);
        return false;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

document.getElementById("fetch-basic").addEventListener('click', async () => {
    const API_URL = "https://pokeapi.co/api/v2/pokemon-species/";
    output.value = "Obteniendo datos...";
    const LIMIT = 100;
    let offset = 0;
    let allItems = [];

    try {
        const initialResponse = await fetch(`${API_URL}?limit=1`);
        const initialData = await initialResponse.json();
        const totalMoves = initialData.count;

        // Recolectar todos los datos
        while (offset < totalMoves) {
            const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();
            const promises = data.results.map(a => fetch(a.url).then(res => res.json()));
            const species = await Promise.all(promises);
            allItems = allItems.concat(species);
            offset += LIMIT;
        }

        let sqlStatement = 'INSERT INTO basic_information (id_pokemon, generation, specie_es, specie_en, height, weight, colour, evolution_state, can_evolve) VALUES\n';
        const values = [];

        for (const specie of allItems) {
            const id_pokemon = specie.id;

            const specieEn = specie.genera.find(name => name.language.name === "en")?.genus || specie.genera.genus;
            let specieEs = specie.genera.find(name => name.language.name === "es")?.genus || specie.genera.genus;

            if (specieEs == undefined) {
                specieEs = specieEn;
            }


            const generation = await obtenerGeneracion(id_pokemon);

            // Convertir la generación en un número
            let generationNumber;
            switch (generation) {
                case 'generation-i': generationNumber = 1; break;
                case 'generation-ii': generationNumber = 2; break;
                case 'generation-iii': generationNumber = 3; break;
                case 'generation-iv': generationNumber = 4; break;
                case 'generation-v': generationNumber = 5; break;
                case 'generation-vi': generationNumber = 6; break;
                case 'generation-vii': generationNumber = 7; break;
                case 'generation-viii': generationNumber = 8; break;
                case 'generation-ix': generationNumber = 9; break;
                default: generationNumber = 1; break;
            }

            const pokemonMomentario = await obtenerDatosPokemon(id_pokemon);
            const height = pokemonMomentario.height / 10;
            const weight = pokemonMomentario.weight / 10;


            const colour = specie.color.name;

            const evolutionState = await obtenerEvolucion(pokemonMomentario.species.name);

            const canEvolve = await canEvolvePokemon(pokemonMomentario.species.name);



            values.push(`(${id_pokemon}, ${generationNumber}, '${specieEs}', '${specieEn}', ${height}, ${weight}, '${colour}', ${evolutionState}, ${canEvolve})`);
            if (id_pokemon % 100 == 0) {
                console.log(`(${id_pokemon}, ${generationNumber}, '${specieEs}', '${specieEn}', ${height}, ${weight}, '${colour}', ${evolutionState}, ${canEvolve})`);
            }
            break;
        }

        sqlStatement += values.join(",\n") + ";";
        output.value = sqlStatement;

    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});


// document.getElementById("mamerto").addEventListener('click', async () => {
//     const API_URL = "https://pokeapi.co/api/v2/pokemon-species/";
//     output.value = "Obteniendo datos...";
//     const LIMIT = 100;
//     let offset = 0;
//     let allItems = [];

//     // Función auxiliar para obtener el ID del Pokémon al que evoluciona
//     async function obtenerNextEvolutionId(specie) {
//         try {
//             const evoChainUrl = specie.evolution_chain.url;
//             const evoResponse = await fetch(evoChainUrl);
//             const evoData = await evoResponse.json();
//             let nextEvolutionId = null;
//             function traverse(chain) {
//                 if (chain.species.name === specie.name) {
//                     if (chain.evolves_to.length > 0) {
//                         return obtenerID(chain.evolves_to[0].species.url);
//                     }
//                     return null;
//                 } else {
//                     for (const evo of chain.evolves_to) {
//                         const result = traverse(evo);
//                         if (result !== undefined) return result;
//                     }
//                 }
//             }
//             nextEvolutionId = traverse(evoData.chain);
//             return nextEvolutionId;
//         } catch (error) {
//             console.error("Error obteniendo la siguiente evolución:", error);
//             return null;
//         }
//     }

//     try {
//         const initialResponse = await fetch(`${API_URL}?limit=1`);
//         const initialData = await initialResponse.json();
//         const totalItems = initialData.count;

//         // Recolectar todos los datos de especies
//         while (offset < totalItems) {
//             const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
//             const data = await response.json();
//             const promises = data.results.map(a => fetch(a.url).then(res => res.json()));
//             const species = await Promise.all(promises);
//             allItems = allItems.concat(species);
//             offset += LIMIT;
//         }

//         let sqlStatement = 'INSERT INTO basic_information (id_pokemon, generation, specie_es, specie_en, height, weight, colour, evolution_state, can_evolve, next_evolution_id, description_en, description_es) VALUES\n';
//         const values = [];

//         let contador=0;
//         for (const specie of allItems) {
//             const id_pokemon = specie.id;

//             const specieEn = specie.genera.find(g => g.language.name === "en")?.genus || specie.genera.genus;
//             let specieEs = specie.genera.find(g => g.language.name === "es")?.genus || specie.genera.genus;
//             if (specieEs === undefined) {
//                 specieEs = specieEn;
//             }

//             const generation = await obtenerGeneracion(id_pokemon);
//             let generationNumber;
//             switch (generation) {
//                 case 'generation-i': generationNumber = 1; break;
//                 case 'generation-ii': generationNumber = 2; break;
//                 case 'generation-iii': generationNumber = 3; break;
//                 case 'generation-iv': generationNumber = 4; break;
//                 case 'generation-v': generationNumber = 5; break;
//                 case 'generation-vi': generationNumber = 6; break;
//                 case 'generation-vii': generationNumber = 7; break;
//                 case 'generation-viii': generationNumber = 8; break;
//                 case 'generation-ix': generationNumber = 9; break;
//                 default: generationNumber = 1; break;
//             }

//             const pokemonData = await obtenerDatosPokemon(id_pokemon);
//             const height = pokemonData.height / 10;
//             const weight = pokemonData.weight / 10;
//             const colour = specie.color.name;

//             const evolutionState = await obtenerEvolucion(pokemonData.species.name);
//             const canEvolve = await canEvolvePokemon(pokemonData.species.name);
//             const nextEvolutionId = await obtenerNextEvolutionId(specie);

//             const descriptionEn = (specie.flavor_text_entries.find(entry => entry.language.name === "en")?.flavor_text || "").replace(/[\n\f]/g, ' ');
//             const descriptionEs = (specie.flavor_text_entries.find(entry => entry.language.name === "es")?.flavor_text || descriptionEn).replace(/[\n\f]/g, ' ');

//             values.push(`(${id_pokemon}, ${generationNumber}, '${specieEs}', '${specieEn}', ${height}, ${weight}, '${colour}', ${evolutionState}, ${canEvolve}, ${nextEvolutionId !== null ? nextEvolutionId : "NULL"}, '${descriptionEn.replace(/'/g, "''")}', '${descriptionEs.replace(/'/g, "''")}')`);
//             if (id_pokemon % 100 === 0) {
//                 console.log(`Procesado Pokémon ID: ${id_pokemon}`);
//             }
//             if(contador==3){
//                 break;
//             }
//             contador++;
//         }

//         sqlStatement += values.join(",\n") + ";";
//         output.value = sqlStatement;
//     } catch (error) {
//         output.value = "Ocurrió un error al obtener los datos: " + error.message;
//     }
// });


document.getElementById("mamerto").addEventListener('click', async () => {
    const API_URL = "https://pokeapi.co/api/v2/pokemon-species/";
    output.value = "Obteniendo mamerto...";
    const LIMIT = 100;
    let offset = 0;
    let allItems = [];

    // Función auxiliar para obtener el ID del Pokémon al que evoluciona
    async function obtenerNextEvolutionId(specie) {
        try {
            const evoChainUrl = specie.evolution_chain.url;
            const evoResponse = await fetch(evoChainUrl);
            const evoData = await evoResponse.json();
            let nextEvolutionId = null;
            function traverse(chain) {
                if (chain.species.name === specie.name) {
                    if (chain.evolves_to.length > 0) {
                        return obtenerID(chain.evolves_to[0].species.url);
                    }
                    return null;
                } else {
                    for (const evo of chain.evolves_to) {
                        const result = traverse(evo);
                        if (result !== undefined) return result;
                    }
                }
            }
            nextEvolutionId = traverse(evoData.chain);
            return nextEvolutionId;
        } catch (error) {
            console.error("Error obteniendo la siguiente evolución:", error);
            return null;
        }
    }

    // Función auxiliar para obtener la primera descripción que no incluya el nombre del Pokémon.
    // Si no se encuentra, se retorna la primera descripción en ese idioma.
    function obtenerDescripcionSinNombre(entries, lang, pokemonName) {
        const lowerName = pokemonName.toLowerCase();
        let entry = entries.find(e => e.language.name === lang && !e.flavor_text.toLowerCase().includes(lowerName));
        if (!entry) {
            entry = entries.find(e => e.language.name === lang);
        }
        return entry ? entry.flavor_text.replace(/[\n\f]/g, ' ') : "";
    }

    try {
        const initialResponse = await fetch(`${API_URL}?limit=1`);
        const initialData = await initialResponse.json();
        const totalItems = initialData.count;

        // Recolectar todos los datos de especies
        while (offset < totalItems) {
            const response = await fetch(`${API_URL}?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();
            const promises = data.results.map(a => fetch(a.url).then(res => res.json()));
            const species = await Promise.all(promises);
            allItems = allItems.concat(species);
            offset += LIMIT;
        }

        let sqlStatement = 'INSERT INTO basic_information (id_pokemon, generation, specie_es, specie_en, height, weight, colour, evolution_state, can_evolve, next_evolution_id, description_en, description_es) VALUES\n';
        const values = [];

        for (const specie of allItems) {
            const id_pokemon = specie.id;

            const specieEn = specie.genera.find(g => g.language.name === "en")?.genus || specie.genera.genus;
            let specieEs = specie.genera.find(g => g.language.name === "es")?.genus || specie.genera.genus;
            if (specieEs === undefined) {
                specieEs = specieEn;
            }

            const generation = await obtenerGeneracion(id_pokemon);
            let generationNumber;
            switch (generation) {
                case 'generation-i': generationNumber = 1; break;
                case 'generation-ii': generationNumber = 2; break;
                case 'generation-iii': generationNumber = 3; break;
                case 'generation-iv': generationNumber = 4; break;
                case 'generation-v': generationNumber = 5; break;
                case 'generation-vi': generationNumber = 6; break;
                case 'generation-vii': generationNumber = 7; break;
                case 'generation-viii': generationNumber = 8; break;
                case 'generation-ix': generationNumber = 9; break;
                default: generationNumber = 1; break;
            }

            const pokemonData = await obtenerDatosPokemon(id_pokemon);
            const height = pokemonData.height / 10;
            const weight = pokemonData.weight / 10;
            const colour = specie.color.name;

            const evolutionState = await obtenerEvolucion(pokemonData.species.name);
            const canEvolve = await canEvolvePokemon(pokemonData.species.name);
            const nextEvolutionId = await obtenerNextEvolutionId(specie);

            const descriptionEn = obtenerDescripcionSinNombre(specie.flavor_text_entries, "en", specie.name);
            const descriptionEs = obtenerDescripcionSinNombre(specie.flavor_text_entries, "es", specie.name) || descriptionEn;

            values.push(`(${id_pokemon}, ${generationNumber}, '${specieEs}', '${specieEn}', ${height}, ${weight}, '${colour}', ${evolutionState}, ${canEvolve}, ${nextEvolutionId !== null ? nextEvolutionId : "NULL"}, '${descriptionEn.replace(/'/g, "''")}', '${descriptionEs.replace(/'/g, "''")}')`);
            if (id_pokemon % 100 === 0) {
                console.log(`Procesado Pokémon ID: ${id_pokemon}`);
            }
        }

        sqlStatement += values.join(",\n") + ";";
        output.value = sqlStatement;
    } catch (error) {
        output.value = "Ocurrió un error al obtener los datos: " + error.message;
    }
});