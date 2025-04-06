import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: localStorage.getItem("id") ? localStorage.getItem("id") : null,
    username: localStorage.getItem("username") ? localStorage.getItem("username"): null,
    token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  });

  const login = (id, username, token) => {
    localStorage.setItem("id", id);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setUser({ id: id, username: username, token: token });
  };

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser({ id: null, username: null, token: null });
  };

  const verify = () => {
    let response = localStorage.getItem("id") !== null && user.id !== null;
    return response;
  };

  function getID() {
    return localStorage.getItem("id");
  }

  return (
    <UserContext.Provider value={{ user, login, logout, verify, getID }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
