import { useState } from "react"
import { useTranslation } from "react-i18next"

function generateNumberToString(number) {
  let result = `${number}`;
  while (result.length < 4) {
    result = "0" + result;
  }

  return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${result}/Normal.png`
}

export default function PokemonCard({ pokemonData }) {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false)
  let stats = ["hp", "attack", "defense", "special_attack", "special_defense", "speed"]

  return (
    <div className="pokemon-card">
      <div className="pokemon-header">
        <div className="pokemon-title">
          <img src={generateNumberToString(pokemonData.base_pokemon)} alt="" className="imagenManolito" />
          <h3>{pokemonData.name}</h3>
        </div>
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="pokemon-content">
          <div className="pokemon-info">
            <div className="info-section">
              <div className="info-item tooltip-container">
                <span className="info-label">{t("ability")}:</span> {pokemonData.ability.text[i18n.language].name}

                <div className="tooltip info">{pokemonData.ability.text[i18n.language].description}</div>
              </div>

              <div className="info-item tooltip-container">
                <span className="info-label">{t("item")}:</span> {pokemonData.item.text[i18n.language].name}

                <div className="tooltip info">{pokemonData.item.text[i18n.language].description}</div>
              </div>

              <div className="info-item tooltip-container">
                <span className="info-label">{t("nature")}:</span> {t(t(pokemonData.nature))}
              </div>
            </div>

            <div className="stats-section">
              <table className="stats-table">
                <tbody>
                  {stats.map(item => {
                    return <tr>
                      <td className="stat-name">{t(item)}</td>
                      <td className="stat-value">{`${pokemonData.stats[item].ev} / ${pokemonData.stats[item].iv}`}</td>
                    </tr>
                  })}

                </tbody>
              </table>
            </div>

          </div>
          <div className="moves-section">
            <span className="info-label">{t("moves")}:</span>
            <ul className="moves-list">
              {pokemonData.moves.map((move, index) => {
                return <li key={index} className="tooltip-container">
                  {move.text[i18n.language].name}

                  <div className="tooltip">{move.text[i18n.language].description}</div>
                </li>
              }
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

