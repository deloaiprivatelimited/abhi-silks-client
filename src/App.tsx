import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Catalog from "./pages/Catalog";
import Blocked from "./pages/Blocked";

import { verifyInviteToken } from "./api/token";

const App: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">(
    "loading"
  );
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function init() {
      const res = await verifyInviteToken();

      if (res.allowed) {
        setStatus("allowed");
        setMsg(res.msg);
      } else {
        setStatus("blocked");
        setMsg(res.msg);
      }
    }

    init();
  }, []);

  if (status === "loading") {
    return <div style={{ padding: 30 }}>Checking link access...</div>;
  }

  if (status === "blocked") {
    return <Blocked msg={msg} />;
  }

  return (
    <Routes>
      <Route path="/catalog" element={<Catalog />} />
    </Routes>
  );
};

export default App;
