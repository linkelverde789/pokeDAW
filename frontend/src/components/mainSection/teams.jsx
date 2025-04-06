import React from "react";
import { useTranslation } from "react-i18next";

function TeamsIndex() {
  const { t } = useTranslation();
  return (
    <main className="home">
      <h1>{t("teams_home")}</h1>
      <p>{t("teams-text")}</p>
      <img className="teamsIcon" src="https://static1.thegamerimages.com/wordpress/wp-content/uploads/2020/06/Pokemon-Villain-Teams-Gen-1-to-7-Commanders-and-Leaders-Cropped.jpg" alt="" />
    </main>
  );
}

export default TeamsIndex; 