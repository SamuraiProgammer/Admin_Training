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
      `${import.meta.env.VITE_API_URL}/course-detail/course-card/${id}`
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
      // 🔥 UPDATE
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/course-cards/${id}`,
        form
      );

      toast.success("Course updated");
    } else {
      // 🔥 CREATE (already hai tera)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/course-cards`,
        form
      );

      savedId = res.data.data._id;

      toast.success("Course created");
    }

    navigate(`/course-detail/${savedId}`);
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">
        {isEdit ? "Edit Course" : "Add Course"}
      </h2>

      <input
        name="badge"
        value={form.badge}
        placeholder="Badge"
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <input
        name="heading"
        value={form.heading}
        placeholder="Heading"
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />

      <input
        name="subheading"
        required
        value={form.subheading}
        placeholder="Subheading"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* Dropdown */}
      <select
        name="currentAcademicProgram"
        value={form.currentAcademicProgram}
        onChange={handleChange}
        className="border p-2 rounded"
        required
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
        className="border p-2 rounded"
      />

      {/* Hours Checkbox */}
      <div className="flex gap-4">
        {[60, 120, 180, 240].map((h) => (
          <label key={h} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={form.hours.includes(h)}
              onChange={() => handleCheckbox(h)}
              required
            />
            {h}
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-[#FAAD14] text-black font-bold py-2 rounded hover:opacity-90"
      >
        {isEdit ? "Update & Next" : "Next"}
      </button>
    </div>
  );
}