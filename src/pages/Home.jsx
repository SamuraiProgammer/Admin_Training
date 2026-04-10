import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CourseCard from "../components/CourseCard";

const apiUrl = import.meta.env.VITE_API_URL;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ugRes, pgRes, earlyRes, dashboardRes] = await Promise.all([
        axios.get(`${apiUrl}/course-detail/ug`),
        axios.get(`${apiUrl}/course-detail/pg`),
        axios.get(`${apiUrl}/course-detail/early-career`),
        axios.get(`${apiUrl}/admin/dashboard`),
      ]);

      setCourses([
        ...(ugRes.data.data || []),
        ...(pgRes.data.data || []),
        ...(earlyRes.data.data || []),
      ]);
      setDashboard(dashboardRes.data.data || null);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Dashboard load nahi hua");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCourses =
    activeTab === "all"
      ? courses
      : courses.filter((course) => course.currentAcademicProgram === activeTab);

  const totals = dashboard?.totals;

  const summaryCards = useMemo(
    () => [
      {
        label: "Total Users",
        value: totals?.totalUsers || 0,
        tone: "bg-slate-100 text-slate-800",
      },
      {
        label: "Preview Registrations",
        value: totals?.previewRegistrations || 0,
        tone: "bg-amber-100 text-amber-800",
      },
      {
        label: "Paid Preview Users",
        value: totals?.paidPreviewRegistrations || 0,
        tone: "bg-emerald-100 text-emerald-800",
      },
      {
        label: "Total Revenue",
        value: formatCurrency(totals?.totalRevenue || 0),
        tone: "bg-violet-100 text-violet-800",
      },
      {
        label: "Course Cards",
        value: totals?.totalCourseCards || 0,
        tone: "bg-sky-100 text-sky-800",
      },
      {
        label: "Course Details",
        value: totals?.totalCourses || 0,
        tone: "bg-rose-100 text-rose-800",
      },
    ],
    [totals]
  );

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`${apiUrl}/admin/course-cards/${id}`);
      toast.success("Course deleted successfully");
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-8 p-6">
      {loading && <div className="rounded-2xl bg-white p-5 shadow">Loading dashboard...</div>}

      {!loading && dashboard && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((item) => (
              <div key={item.label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${item.tone}`}>
                  {item.label}
                </div>
                <div className="mt-4 text-3xl font-bold text-gray-900">{item.value}</div>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Offer Breakdown
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    Batch-wise preview revenue
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/offers")}
                  className="text-sm font-bold text-[#FAAD14]"
                >
                  Manage Offers →
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {(dashboard.offerBreakdown || []).length === 0 ? (
                  <p className="text-sm text-gray-600">Abhi tak koi paid preview registration nahi hai.</p>
                ) : (
                  dashboard.offerBreakdown.map((offer) => (
                    <div key={offer.offerId} className="rounded-3xl bg-[#faf8f5] p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-bold text-gray-900">{offer.offerTitle}</div>
                          <div className="mt-1 text-sm text-gray-600">
                            {offer.totalRegistrations} paid registrations
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                          <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                            Revenue
                          </div>
                          <div className="mt-1 text-xl font-bold text-gray-900">
                            {formatCurrency(offer.totalRevenue)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {offer.batches.map((batch) => (
                          <div key={batch.batchId} className="rounded-2xl bg-white p-4">
                            <div className="font-semibold text-gray-900">{batch.batchTitle}</div>
                            <div className="mt-2 text-sm text-gray-600">
                              {batch.registrations} registrations
                            </div>
                            <div className="mt-1 text-sm font-bold text-gray-900">
                              {formatCurrency(batch.revenue)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                      Latest Preview Users
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                      Recent paid and pending joins
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate("/student-list")}
                    className="text-sm font-bold text-[#FAAD14]"
                  >
                    Open Student List →
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {(dashboard.latestPreviewRegistrations || []).length === 0 ? (
                    <p className="text-sm text-gray-600">No preview registrations yet.</p>
                  ) : (
                    dashboard.latestPreviewRegistrations.map((registration) => (
                      <div key={registration._id} className="rounded-2xl bg-[#faf8f5] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {registration.applicant?.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {registration.batchTitleSnapshot}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              registration.paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {registration.paymentStatus}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {registration.applicant?.email}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Latest Users
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Standard form registrations
                </h2>
                <div className="mt-5 space-y-3">
                  {(dashboard.latestUsers || []).length === 0 ? (
                    <p className="text-sm text-gray-600">No standard users found.</p>
                  ) : (
                    dashboard.latestUsers.map((user) => (
                      <div key={user._id} className="rounded-2xl bg-[#faf8f5] p-4">
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="mt-1 text-sm text-gray-600">{user.email}</div>
                        <div className="mt-1 text-xs text-gray-500">
                          {user.currentAcademicProgram} | {user.college}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Course Management
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Cards and linked course detail</h2>
          </div>
          <button
            onClick={() => navigate("/add-course")}
            className="rounded-2xl bg-[#FAAD14] px-5 py-3 text-sm font-bold text-black transition hover:opacity-90"
          >
            Add Course
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {[
            { label: "All", value: "all" },
            { label: "Undergraduate", value: "undergraduate" },
            { label: "Postgraduate", value: "postgraduate" },
            { label: "Early Career", value: "early career professional" },
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

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} card={course} onDelete={handleDeleteCourse} />
          ))}
        </div>
      </section>
    </div>
  );
}
