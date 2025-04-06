import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "../userContext";
import LanguageButton from "./languageButton";
function Navbar() {
  const { user } = useUser();
  const navigate=useNavigate();
  const { t } = useTranslation();
  const location = useLocation();


  const navLinks = {
    "/": [
      { name: "Pokedex", path: "/pokedex" },
      { name: "Pokeplay", path: "/pokeplay" },
      { name: "Poketools", path: "/poketools" },
    ],
    "/pokedex": [
      { name: t('nationaldex'), path: "/pokedex/nationaldex" },
      { name: t('communitydex'), path: "/pokedex/communitydex" },
    ],
    "/pokeplay": [

      { name: t('guessTitle'), path: "/pokeplay/guess" },
      { name: t('entry'), path: "/pokeplay/entry" },
      { name: "Pokemondle", path: "/pokeplay/pokemondle" },
    ],
    "/poketools": [
      { name: t('IV'), path: "/poketools/IV" },
      { name: t('EV'), path: "/poketools/EV" },
      { name: t('damage'), path: "/poketools/damages" },
      { name: 'SQL', path: "/poketools/sql" },
    ],
    "/menu": [
      { name: t('favs'), path: "/menu/fav" },
      { name: t('caught'), path: "/menu/catched" },
      { name: "Communitymon", path: "/communitymon" },
      { name: t("teams"), path: "/teams" },
      { name: t('logout'), path: "/logout" },
    ],
    "/communitymon": [
      { name: t('create'), path: "communitymon/create" },
      { name: t('my'), path: "communitymon/my" },
      { name: t('update'), path: "communitymon/update" },
      { name: t('delete'), path: "communitymon/delete" },
    ],
    "/teams": [
      { name: t('pokemember_create'), path: "pokemember/create" },
      { name: t('pokemember_my'), path: "pokemember/my" },
      { name: t('poketeam_create'), path: "poketeam/create" },
      { name: t('poketeam_my'), path: "poketeam/my" },
    ],
    "/pokemember": [
      { name: t('pokemember_create'), path: "pokemember/create" },
      { name: t('pokemember_my'), path: "pokemember/my" },
    ],
    "/poketeam": [
      { name: t('poketeam_create'), path: "poketeam/create" },
      { name: t('poketeam_my'), path: "poketeam/my" },
    ],
  };
  let basePath = location.pathname.match(/^\/([^\/]+)/);

  if (!basePath || !navLinks[basePath[0]]) {
    basePath = "/";
  } else {
    basePath = "/" + basePath[1];
  }

  return (
    <nav className="juja">
      <div className="nav-container">
        <div className="logo">
          <img onClick={()=>{navigate(`/pokedex/pokemon/${Math.floor(Math.random() * 1025) + 1}`)}} 
            src="/images/ditto.gif"
            alt="Ditto dancing Conga"
          />
          <span className="ruta1"><a href="/">PokeDAW</a></span>
        </div>
        <ul>
          {navLinks[basePath].map((link) => (
            <li key={link.name}>
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}

          {basePath!='/menu' && <li>
            <Link to={!user.token ? "/Login" : "/menu"}>
              {!user.username ? "Login" : user.username}
            </Link>
          </li>}
        </ul>

        <label className="language-switch">
          {<LanguageButton/>}
        </label>
      </div>
    </nav>
  );
}

export default Navbar;
