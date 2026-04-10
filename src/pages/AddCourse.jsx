import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddCourse() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    badge: "",
    heading: "",
    subheading: "",
    currentAcademicProgram: "",
    description: "",
    hours: [],
  });

  useEffect(() => {
    if (id) {
      fetchCourseCard();
    }
  }, [id]);

  const fetchCourseCard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/course-detail/course-card/${id}`,
      );

      const data = res.data.data;

      setForm({
        badge: data.badge || "",
        heading: data.heading || "",
        subheading: data.subheading || "",
        currentAcademicProgram: data.currentAcademicProgram || "",
        description: data.description || "",
        hours: data.hours || [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (value) => {
    setForm((prev) => ({
      ...prev,
      hours: prev.hours.includes(value)
        ? prev.hours.filter((h) => h !== value)
        : [...prev.hours, value],
    }));
  };

  const validateForm = () => {
    if (!form.badge) return "Badge is required";
    if (!form.heading) return "Heading is required";
    if (!form.subheading) return "Subheading is required";
    if (!form.currentAcademicProgram) return "Program is required";
    if (!form.description) return "Description is required";
    if (!form.hours.length) return "Select at least one hour";

    return null;
  };

  // const handleSubmit = async () => {
  //   const error = validateForm();
  //   if (error) {
  //   toast.error(error);
  //   return;
  // }
  //   let savedId = id;

  //   if (isEdit) {
  //     updateCourse(id, form);

  //     // 👉 API UPDATE
  //     await axios.patch(`${import.meta.env.VITE_API_URL}/course-card/${id}`, form)

  //   } else {
  //     const saved = saveCourseCard(form);
  //     savedId = saved._id;

  //     // 👉 API CREATE
  //     const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/course-cards`, form);
  //     console.log(res,"hai")
  //     navigate(`/course-detail/${res.data.data._id}`);
  //   }
  //    console.log("Card form ka data submit ke baad",form);
  //    toast.success("Saved Successfully");

  // };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    try {
      let savedId = id;

      if (isEdit) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/admin/course-cards/${id}`,
          form,
        );

        toast.success("Course updated");

        navigate(`/course-detail/edit/${id}`); // 🔥 EDIT FLOW
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/course-cards`,
          form,
        );

        savedId = res.data.data._id;

        toast.success("Course created");

        navigate(`/course-detail/add/${savedId}`); // 🔥 ADD FLOW
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Course" : "Add Course"}
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the course details below
          </p>
        </div>

        {/* Inputs Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="badge"
            value={form.badge}
            placeholder="Badge"
            onChange={handleChange}
            required
            className="border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none p-3 rounded-lg transition-all"
          />

          <input
            name="heading"
            value={form.heading}
            placeholder="Heading"
            onChange={handleChange}
            required
            className="border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none p-3 rounded-lg transition-all"
          />

          <input
            name="subheading"
            required
            value={form.subheading}
            placeholder="Subheading"
            onChange={handleChange}
            className="md:col-span-2 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none p-3 rounded-lg transition-all"
          />

          {/* Dropdown */}
          <select
            name="currentAcademicProgram"
            value={form.currentAcademicProgram}
            onChange={handleChange}
            required
            className="md:col-span-2 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none p-3 rounded-lg bg-white transition-all"
          >
            <option value="">Select Program</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
            <option value="early career professional">Early Career</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            required
            onChange={handleChange}
            className="md:col-span-2 border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none p-3 rounded-lg min-h-[120px] transition-all"
          />
        </div>

        {/* Hours Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Select Course Hours
          </label>

          <div className="flex flex-wrap gap-3">
            {[30, 40, 50, 60, 80, 90, 120, 150, 180, 240].map((h) => (
              <label
                key={h}
                className={`cursor-pointer px-4 py-2 rounded-full border text-sm transition-all
              ${
                form.hours.includes(h)
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-yellow-100"
              }`}
              >
                <input
                  type="checkbox"
                  checked={form.hours.includes(h)}
                  onChange={() => handleCheckbox(h)}
                  className="hidden"
                  required
                />
                {h} hrs
              </label>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          {isEdit ? "Update & Next" : "Next"}
        </button>
      </div>
    </div>
  );
}

// {/* <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
//   <h2 className="text-xl font-bold">{isEdit ? "Edit Course" : "Add Course"}</h2>

//   <input
//     name="badge"
//     value={form.badge}
//     placeholder="Badge"
//     onChange={handleChange}
//     required
//     className="border p-2 rounded"
//   />

//   <input
//     name="heading"
//     value={form.heading}
//     placeholder="Heading"
//     onChange={handleChange}
//     required
//     className="border p-2 rounded"
//   />

//   <input
//     name="subheading"
//     required
//     value={form.subheading}
//     placeholder="Subheading"
//     onChange={handleChange}
//     className="border p-2 rounded"
//   />

//   {/* Dropdown */}
//   <select
//     name="currentAcademicProgram"
//     value={form.currentAcademicProgram}
//     onChange={handleChange}
//     className="border p-2 rounded"
//     required
//   >
//     <option value="">Select Program</option>
//     <option value="undergraduate">Undergraduate</option>
//     <option value="postgraduate">Postgraduate</option>
//     <option value="early career professional">Early Career</option>
//   </select>

//   <textarea
//     name="description"
//     value={form.description}
//     placeholder="Description"
//     required
//     onChange={handleChange}
//     className="border p-2 rounded"
//   />

//   {/* Hours Checkbox */}
//   <div className="flex gap-4">
//     {[30, 50, 60, 80, 90, 120, 150, 180, 240].map((h) => (
//       <label key={h} className="flex items-center gap-1">
//         <input
//           type="checkbox"
//           checked={form.hours.includes(h)}
//           onChange={() => handleCheckbox(h)}
//           required
//         />
//         {h}
//       </label>
//     ))}
//   </div>

//   <button
//     onClick={handleSubmit}
//     className="bg-[#FAAD14] text-black font-bold py-2 rounded hover:opacity-90"
//   >
//     {isEdit ? "Update & Next" : "Next"}
//   </button>
// </div>; */}
