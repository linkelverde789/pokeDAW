import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";
import axiosInstanceCommunitymon from "../../axiosConfigs/axiosConfigCommunitymon";
import { useUser } from "../../userContext";

function MyCommunitymon() {
  const [loading, setLoading] = useState(true);
  const [communitymon, setCommunitymon] = useState(null);
  const { t } = useTranslation();
  const [error, setError] = useState();
  const { verify, user } = useUser();
  const navigate = useNavigate();
  async function fetchData() {
    try {
      const response = await axiosInstanceCommunitymon.post(
        "/my_communitymon",
        { id_user: user.id }
      );


      setCommunitymon(response.data);
    } catch (error) {
      setError("error_load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!verify()) {
      navigate("/login");
      return;
    }

    fetchData();
  }, []);

  if (error) {
    return <h1>Error</h1>;
  }

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <h1>{t("my_communitymon")}</h1>
      <div className="communitymonMain">
        {communitymon.length == 0 ? (
          <h2>{t("no_communitymon")}</h2>
        ) : (
          communitymon.map((pokemon) => {
            return (
              <div
                key={pokemon.id}
                className="communitymonDIV"
                onClick={() => navigate(`/pokedex/communitymon/${pokemon.id}`)}
              >
                <div className={`image ${pokemon.type1.toLowerCase()}`}>
                  <p className="communitymonID">#{pokemon.id}</p>
                  <img src={pokemon.sprite} alt={pokemon.name} />
                </div>
                <div className="communitymonInfo">
                  <p className="name">{pokemon.name}</p>
                  <div className="types">
                    <p className={`type1 text-${pokemon.type1.toLowerCase()}`}>
                      {t(pokemon.type1.toLowerCase())}
                    </p>
                    {pokemon.type2 && (
                      <p
                        className={`type2 text-${pokemon.type2.toLowerCase()}`}
                      >
                        {t(pokemon.type2.toLowerCase())}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default MyCommunitymon;
