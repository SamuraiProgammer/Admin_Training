import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-";

export default function OfferRegistrations() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/admin/offers/${id}/registrations`);
        setOffer(res.data.offer);
        setRegistrations(res.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Registrations load nahi hui");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [id]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <button
            onClick={() => navigate("/offers")}
            className="mb-3 text-sm font-semibold text-gray-500 hover:text-black"
          >
            ← Back to Offers
          </button>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Enrolled Users</p>
          <h1 className="text-3xl font-bold text-gray-900">
            {offer?.heroTitle || "Offer Registrations"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Har user ne kaunsa batch select kiya, payment hua ya nahi, sab yahan dikhega.
          </p>
        </div>

        {offer && (
          <button
            onClick={() => navigate(`/offers/${offer._id}/edit`)}
            className="rounded-xl bg-[#FAAD14] px-5 py-3 text-sm font-bold text-black transition hover:opacity-90"
          >
            Edit Offer
          </button>
        )}
      </div>

      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading registrations...</div>
        ) : registrations.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Abhi tak koi registration nahi hai</h2>
            <p className="mt-2 text-sm text-gray-600">
              Offer live hone ke baad paid users yahin par list ho jayenge.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Batch</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Program</th>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration._id} className="border-b last:border-b-0">
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-gray-900">
                        {registration.applicant?.name}
                      </div>
                      <div className="text-gray-600">{registration.applicant?.email}</div>
                      <div className="text-gray-500">{registration.applicant?.phone_no}</div>
                      <div className="mt-1 text-gray-500">{registration.applicant?.college}</div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-gray-900">
                        {registration.batchTitleSnapshot}
                      </div>
                      <div className="text-gray-600">
                        {formatDateTime(registration.batchStartAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          registration.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : registration.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {registration.paymentStatus}
                      </span>
                      <div className="mt-2 font-semibold text-gray-900">
                        ₹{registration.amount} {registration.currency}
                      </div>
                      <div className="text-gray-500">
                        {registration.paymentMode === "mock" ? "Mock checkout" : "Razorpay"}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-gray-700">
                      {registration.applicant?.currentAcademicProgram}
                    </td>
                    <td className="px-4 py-4 align-top text-gray-600">
                      <div className="font-semibold text-gray-900">
                        {registration.registrationCode}
                      </div>
                      <div className="break-all text-xs">
                        {registration.razorpayPaymentId || registration.razorpayOrderId || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-gray-600">
                      {formatDateTime(registration.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
