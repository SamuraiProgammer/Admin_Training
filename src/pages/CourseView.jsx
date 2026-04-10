import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import Navbar from "../components/Navbar";
import axios from "axios";

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/course-detail/${id}`,
      );

      setCourse(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const card = course?.coursecardid;
  console.log(course, "course hai");

  if (loading) return <div className="p-6">Loading...</div>;

  if (!course) return <div className="p-6">No Data Found</div>;

  return (
    <>
      {/* <Navbar /> */}

      <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
        {/* 🔥 HERO SECTION */}
        {card && (
          <div className="bg-white p-6 rounded-xl shadow">
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs">
              {card.badge}
            </span>

            <h1 className="text-3xl font-bold mt-3">{card.heading}</h1>

            <p className="text-[#FAAD14] font-semibold mt-1">
              {card.subheading}
            </p>

            <p className="text-gray-600 mt-3">{card.description}</p>

            <div className="mt-4 font-semibold">
              Hours: {card.hours?.join(", ")}
            </div>
          </div>
        )}

        {/* 🔥 DETAIL */}
        {course ? (
          <>
            {/* BASIC INFO */}
            <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 gap-4">
              <div>
                <strong>Title:</strong> {course.title}
              </div>
              <div>
                <strong>Subtitle:</strong> {course.subtitle}
              </div>
              <div>
                <strong>Duration:</strong> {course.duration}
              </div>
              <div>
                <strong>Period:</strong> {course.period}
              </div>
              <div>
                <strong>Price:</strong> {course.price}
              </div>
              <div>
                <strong>Mode:</strong> {course.mode?.join(", ")}
              </div>
              <div>
                <strong>Category:</strong> {course.category}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {course.isActive ? "Active" : "Inactive"}
              </div>
            </div>

            {/* 🔥 SKILLS */}
            {course.skills?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-lg mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((s, i) => (
                    <span key={i} className="bg-gray-100 px-3 py-1 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {course.learning?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-lg mb-3">Learning</h2>

                <div className="flex flex-wrap gap-2">
                  {course.learning.map((l, i) => (
                    <span key={i} className="bg-gray-100 px-3 py-1 rounded">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 🔥 PEDAGOGY */}
            {course.pedagogy?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-lg mb-4">Pedagogy</h2>

                <div className="grid grid-cols-3 gap-4">
                  {course.pedagogy.map((p, i) => (
                    <div key={i} className="border rounded p-4 text-center">
                      <img
                        src={p.image}
                        alt=""
                        className="w-12 h-12 mx-auto mb-2"
                      />

                      <div className="font-semibold">{p.title}</div>
                      <div className="text-sm text-gray-600">
                        {p.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🔥 OUTCOME */}
            {course.outcome?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-lg mb-3">Outcomes</h2>

                <div className="flex flex-col gap-3">
                  {course.outcome.map((o, i) => (
                    <div key={i} className="border rounded p-3">
                      <div className="font-semibold">{o.title}</div>
                      <div className="text-sm text-gray-600">
                        {o.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🔥 COURSE STRUCTURE */}
            {course.courseStructure?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-bold text-lg mb-4">Course Structure</h2>

                <div className="flex flex-col gap-4">
                  {course.courseStructure.map((section, i) => (
                    <div key={i} className="border rounded p-4">
                      <div className="font-bold text-lg">{section.title}</div>

                      <div className="text-gray-600 mb-2">
                        {section.description}
                      </div>

                      {section.structure.map((item, j) => (
                        <div key={j} className="bg-gray-50 p-2 rounded mb-2">
                          <div className="font-medium">{item.heading}</div>
                          <div className="text-sm">
                            {item.subheading.join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500">No detailed data available.</div>
        )}
      </div>
    </>
  );
}
