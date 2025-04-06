// 5. Cálculo de IV
const calculateIV = (stat, natureBonus, level, baseStat, ev, statName) => {
    if (statName === 'hp') {
        return Math.ceil(((stat - 10) * 100) / level - 2 * baseStat - ev / 4 - 100);
    }
    return Math.ceil(((stat / natureBonus - 5) * 100) / level - 2 * baseStat - ev / 4);
};

// Generar los resultados para IVs
const generateResults = (pokemonDetails, level, natureValue) => {
    let results = `
    <table style="width: 100%; text-align: center;">
        <thead>
            <tr>
                <th id="placeholder_sprite">Sprite</th>
                <th id="placeholder_stat-header">Statistic</th>
                <th id="placeholder_iv-header">IV</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td rowspan="7" style="vertical-align: middle; text-align: center;">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonDetails.id}.png" alt="${pokemonDetails.name}" style="width: 150px; height: auto;">
                </td>
            </tr>
    `;

    pokemonDetails.stats.forEach(statInfo => {
        const statName = statInfo.stat.name.replace('-', '_');
        const statValue = parseInt($(`#stat_${statName}`).val()) || 0;
        const evValue = parseInt($(`#ev_${statName}`).val()) || 0;
        const baseStat = statInfo.base_stat;
        const natureBonus = checkNature(natureValue, statName);

        let iv = calculateIV(statValue, natureBonus, level, baseStat, evValue, statName);
        if (iv < 0 || iv > 31) {
            iv = 'Error: ' + iv;
        }

        results += `
        <tr>
            <td id="placeholder_${statName}">${statName}</td>
            <td id="placeholder_iv-${statName}">${iv}</td>
        </tr>
    `;
    });

    results += `</tbody></table>`;
    return results;
};

// Asociar el cálculo al evento de click
document.getElementById('calculateIV').addEventListener('click', handleCalculation);