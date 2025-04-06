import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import { useTranslation } from "react-i18next";
import axiosInstance from '../../axiosConfig';



// Función para obtener la lista paginada de Pokémon
const fetchAllPokemon = async (start) => {
  try {
    let data = await axiosInstance.get(
      `pokedex/all?limit=12&start=${start}`
    );
    data=data.data;
    return data && data.length > 0 ? data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Función para buscar Pokémon por nombre
const fetchPokemonByName = async (name) => {
  try {
    let data = await axiosInstance.get(
      `pokedex/search?name=${name}`
    );
    data=data.data;
    return data && data.length > 0 ? data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

function NationalDex() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pokemonList, setPokemonList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const initialLoadRef = useRef(false);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const start = page * 12 + 1;
    const newPokemon = await fetchAllPokemon(start);

    if (!newPokemon || (newPokemon.length === 1 && newPokemon[0].id === 1025)) {
      setHasMore(false);
      return;
    }
    setPokemonList((prev) => [...prev, ...newPokemon]);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  const getDataByName = async (name) => {
    setLoading(true);
    const results = await fetchPokemonByName(name);
    setPokemonList(results);
    setLoading(false);
  };

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      getData();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const searchTerm = event.target.pokemonName.value.trim();

    if (searchTerm !== "") {
      setPage(0);
      setPokemonList([]);
      setIsSearching(true);
      setHasMore(false);
      await getDataByName(searchTerm);
    } else if (isSearching) {
      setPage(0);
      setPokemonList([]);
      setHasMore(true);
      setIsSearching(false);
      await getData();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main>
      <h1>Pokédex</h1>
      <div className="page-wrapper">
        <div className="mainSearch">
          <nav>
            <div className="logo-container">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
                alt="Poké Ball"
              />
            </div>
            <form className="search-bar" onSubmit={handleSubmit}>
              <input
                type="text"
                name="pokemonName"
                className="search-field"
                id="search-field"
                placeholder={t("search-pokemon")}
              />
              <button className="btn-submit" type="submit">
              <i class="fas fa-search"></i>
              </button>
            </form>
          </nav>
        </div>
      </div>

      <InfiniteScroll
        className="pokemonMain"
        dataLength={pokemonList.length}
        next={getData}
        hasMore={hasMore && !isSearching}
        loader={<Loading />}
        endMessage={<p className="noMore">{t("noMore")}</p>}
      >
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="pokemonDIV"
            onClick={() => navigate(`/pokedex/pokemon/${pokemon.id}`)}
          >
            <div className={`image ${pokemon.type1.toLowerCase()}`}>
              <p className="pokemonID">#{pokemon.id}</p>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
              />
            </div>
            <div className="pokemonInfo">
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
          </div>
        ))}
      </InfiniteScroll>
    </main>
  );
}

export default NationalDex;
