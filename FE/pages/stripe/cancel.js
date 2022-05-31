import React from "react";
import UserRoute from "../../components/routes/UserRoute";
const cancel = () => {
  return <UserRoute showNav={false}>PAYMENT FAILED</UserRoute>;
};

export default cancel;
