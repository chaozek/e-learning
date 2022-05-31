import { Button } from "@/styling/GlobalStyledCompStyles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InstructorRoute from "../../components/routes/InstructorRoute";

const revenue = () => {
  const [balance, setBalance] = useState({ pending: [] });
  const sendBalanceReq = async () => {
    const { data } = await axios.get(`/api/instructor/balance`);
    console.log(data);
    setBalance(data);
  };
  useEffect(() => {
    sendBalanceReq();
  }, []);

  const handlePayoutSettings = async () => {
    try {
      console.log("DATA");
      const { data } = await axios.get("/api/instructor/payout-settings");
      window.location.href = data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <InstructorRoute>
      <div>
        {balance.pending &&
          balance.pending.map((bp, i) => {
            return (
              <span key={i}>
                <strong>
                  Pending Balance: {bp.amount} {bp.currency}
                </strong>
              </span>
            );
          })}
        <div>
          <Button onClick={() => handlePayoutSettings()}>SETTINGS</Button>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default revenue;
