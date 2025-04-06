import React from "react";
import { useTranslation } from "react-i18next";

function TeamsIndex() {
  const { t } = useTranslation();
  return (
    <main className="home">
      <h1>{t("teams_home")}</h1>
      <p>{t("teams-text")}</p>
      <img className="teamsIcon" src="/images/teams.avif" alt="" />
    </main>
  );
}

export default TeamsIndex; 