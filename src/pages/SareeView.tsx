import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSarees } from "../api/sarees";
import type { Saree } from "../api/sarees";

import { getTokenFromUrl } from "../api/token";

const SareeView: React.FC = () => {
  const { id } = useParams();
  const [saree, setSaree] = useState<Saree | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = getTokenFromUrl();

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        const data = await fetchSingleSaree(id);
        setSaree(data);
      } catch (e: any) {
        setErr(e.message || "Failed to fetch saree");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <div style={{ padding: 30 }}>Loading saree...</div>;

  if (err) {
    return (
      <div style={{ padding: 30 }}>
        <h2>Error</h2>
        <p>{err}</p>
      </div>
    );
  }

  if (!saree) return null;

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <Link to={`/catalog?token=${token}`}>← Back</Link>

      <h2 style={{ marginTop: 10 }}>{saree.name}</h2>
      <p style={{ fontSize: 18, color: "#444" }}>₹{saree.price}</p>
      <p style={{ color: "#777" }}>{saree.remarks}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
        {(saree.images || []).map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`img-${i}`}
            style={{
              width: 260,
              height: 260,
              objectFit: "cover",
              borderRadius: 12,
              border: "1px solid #eee",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SareeView;
