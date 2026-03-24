import { useEffect, useRef, useState } from "react";
import SareeOrderModal from "./SareeOrderModal";

type Saree = {
  id: string;
  name: string;
  image_urls: string[];
  variety: string;
  remarks?: string;
  min_price: number;
  max_price: number;
};

type Props = {
  sareeId: string;
  onClose: () => void;
};

const API_BASE = "https://web-production-2d63b.up.railway.app";

export default function SareeModal({ sareeId, onClose }: Props) {
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [saree, setSaree] = useState<Saree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ✅ UX Pilot Theme vars (inside component, single copy-paste) */
  const themeVars: React.CSSProperties = {
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

    ["--radius" as any]: "10px",
    ["--shadow" as any]: "-2px 4px 12px 4px rgba(51,51,51,0.05)",

    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    setSaree(null);
    setActiveIndex(0);

    fetch(`${API_BASE}/client/sarees/${sareeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load saree");
        return res.json();
      })
      .then(setSaree)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sareeId]);


  const images = saree?.image_urls?.length
    ? saree.image_urls
    : ["https://via.placeholder.com/400x520"];

  const scrollToIndex = (idx: number) => {
    const el = sliderRef.current;
    if (!el) return;

    const width = el.clientWidth;
    el.scrollTo({ left: idx * width, behavior: "smooth" });
    setActiveIndex(idx);
  };

  const onScroll = () => {
    const el = sliderRef.current;
    if (!el) return;

    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(idx);
  };

  return (
    <div style={themeVars}>
      {/* Hide scrollbar like UX Pilot */}
      <style>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        onClick={onClose}
        className="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 p-3 sm:items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl overflow-hidden rounded-xl bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] shadow-lg"
          style={{ boxShadow: "var(--shadow)" }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-[var(--foreground)] sm:text-lg">
                {saree?.name || "Saree Details"}
              </h2>

              {saree?.variety && (
                <p className="truncate text-xs text-[var(--muted-foreground)]">
                  {saree.variety}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[80vh] overflow-y-auto p-4">
            {loading ? (
              <p className="text-sm text-[var(--muted-foreground)]">
                Loading...
              </p>
            ) : error ? (
              <p className="text-sm text-[var(--destructive)]">{error}</p>
            ) : saree ? (
              <>
                {/* Image Slider */}
                <div className="relative">
                  <div
                    ref={sliderRef}
                    onScroll={onScroll}
                    className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {images.map((url, idx) => (
                      <div key={idx} className="w-full flex-shrink-0 snap-center">
                        <img
                          src={url}
                          alt={`${saree.name} ${idx + 1}`}
                          className="h-[320px] w-full rounded-xl object-contain sm:h-[420px]"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Left/Right Buttons (desktop only) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          scrollToIndex(Math.max(activeIndex - 1, 0))
                        }
                        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-[var(--card)]/90 px-3 py-2 text-sm font-bold shadow-sm hover:bg-[var(--card)] sm:block border border-[var(--border)]"
                      >
                        ‹
                      </button>

                      <button
                        onClick={() =>
                          scrollToIndex(
                            Math.min(activeIndex + 1, images.length - 1)
                          )
                        }
                        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-[var(--card)]/90 px-3 py-2 text-sm font-bold shadow-sm hover:bg-[var(--card)] sm:block border border-[var(--border)]"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Dots Indicator */}
                  {images.length > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => scrollToIndex(idx)}
                          className={[
                            "h-2 w-2 rounded-full transition",
                            idx === activeIndex
                              ? "bg-[var(--primary)]"
                              : "bg-[var(--border)] hover:bg-[var(--ring)]",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  )}

                  {/* Hint */}
                  {images.length > 1 && (
                    <p className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
                      Swipe to see more images
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-[var(--foreground)]">
                        Variety:{" "}
                        <span className="font-semibold text-[var(--foreground)]">
                          {saree.variety}
                        </span>
                      </p>

                      {saree.remarks && (
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          {saree.remarks}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 sm:mt-0">
                      <p className="text-lg font-bold text-[var(--primary)]">
                        ₹{saree.max_price}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Price 
                      </p>
                    </div>
                  </div>
                </div>

                {/* Optional footer actions (UX Pilot style buttons) */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
  onClick={() => setShowOrderModal(true)}
  className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-lg font-medium hover:opacity-90 transition"
>
  Order Now
</button>



                  <button className="w-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] py-3 rounded-lg font-medium hover:bg-[var(--muted)] transition">
                    Close
                  </button>
                  {showOrderModal && saree && (
  <SareeOrderModal
    sareeName={saree.name}
    variety={saree.variety}
    price={saree.max_price}
    images={images}
    onClose={() => setShowOrderModal(false)}
  />
)}

                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
``
