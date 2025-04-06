import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


function PoketoolsIndex(){
    const {t}=useTranslation();
    return <>
    <main className="home">
    <h1>Poketools</h1>
    <p>{t('poketools_text')}</p>
<img src="/images/poketools.jpg" alt="" />
    </main>
    </>
}


export default PoketoolsIndex;