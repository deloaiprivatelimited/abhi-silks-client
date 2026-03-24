import { useState } from "react";

type Props = {
  sareeName: string;
  variety: string;
  price: number;
  images: string[];
  onClose: () => void;
};

const WHATSAPP_NUMBER = "918123414850";

export default function SareeOrderModal({
  sareeName,
  variety,
  price,
  images,
  onClose,
}: Props) {
  const [selected, setSelected] = useState<{
    [key: number]: string;
  }>({});

  const toggleSelection = (index: number) => {
    setSelected((prev) => {
      const copy = { ...prev };

      if (copy[index] !== undefined) {
        delete copy[index];
      } else {
        copy[index] = "1";
      }

      return copy;
    });
  };

  const updateQuantity = (index: number, qty: string) => {
    const cleaned = qty.replace(/[^0-9]/g, "");

    setSelected((prev) => ({
      ...prev,
      [index]: cleaned,
    }));
  };

  const sendToWhatsApp = () => {
    const selectedEntries = Object.entries(selected).filter(
      ([, qty]) => qty && Number(qty) > 0
    );

    if (selectedEntries.length === 0) {
      alert("Please select at least one color and quantity");
      return;
    }

    const colorDetails = selectedEntries
      .map(([index, qty], i) => {
        const imageUrl = images[Number(index)];

        return `${i + 1}.
Color Image: ${imageUrl}
Qty: ${qty}`;
      })
      .join("\n\n");

    const message = `
Hello 👋
I'm interested in:

🧵 Name: ${sareeName}
✨ Variety: ${variety}
💰 Price: ₹${price}

Selected Colors:
${colorDetails}

Please confirm availability.
`.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white max-w-3xl w-full rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Select Colors & Quantity</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => {
            const isSelected = selected[idx] !== undefined;

            return (
              <div key={idx} className="border rounded-lg p-3">
                {/* <img
                  src={img}
                  className="h-40 w-full object-contain mb-2 rounded"
                  alt={`Color ${idx + 1}`}
                /> */}
<div className="relative">
  <img
    src={img}
    alt={` ${idx + 1}`}
    className="h-40 w-full object-contain mb-2 rounded"
  />

  {/* WATERMARK */}
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <span className="text-white/30 text-2xl font-bold rotate-[-30deg] select-none">
      Venkateshwara silks
    </span>
  </div>
</div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(idx)}
                  />
                  Select
                </label>

                {isSelected && (
                  <input
                    type="text"
                    inputMode="numeric"
                    value={selected[idx] ?? ""}
                    onChange={(e) =>
                      updateQuantity(idx, e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                    placeholder="Quantity"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={sendToWhatsApp}
            className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold"
          >
            Send Order on WhatsApp
          </button>

          <button
            onClick={onClose}
            className="flex-1 border py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}