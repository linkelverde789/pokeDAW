import React from "react";
import { useTranslation } from "react-i18next";

function PokeplayIndex(){
    const {t} = useTranslation();
    return <>
    <main className="home">

    <h1>Pokeplay</h1>
    <p>{t('pokeplay_text')}</p>
    <img src="https://i.ebayimg.com/00/s/MTAzNVgxNjAw/z/ny4AAOSwa8Jfmtx~/$_57.JPG?set_id=8800005007" alt="" />
    </main>
    </>
}


export default PokeplayIndex;