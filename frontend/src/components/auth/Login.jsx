import React, { useEffect, useState } from "react";
import axiosInstanceAuth from "../../axiosConfigAuth";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../userContext";
import { useTranslation } from "react-i18next";
import Error from "../error";
function Register() {
  const { t, i18n } = useTranslation();
  const { login, user } = useUser();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if(!username){
      setError('no_user');
      return;
    }

    if(!password){
      setError('no_password');
      return;
    }

    try {
      const response = await axiosInstanceAuth.post("login", {
        username,
        password,
      });

      login(response.data.id, username, response.data.token);
      navigate("/menu");
    } catch (error) {
      setError(
        "loginError"
      );
    }
  }

  return (
    <>
      <h1>{t('login_title')}</h1>
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="username">{t('username')}:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">{t('password')}:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{t('login_title')}</button>
        <Link id="pepe" to={"/register"}>
          {t("account?")}
        </Link>
      </form>
      {error && <Error error_type={error} />}{" "}
    </>
  );
}

export default Register;
