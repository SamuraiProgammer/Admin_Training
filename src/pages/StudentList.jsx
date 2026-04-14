import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

export default function StudentList() {
  const [activeTab, setActiveTab] = useState("regular");
  const [users, setUsers] = useState([]);
  const [previewRegistrations, setPreviewRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, previewRes] = await Promise.all([
        axios.get(`${apiUrl}/auth`),
        axios.get(`${apiUrl}/admin/preview-registrations`),
      ]);

      setUsers(usersRes.data.data || []);
      setPreviewRegistrations(previewRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Student data load nahi hui");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const previewTotals = useMemo(() => {
    return previewRegistrations.reduce(
      (acc, registration) => {
        acc.count += 1;
        if (registration.paymentStatus === "paid") {
          acc.paid += 1;
          acc.revenue += registration.amount || 0;
        }
        return acc;
      },
      { count: 0, paid: 0, revenue: 0 }
    );
  }, [previewRegistrations]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Is user ko delete karna hai?")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/auth/${id}`);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "User delete nahi hua");
    }
  };

  const handleDeletePreviewRegistration = async (id) => {
    if (!window.confirm("Do You Want To Delete This Preview Registration!!")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/admin/preview-registrations/${id}`);
      toast.success("Preview registration deleted");
      setPreviewRegistrations((prev) =>
        prev.filter((registration) => registration._id !== id)
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Preview registration delete nahi hua"
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Students & Registrations
          </p>
          <h1 className="text-3xl font-bold text-gray-900">All learners in one place</h1>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-black/5">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Regular</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-black/5">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Preview</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{previewTotals.count}</div>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-black/5">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Revenue</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">₹{previewTotals.revenue}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {[
          { label: "Regular Users", value: "regular" },
          { label: "2 Hour Preview", value: "preview" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.value
                ? "bg-[#FAAD14] text-black"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading student data...</div>
        ) : activeTab === "regular" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Phone</th>
                  <th className="p-4 font-semibold">College</th>
                  <th className="p-4 font-semibold">Program</th>
                  <th className="p-4 font-semibold">Registered On</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b last:border-b-0">
                    <td className="p-4 font-medium text-gray-900">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phone_no}</td>
                    <td className="p-4 text-gray-600">{user.college}</td>
                    <td className="p-4 text-gray-600">{user.currentAcademicProgram}</td>
                    <td className="p-4 text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="rounded-xl bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Offer</th>
                  <th className="p-4 font-semibold">Batch</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Reference</th>
                  <th className="p-4 font-semibold">Created</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {previewRegistrations.map((registration) => (
                  <tr key={registration._id} className="border-b last:border-b-0">
                    <td className="p-4 align-top">
                      <div className="font-medium text-gray-900">
                        {registration.applicant?.name}
                      </div>
                      <div className="text-gray-600">{registration.applicant?.email}</div>
                      <div className="text-gray-500">{registration.applicant?.phone_no}</div>
                    </td>
                    <td className="p-4 align-top text-gray-600">
                      {registration.offerTitleSnapshot}
                    </td>
                    <td className="p-4 align-top text-gray-600">
                      <div className="font-medium text-gray-900">
                        {registration.batchTitleSnapshot}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(registration.batchStartAt)}
                      </div>
                    </td>
                    <td className="p-4 align-top">
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
                      <div className="mt-2 text-sm font-semibold text-gray-900">
                        ₹{registration.amount}
                      </div>
                    </td>
                    <td className="p-4 align-top text-gray-600">
                      <div className="font-medium text-gray-900">
                        {registration.registrationCode}
                      </div>
                      <div className="break-all text-xs">
                        {registration.razorpayPaymentId || registration.razorpayOrderId || "-"}
                      </div>
                    </td>
                    <td className="p-4 align-top text-gray-600">
                      {formatDate(registration.createdAt)}
                    </td>
                    <td className="p-4 align-top">
                      <button
                        onClick={() => handleDeletePreviewRegistration(registration._id)}
                        className="rounded-xl bg-red-100 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-200"
                      >
                        Delete
                      </button>
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
