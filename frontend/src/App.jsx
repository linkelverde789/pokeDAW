import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import PokeplayGuess from "./components/pokeplay/guess";
import EVCalculator from "./components/poketools/EV";
import IVCalculator from "./components/poketools/IV";
import Home from "./components/mainSection/home";
import NationalDex from "./components/pokedex/nationaldex";
import PokedexIndex from "./components/mainSection/pokedex";
import Pokemon from "./components/pokedex/pokemon";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { UserProvider } from "./userContext";
import MenuIndex from "./components/mainSection/menu";
import Logout from "./components/auth/logout";
import FavouritePokemon from "./components/menu/favouritePokemon";
import CatchedPokemon from "./components/menu/catchedPokemon";
import CreateCommunityMon from "./components/communityMon/create";
import CommunityDex from "./components/communityMon/readAll";
import MyCommunitymon from "./components/communityMon/myCommunitymon";
import DeleteCommunitymon from "./components/communityMon/delete";
import UpdateCommunitymon from "./components/communityMon/update";
import PokeplayEntry from "./components/pokeplay/entry";
import SQL from "./components/poketools/sql";
import CommunitymonIndex from "./components/mainSection/communitymon";
import PoketoolsIndex from "./components/mainSection/poketools";
import PokeplayIndex from "./components/mainSection/pokeplay";
import ReadOne from "./components/communityMon/readOne";
import Pokemondle from "./components/pokeplay/pokemondle";
import Damage from "./components/poketools/damage";
import CreatePokemonMember from "./components/pokemember/create"
import ReadAllPokemember from "./components/pokemember/readAll";
import CreatePoketeam from "./components/poketeam/createTeam";
import ReadAllPoketeam from "./components/poketeam/readAll";
import TeamsIndex from "./components/mainSection/teams";
function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  useEffect(() => {
    const imagenes = ["80.png", "54.png", "7.png"];
    const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
    document.body.style.backgroundImage = `url(/images/${imagenes[indiceAleatorio]})`;
    document.body.style.backgroundPosition = `center`;
    document.body.style.backgroundAttachment = `fixed`;
  }, []);

  const location = useLocation();

  return (
    <UserProvider>
      <Navbar />
      <div className="mainContainer">
        <motion.div
          key={location.key}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -350 }}
          transition={{ duration: 0.75 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />

            <Route path="/Login" element={<Login />} />
            <Route path="/Logout" element={<Logout />} />
            <Route path="/Register" element={<Register />} />

            <Route path="/Menu" element={<MenuIndex />} />
            <Route path="/Menu/fav" element={<FavouritePokemon />} />
            <Route path="/Menu/catched" element={<CatchedPokemon />} />

            <Route path="/CommunityMon" element={<CommunitymonIndex />} />
            <Route path="/CommunityMon/create" element={<CreateCommunityMon />}/>
            <Route path="/CommunityMon/my" element={<MyCommunitymon />} />
            <Route path="/CommunityMon/update" element={<UpdateCommunitymon />}/>
            <Route path="/CommunityMon/delete" element={<DeleteCommunitymon />}/>

            <Route path="/pokeplay" element={<PokeplayIndex />} />
            <Route path="/pokeplay/guess" element={<PokeplayGuess />} />
            <Route path="/pokeplay/entry" element={<PokeplayEntry />} />
            <Route path="/pokeplay/pokemondle" element={<Pokemondle />} />

            <Route path="/poketools" element={<PoketoolsIndex />} />
            <Route path="/poketools/IV" element={<IVCalculator />} />
            <Route path="/poketools/EV" element={<EVCalculator />} />
            <Route path="/poketools/SQL" element={<SQL />} />
            <Route path="/poketools/damages" element={<Damage />} />

            <Route path="/pokedex" element={<PokedexIndex />} />
            <Route path="/pokedex/nationaldex" element={<NationalDex />} />
            <Route path="/pokedex/pokemon/" element={<Pokemon />} />
            <Route path="/pokedex/pokemon/:id" element={<Pokemon />} />

            <Route path="/pokedex/communitydex" element={<CommunityDex />} />
            <Route path="/pokedex/communitymon/" element={<ReadOne />} />
            <Route path="/pokedex/communitymon/:id" element={<ReadOne />} />

            <Route path="/pokemember/create" element={<CreatePokemonMember />} />
            <Route path="/pokemember/my" element={<ReadAllPokemember />} />

            <Route path="/poketeam/create" element={<CreatePoketeam />} />
            <Route path="/poketeam/my" element={<ReadAllPoketeam />} />
            <Route path="/teams" element={<TeamsIndex />} />

          </Routes>
        </motion.div>
      </div>
    </UserProvider>
  );
}

export default App;
