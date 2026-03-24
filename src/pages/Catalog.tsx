import React, { useEffect,  useRef, useState } from "react";
import SareeModal from "./SareeModal";

type Saree = {
  id: string;
  name: string;
  image_urls: string[];
  variety: string;
  remarks?: string;
  min_price: number;
  max_price: number;
};

type Variety = {
  id: string;
  name: string;
};

const API_BASE = "https://web-production-2d63b.up.railway.app";
const PER_PAGE = 12;

export default function Catalog() {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [selectedSareeId, setSelectedSareeId] = useState<string | null>(null);

  const [activeVariety, setActiveVariety] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const observerRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- Theme ---------------- */
  const themeVars: React.CSSProperties = {
    ["--background" as any]: "#FAFAFA",
    ["--foreground" as any]: "#0f172a",
    ["--card" as any]: "#ffffff",
    ["--primary" as any]: "#F9470B",
    ["--border" as any]: "#EEE",
    ["--muted-foreground" as any]: "#64748b",

    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    fontFamily: "Inter, system-ui, sans-serif",
    minHeight: "100vh",
  };

  /* ---------------- Load Varieties ---------------- */
  useEffect(() => {
    fetch(`${API_BASE}/client/varieties`)
      .then((r) => r.json())
      .then((data) => {
        setVarieties(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setVarieties([]);
      });
  }, []);

  /* ---------------- Load Sarees (Infinite Scroll) ---------------- */
  useEffect(() => {
    if (!activeVariety || !hasMore) return;

    let cancelled = false;

    const fetchSarees = async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        per_page: String(PER_PAGE),
        varieties: activeVariety,
      });

      try {
        const res = await fetch(`${API_BASE}/client/sarees?${params}`);
        if (!res.ok) throw new Error("Failed to fetch sarees");

        const data = await res.json();
        const newItems = Array.isArray(data?.items) ? data.items : [];

        if (!cancelled) {
          setSarees((prev) =>
            page === 1 ? newItems : [...prev, ...newItems]
          );

          if (newItems.length < PER_PAGE) {
            setHasMore(false);
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Something went wrong");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSarees();

    return () => {
      cancelled = true;
    };
  }, [page, activeVariety]);

  /* ---------------- Infinite Scroll Observer ---------------- */
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  /* ---------------- Search Filter ---------------- */


  const goBackToVarieties = () => {
    setActiveVariety(null);
    setSarees([]);
    setPage(1);
    setHasMore(true);
  };
return (
  <div style={themeVars}>
    
    {/* ✅ WATERMARK */}
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.08,
        zIndex: 9999,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "200px",
            transform: "rotate(-30deg)",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#000",
          }}
        >
          Venkateshwara Silks
        </div>
      ))}
    </div>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-white font-bold">
            VS
          </div>
          <h1 className="text-xl font-semibold">
            Venkateshwara Silks
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ---------- VARIETY VIEW ---------- */}
        {!activeVariety && (
          <>
            <h2 className="text-3xl font-bold mb-8">
              Shop by Variety
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {varieties.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setActiveVariety(v.name);
                    setPage(1);
                    setSarees([]);
                    setHasMore(true);
                  }}
                  className="bg-white border border-[var(--border)] rounded-xl p-6 hover:shadow-lg transition-all text-center"
                >
                  <div className="text-lg font-semibold">
                    {v.name}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ---------- SAREE VIEW ---------- */}
        {activeVariety && (
          <>
<div className="sticky top-[72px] z-40 bg-[var(--background)] 
                flex items-center justify-between 
                py-4 mb-6 border-b border-[var(--border)]">
              <h2 className="text-2xl font-bold">
                {activeVariety}
              </h2>

              <button
                onClick={goBackToVarieties}
                className="text-sm text-[var(--primary)] font-medium"
              >
                ← Back to Varieties
              </button>
            </div>


            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {sarees.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSareeId(s.id)}
                  className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-lg transition-all group text-left"
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      src={
                        s.image_urls?.[0] ||
                        "https://via.placeholder.com/400x520"
                      }
                      alt={s.name}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">
                      {s.name}
                    </h3>

                    <p className="text-[var(--primary)] font-bold mt-1">
                      ₹{s.max_price}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            {hasMore && (
              <div
                ref={observerRef}
                className="h-16 flex justify-center items-center"
              >
                {loading && (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    Loading more sarees...
                  </span>
                )}
              </div>
            )}

            {!hasMore && (
              <div className="text-center text-sm text-[var(--muted-foreground)] py-6">
                You’ve reached the end ✨
              </div>
            )}
          </>
        )}
      </main>

      {selectedSareeId && (
        <SareeModal
          sareeId={selectedSareeId}
          onClose={() => setSelectedSareeId(null)}
        />
      )}
    </div>
  );
}
