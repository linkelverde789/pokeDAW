
//Obtener Número de pokémon aleatorio
const randomNumber=Math.floor(Math.random()*1025);

//Insertar imagen de ese pokémon
document.getElementById('randomLogo').src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${randomNumber}.png`;

//Hacer que el logo te lleve a esa sección de la pokédex
document.getElementById('logoLink').href=`/pokedex/${randomNumber}`;