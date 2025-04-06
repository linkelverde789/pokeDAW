import React from "react";
import { useTranslation } from "react-i18next";

function CommunitymonIndex() {
  const { t } = useTranslation();
  return (
    <>
      <main className="home">
        <h1>Communitymon</h1>
        <p>{t("communitymon_text")}</p>
        <img src="/images/communitymon.jpg" alt="Pikachu Van Gogh" />
      </main>
    </>
  );
}

export default CommunitymonIndex;
