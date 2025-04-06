import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../userContext";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useUser();

  useEffect(() => {
    logout();
    navigate("/login");
  }, []);

  return null;
}

export default Logout;