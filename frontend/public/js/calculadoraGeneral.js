const pokemonData=[];
const checkNature = (natureName, stat) => {
    const nature = natures[natureName];
    if (nature?.increase === stat) return 1.1;
    if (nature?.decrease === stat) return 0.9;
    return 1;
};

const handleCalculation = () => {
    const selectedPokemon = $('#pokemon-select').val();
    const pokemonDetails = pokemonData.find(p => p.name === selectedPokemon);
    if (!pokemonDetails) {
        alert('PokeError');
        return;
    }

    const level = $('#level-select').val();
    const natureValue = $('#nature-select').val();
    const results = generateResults(pokemonDetails, level, natureValue);

    $('#resultado').css('display', 'block');
    $('#results-title').css('display', 'block');
    $('#mostrarResultado').html(results);    
    setTranslations(language);
};


// 9. Limpiar los datos
const clean = () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.value = 0;
    });

    $('#level-select').val(100);
    $('#resultado').css('display', 'none');
};

// Asignar el evento de limpieza
document.getElementById('dataCleaner').addEventListener('click', clean);

// 10. Cargar los Pokémon desde la API
const fetchPokemonData = async () => {
    const pokemonListUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
    const data = await fetchData(pokemonListUrl);

    data.results.forEach(async (pokemon) => {
        const pokemonDetailsJson = await fetchData(pokemon.url);
        pokemonData.push({
            name: pokemon.name,
            stats: pokemonDetailsJson.stats,
            id: pokemonDetailsJson.id
        });
        $('#pokemon-select').append(new Option(capitalizeFirstLetter(pokemon.name), pokemon.name));
    });

    $('#pokemon-select').select2();
};

// Función para realizar el fetch de la API
const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

// Cargar Pokémon y configuraciones iniciales
$(document).ready(function () {
    setTranslations(language);
    fetchPokemonData();  // Cargar Pokémon desde la API
});


// Función para capitalizar la primera letra de un texto
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}



const translations = {
    es: {
        'choose-pokemon-label': 'Elige tu Pokémon:',
        'choose-nature-label': 'Elige la naturaleza:',
        'level-label': 'Nivel:',
        'calculator-title-iv': 'Calculadora de IVs',
        'calculator-title-ev': 'Calculadora de EVs',
        'stats-title': 'Introduce las estadísticas',
        'stat-header': 'Estadística',
        'placeholder_stat-header': 'Estadística',
        'results-title': 'Resultados',
        'placeholder_hp': 'PS',
        'placeholder_attack': 'Ataque',
        'placeholder_defense': 'Defensa',
        'placeholder_special_attack': 'Ataque Especial',
        'placeholder_special_defense': 'Defensa Especial',
        'placeholder_speed': 'Velocidad',
        'dataCleaner': 'Limpiar datos',
        'calculateIV': 'Calcular IVs',
        'calculateEV': 'Calcular EVs'
    },
    en: {
        'choose-pokemon-label': 'Choose your Pokémon:',
        'choose-nature-label': 'Choose nature:',
        'level-label': 'Level:',
        'calculator-title-iv': 'IVs Calculator',
        'calculator-title-ev': 'EVs Calculator',
        'stats-title': 'Enter stats',
        'stat-header': 'Statistic',
        'placeholder_stat-header': 'Statistic',
        'results-title': 'Results',
        'placeholder_hp': 'HP',
        'placeholder_attack': 'Attack',
        'placeholder_defense': 'Defense',
        'placeholder_special_attack': 'Special Attack',
        'placeholder_special_defense': 'Special Defense',
        'placeholder_speed': 'Speed',
        'dataCleaner': 'Clear data',
        'calculateIV': 'Check IVs',
        'calculateEV': 'Check EVs'
    }
};

const natures_es = {
    "hardy": "Fuerte",
    "lonely": "Huraña",
    "brave": "Audaz",
    "adamant": "Firme",
    "naughty": "Pícara",
    "bold": "Osada",
    "docile": "Dócil",
    "relaxed": "Plácida",
    "impish": "Agitada",
    "lax": "Floja",
    "timid": "Miedosa",
    "hasty": "Activa",
    "serious": "Seria",
    "jolly": "Alegre",
    "naive": "Ingenua",
    "modest": "Modesta",
    "mild": "Afable",
    "quiet": "Mansa",
    "bashful": "Tímida",
    "rash": "Alocada",
    "calm": "Serena",
    "gentle": "Amable",
    "sassy": "Grosera",
    "careful": "Cauta",
    "quirky": "Rara"
};


const natures = {
    Fuerte: { increase: null, decrease: null },
    Huraña: { increase: "attack", decrease: "defense" },
    brave: { increase: "attack", decrease: "speed" },
    adamant: { increase: "attack", decrease: "special_attack" },
    naughty: { increase: "attack", decrease: "special_defense" },
    bold: { increase: "defense", decrease: "attack" },
    docile: { increase: null, decrease: null },
    relaxed: { increase: "defense", decrease: "speed" },
    impish: { increase: "defense", decrease: "special_attack" },
    lax: { increase: "defense", decrease: "special_defense" },
    timid: { increase: "speed", decrease: "attack" },
    hasty: { increase: "speed", decrease: "defense" },
    serious: { increase: null, decrease: null },
    jolly: { increase: "speed", decrease: "special_attack" },
    naive: { increase: "speed", decrease: "special_defense" },
    modest: { increase: "special_attack", decrease: "attack" },
    mild: { increase: "special_attack", decrease: "defense" },
    quiet: { increase: "special_attack", decrease: "speed" },
    bashful: { increase: null, decrease: null },
    rash: { increase: "special_attack", decrease: "special_defense" },
    calm: { increase: "special_defense", decrease: "attack" },
    gentle: { increase: "special_defense", decrease: "defense" },
    sassy: { increase: "special_defense", decrease: "speed" },
    careful: { increase: "special_defense", decrease: "special_attack" },
    quirky: { increase: null, decrease: null },
};

// 3. Actualización de las opciones de naturaleza
const updateNatureOptions = (language) => {
    $('#nature-select').empty();  // Limpiar selecciones anteriores
    Object.keys(natures_es).forEach(nature => {
        const natureText = (language === 'es') ? natures_es[nature] : nature;
        $('#nature-select').append(new Option(capitalizeFirstLetter(natureText), nature));  // Asignar siempre el valor en inglés
    });
    $('#nature-select').select2();
};