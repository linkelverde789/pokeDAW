import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function Home() {
  const {t}=useTranslation();
  return (<>
  <main className='home'>
    <h1>{t('home')}</h1>
    <p>{t('home_text')}</p>

    <div className="meme">
    <p><b>Literalmente</b></p>
      <img src="/images/home.gif" alt="" />
      <p><b>Literalmente Camarón de la Isla</b></p>
    </div>
  </main>
  </>
  );
}

export default Home;
