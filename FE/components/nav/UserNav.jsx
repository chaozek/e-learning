import React from "react";
import Link from "next/link";
const UserNav = () => {
  return (
    <div style={{ background: "#BADA55", color: "#00000" }}>
      <div style={{ padding: "1rem" }}>
        <Link href="#">Dashboard</Link>
      </div>
    </div>
  );
};

export default UserNav;
