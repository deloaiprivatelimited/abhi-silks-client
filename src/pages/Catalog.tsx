import React, { useEffect, useMemo, useState } from "react";
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

const API_BASE = "https://api.abhi.deloai.com";
const PER_PAGE = 12;

export default function Catalog() {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [selectedSareeId, setSelectedSareeId] = useState<string | null>(null);

  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- UX Pilot Theme (inline, no external css file) ---------------- */
  const themeVars: React.CSSProperties = {
    // Colors
    ["--background" as any]: "#FAFAFA",
    ["--foreground" as any]: "#0f172a",
    ["--card" as any]: "#ffffff",
    ["--card-foreground" as any]: "#0f172a",
    ["--primary" as any]: "#F9470B",
    ["--primary-foreground" as any]: "#ffffff",
    ["--secondary" as any]: "#64748b",
    ["--secondary-foreground" as any]: "#ffffff",
    ["--muted" as any]: "#FAFAFA",
    ["--muted-foreground" as any]: "#0f172a",
    ["--accent" as any]: "#f59e0b",
    ["--accent-foreground" as any]: "#ffffff",
    ["--destructive" as any]: "#ef4444",
    ["--destructive-foreground" as any]: "#ffffff",
    ["--border" as any]: "#EEE",
    ["--input" as any]: "#FFFFFF",
    ["--ring" as any]: "#94a3b8",

    // Radius + shadow
    ["--radius" as any]: "10px",
    ["--shadow" as any]: "-2px 4px 12px 4px rgba(51,51,51,0.05)",

    // apply base
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    minHeight: "100vh",
  };

  const appBgClass =
    "bg-[var(--background)] text-[var(--foreground)] min-h-screen";

  /* ---------------- Load varieties ---------------- */
  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/client/varieties`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setVarieties(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setVarieties([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------- Load sarees ---------------- */
  useEffect(() => {
    let cancelled = false;

    const fetchSarees = async () => {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        per_page: String(PER_PAGE),
      });

      if (selectedVarieties.length > 0) {
        params.set("varieties", selectedVarieties.join(","));
      }

      try {
        const res = await fetch(`${API_BASE}/client/sarees?${params}`);
        if (!res.ok) throw new Error("Failed to fetch sarees");

        const data = await res.json();

        if (!cancelled) {
          setSarees(Array.isArray(data?.items) ? data.items : []);
          setTotal(Number(data?.total || 0));
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSarees();

    return () => {
      cancelled = true;
    };
  }, [page, selectedVarieties]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const filteredSarees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sarees;

    return sarees.filter((s) => {
      const name = (s.name || "").toLowerCase();
      const variety = (s.variety || "").toLowerCase();
      const remarks = (s.remarks || "").toLowerCase();
      return name.includes(q) || variety.includes(q) || remarks.includes(q);
    });
  }, [sarees, search]);

  const toggleVariety = (name: string) => {
    setPage(1);
    setSelectedVarieties((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]
    );
  };

  const clearFilters = () => {
    setSelectedVarieties([]);
    setSearch("");
    setPage(1);
  };

  const hasFilters = selectedVarieties.length > 0 || search.trim().length > 0;

  return (
    <div style={themeVars} className={appBgClass}>
      {/* Hide scrollbar like UX Pilot */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header (UX Pilot exact) */}
      <header className="sticky top-0 z-50 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <span className="text-[var(--primary-foreground)] text-sm font-bold">
                VS
              </span>
            </div>
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              Venkateshwara Silks
            </h1>
          </div>

          <button
            onClick={clearFilters}
            disabled={!hasFilters}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm font-medium">Reset</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Filters
                </h2>
                <div className="bg-[var(--primary)] text-[var(--primary-foreground)] px-2 py-1 rounded-full text-xs font-medium">
                  {selectedVarieties.length}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">
                  Varieties
                </h3>

                {varieties.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No varieties found
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {varieties.map((v) => {
                      const active = selectedVarieties.includes(v.name);
                      return (
                        <button
                          key={v.id}
                          onClick={() => toggleVariety(v.name)}
                          className={[
                            "px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
                            active
                              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]",
                          ].join(" ")}
                        >
                          {v.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Catalog */}
          <section className="lg:col-span-3">
            {/* Title + Search */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Saree Catalog
              </h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                Discover our curated collection of premium sarees
              </p>

              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sarees..."
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-lg px-4 py-3 pl-12 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all duration-200"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                  🔍
                </span>
              </div>
            </div>

            {/* States */}
            {loading ? (
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 shadow-sm">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Loading sarees...
                </p>
              </div>
            ) : error ? (
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 shadow-sm">
                <p className="text-sm text-[var(--destructive)]">{error}</p>
              </div>
            ) : filteredSarees.length === 0 ? (
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-10 text-center shadow-sm">
                <p className="text-[var(--muted-foreground)]">
                  No sarees found
                </p>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-medium hover:bg-[var(--muted)] transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Grid (UX Pilot same responsive) */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {filteredSarees.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSareeId(s.id)}
                      className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group text-left"
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={
                            s.image_urls?.[0] ||
                            "https://via.placeholder.com/400x520"
                          }
                          alt={s.name}
                          loading="lazy"
                        />
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-[var(--accent)] text-[var(--accent-foreground)] px-2 py-1 rounded-md text-xs font-medium">
                            {s.variety || "Saree"}
                          </span>

                          <span className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer select-none">
                            ♡
                          </span>
                        </div>

                        <h3 className="font-semibold text-[var(--foreground)] mb-1 line-clamp-1">
                          {s.name}
                        </h3>

                        <p className="text-[var(--primary)] font-bold">
                          ₹{s.min_price} - ₹{s.max_price}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Pagination (UX Pilot vibe) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="flex items-center space-x-2 px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--ring)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button className="w-10 h-10 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium">
                        {page}
                      </button>
                      <span className="text-sm text-[var(--muted-foreground)]">
                        / {totalPages}
                      </span>
                    </div>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="flex items-center space-x-2 px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:border-[var(--ring)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Modal */}
      {selectedSareeId && (
        <SareeModal
          sareeId={selectedSareeId}
          onClose={() => setSelectedSareeId(null)}
        />
      )}
    </div>
  );
}
