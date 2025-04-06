
const calculateEV = (stat, natureBonus, level, baseStat, iv, statName) => {
    if (statName === 'hp') {
        return Math.ceil((((stat - 10) * 100) / level - 2 * baseStat - iv - 100) * 4);
    }
    return Math.ceil((((stat / natureBonus - 5) * 100) / level - 2 * baseStat - iv) * 4);
};

const generateResults = (pokemonDetails, level, natureValue) => {
    let results = `
    <table style="width: 100%; text-align: center;">
        <thead>
            <tr>
                <th id="placeholder_sprite">Sprite</th>
                <th id="placeholder_stat-header">Statistic</th>
                <th id="placeholder_ev-header">EV</th>
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
        const ivValue = parseInt($(`#iv_${statName}`).val()) || 0;
        const baseStat = statInfo.base_stat;
        const natureBonus = checkNature(natureValue, statName);

        let ev = calculateEV(statValue, natureBonus, level, baseStat, ivValue, statName);

        if (ev < 0 || ev > 252) {
            ev = 'Error: ' + ev;
        }

        results += `
        <tr>
            <td id="placeholder_${statName}">${statName}</td>
            <td id="placeholder_ev-${statName}">${ev}</td>
        </tr>
    `;
    });

    results += `</tbody></table>`;
    return results;
};

document.getElementById('calculateEV').addEventListener('click', handleCalculation);