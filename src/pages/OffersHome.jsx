import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;
const publicAppUrl = import.meta.env.VITE_PUBLIC_APP_URL || "http://localhost:5173";

export default function OffersHome() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/admin/offers`);
      setOffers(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Offers load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Is offer ko delete karna hai?")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/admin/offers/${id}`);
      toast.success("Offer delete ho gaya");
      setOffers((prev) => prev.filter((offer) => offer._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Offer delete nahi hua");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Preview Offer Admin
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Offers & Preview Sessions
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            From here, you can manage the complete copy, batches, pricing, and registrations for live offers such as the '2-Hour Preview'.
          </p>
        </div>

        <button
          onClick={() => navigate("/offers/new")}
          className="rounded-xl bg-[#FAAD14] px-5 py-3 text-sm font-bold text-black transition hover:opacity-90"
        >
          New Offer
        </button>
      </div>

      {loading && <div className="rounded-2xl bg-white p-5 shadow">Loading offers...</div>}

      {!loading && offers.length === 0 && (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">No Offer Available!!</h2>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-black px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                    {offer.badge || "Offer"}
                  </span>
                  {offer.isFeatured && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
                      Featured
                    </span>
                  )}
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      offer.isActive
                        ? "bg-sky-100 text-sky-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {offer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900">{offer.cardTitle}</h2>
                <p className="text-sm font-semibold text-[#FAAD14]">{offer.cardSubtitle}</p>
                <p className="text-sm leading-6 text-gray-600">{offer.cardDescription}</p>
              </div>

              <div className="rounded-2xl bg-[#fff7e5] px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Price
                </div>
                <div className="text-2xl font-bold text-gray-900">₹{offer.price}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Registrations
                </div>
                <div className="mt-1 text-xl font-bold text-gray-900">
                  {offer.registrationsCount || 0}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Batches
                </div>
                <div className="mt-1 text-xl font-bold text-gray-900">
                  {offer.batches?.length || 0}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Slug
                </div>
                <div className="mt-1 truncate text-sm font-semibold text-gray-900">
                  /offers/{offer.slug}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => window.open(`${publicAppUrl}/offers/${offer.slug}`, "_blank")}
                className="rounded-xl border border-[#FAAD14] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#FAAD14]"
              >
                Preview Public Page
              </button>
              <button
                onClick={() => navigate(`/offers/${offer._id}/registrations`)}
                className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
              >
                View Registrations
              </button>
              <button
                onClick={() => navigate(`/offers/${offer._id}/edit`)}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-200"
              >
                Edit Offer
              </button>
              <button
                onClick={() => handleDelete(offer._id)}
                className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
