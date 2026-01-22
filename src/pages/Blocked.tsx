import React from "react";

type Props = {
  msg: string;
};

const Blocked: React.FC<Props> = ({ msg }) => {
  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Access Blocked</h2>
      <p style={{ color: "#555" }}>{msg}</p>
      <p style={{ marginTop: 10, color: "#999" }}>
        This link works only on one device.
      </p>
    </div>
  );
};

export default Blocked;
