import React from "react";
import { useTranslation } from "react-i18next";

function PokedexIndex() {
  const { t } = useTranslation();
  return (
    <main className="home">
      <h1>Pokédex - {t("home")}</h1>
      <p>{t("pokedex-text")}</p>
      <img className="pokedexIcon" src="https://www.pkparaiso.com/rubi-omega-zafiro-alfa/pokedex-hoenn/pokedex.png" alt="" />
    </main>
  );
}

export default PokedexIndex;