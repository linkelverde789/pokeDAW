import React, { useEffect, useState, version } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../userContext";
import Error from "../error";
import { useTranslation } from "react-i18next";
import axiosInstanceAuth from "../../axiosConfigs/axiosConfigAuth";
function Register() {
    const { t } = useTranslation();
  const { login} = useUser();
  const [newError, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (verify!==false) {
  //     navigate("/menu");
  //   }
  // }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!username) {
      setError("no_user");
      return;
    }

    if (!password) {
      setError("no_password");
      return;
    }

    if (!email) {
      setError("no_email");
      return;
    }

    if (username.length < 3) {
      setError("low_username");
      return;
    }

    if (username.length > 255) {
      setError("high_username");
      return;
    }

    if (password.length < 8) {
      setError("low_password");
      return;
    }

    if (password.toLowerCase().includes(username.toLowerCase())) {
      setError("username_in_password");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      setError("not_an_email");
      return;
    }

    // const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // if (!passwordPattern.test(password)) {
    //   setError("password_complexity");
    //   return;
    // }

    try {
      const response = await axiosInstanceAuth.post("register", {
        username,
        password,
        email,
      });

      login(
        response.data.user.id_user,
        response.data.user.username,
        response.data.token
      );

      navigate("/menu");
    } catch (error) {
      console.error(error);
      setError("registerError");
    }
  }

  return (
    <div>
      <h1>{t("register_title")}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">{t("username")}:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">{t("password")}:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">{t("register_title")}</button>
      </form>
      {newError && <Error error_type={newError} />}{" "}
    </div>
  );
}

export default Register;
