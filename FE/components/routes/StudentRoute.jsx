import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserNav from "../nav/UserNav";
const Student = ({ children, showNav = true }) => {
  const [ok, setOk] = useState({ ok: false });
  const router = useRouter();
  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/current-user");
      if (data.ok) {
        setOk({ ok: true });
      }
    } catch (err) {
      console.log(err);
      router.push("/");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return <>{!ok ? <p>Loading...</p> : <div>{children}</div>}</>;
};

export default Student;
