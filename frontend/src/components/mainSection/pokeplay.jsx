import React from "react";
import { useTranslation } from "react-i18next";

function PokeplayIndex(){
    const {t} = useTranslation();
    return <>
    <main className="home">

    <h1>Pokeplay</h1>
    <p>{t('pokeplay_text')}</p>
    <img src="/images/pokeplay.jpg" alt="" />
    </main>
    </>
}


export default PokeplayIndex;