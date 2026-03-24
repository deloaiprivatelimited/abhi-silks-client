import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Catalog from "./pages/Catalog";
import Blocked from "./pages/Blocked";

import { verifyInviteToken } from "./api/token";

const App: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">(
    "loading"
  );
  const [msg, setMsg] = useState("");

  // 👇 ADD THIS HERE
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        document.body.style.filter = "blur(10px)";
      } else {
        document.body.style.filter = "none";
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

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