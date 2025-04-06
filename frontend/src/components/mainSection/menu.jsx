import React, { useEffect } from "react";
import { useUser } from "../../userContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MenuIndex() {
  const navigate = useNavigate();
  const { verify } = useUser();
  const {t}=useTranslation();
  useEffect(() => {
    if (!verify()) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <main className="home">
      <h1>Menú</h1>
      <p>
{t('menu_text')}
      </p>
      <img
        src="/images/viyuela.png"
        alt=""
      />
    </main>
  );
}

export default MenuIndex;
