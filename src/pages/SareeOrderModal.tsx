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
    [key: number]: number; // index -> quantity
  }>({});

  const toggleSelection = (index: number) => {
    setSelected((prev) => {
      if (prev[index]) {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      } else {
        return { ...prev, [index]: 1 };
      }
    });
  };

  const updateQuantity = (index: number, qty: number) => {
    setSelected((prev) => ({
      ...prev,
      [index]: qty,
    }));
  };

  const sendToWhatsApp = () => {
    const selectedEntries = Object.entries(selected);

    if (selectedEntries.length === 0) {
      alert("Please select at least one color");
      return;
    }

    let colorDetails = selectedEntries
      .map(
        ([index, qty], i) =>
          `${i + 1}. Color ${Number(index) + 1} - Qty: ${qty}`
      )
      .join("\n");

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
            const isSelected = selected[idx];

            return (
              <div key={idx} className="border rounded-lg p-3">
                <img
                  src={img}
                  className="h-40 w-full object-contain mb-2 rounded"
                  alt={`Color ${idx + 1}`}
                />

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={!!isSelected}
                    onChange={() => toggleSelection(idx)}
                  />
                  Select
                </label>

                {isSelected && (
                  <input
                    type="number"
                    min={1}
                    value={isSelected}
                    onChange={(e) =>
                      updateQuantity(idx, Number(e.target.value))
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
