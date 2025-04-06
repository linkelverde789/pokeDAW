import React from "react";
import { useTranslation } from "react-i18next";

function CommunitymonIndex() {
  const { t } = useTranslation();
  return (
    <>
      <main className="home">
        <h1>Communitymon</h1>
        <p>{t("communitymon_text")}</p>
        <img src="https://cloudfront-us-east-1.images.arcpublishing.com/infobae/5NZMRFLGB5G4DNZ3YJSQANOMKQ.jpg" alt="Pikachu Van Gogh" />
      </main>
    </>
  );
}

export default CommunitymonIndex;
