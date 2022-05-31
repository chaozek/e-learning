import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UserNav from "../nav/UserNav";
import InstructorNav from "../nav/InstructorNav";
const InstructorRoute = ({ children }) => {
  const [ok, setOk] = useState({ ok: false });
  const router = useRouter();
  const getInstructor = async () => {
    try {
      const { data } = await axios.get("/api/current-instructor");
      if (data.ok) {
        setOk({ ok: true });
      }
    } catch (err) {
      console.log(err);
      router.push("/");
    }
  };
  useEffect(() => {
    getInstructor();
  }, []);

  return (
    <>
      {!ok ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex" }}>
          <div style={{ width: "25%" }}>
            <InstructorNav />
          </div>
          <div style={{ width: "75%", margin: "0px 10px" }}>{children}</div>
        </div>
      )}
    </>
  );
};

export default InstructorRoute;
