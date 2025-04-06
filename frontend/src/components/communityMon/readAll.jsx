import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import axiosInstanceCommunitymon from "../../axiosConfigCommunitymon";

function CommunityDex() {
  const navigate=useNavigate();
  const [loading, setLoading] = useState(true);
  const [communitymon, setCommunitymon] = useState(null);
  const { t } = useTranslation();
  const [error, setError] = useState();
  async function fetchData() {
    try {
      const response = await axiosInstanceCommunitymon.get('/all');


      setCommunitymon(response.data);
    } catch (error) {
      setError("error_load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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
      <h1>{t("allCommunitymon_title")}</h1>
      <div className="communitymonMain">
        {communitymon.map((pokemon) => {
         return <div
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
                  <p className={`type2 text-${pokemon.type2.toLowerCase()}`}>
                    {t(pokemon.type2.toLowerCase())}
                  </p>
                )}
              </div>
            </div>
          </div>;
        })}
      </div>
    </>
  );
}

export default CommunityDex;
