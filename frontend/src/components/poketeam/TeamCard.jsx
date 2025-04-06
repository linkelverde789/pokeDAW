import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function TeamCard({ teamData }) {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="team-card">
      <div className="team-header">
        <div className="team-title">
          <h3>{teamData.team_name}</h3>
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
        <div className="team-content">
          <div className="pokemon-grid">
            {teamData.members.map((pokemon, index) => (
              <div key={index} className="pokemon-item">
                <img 
                  src={`https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${pokemon.id_pokemon.toString().padStart(4, '0')}/Normal.png`} 
                  alt={pokemon.name}
                  className="pokemon-sprite"
                />
                <span className="pokemon-name">{pokemon.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 