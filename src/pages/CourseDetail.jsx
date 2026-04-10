import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  saveCourseDetail,
  getCourseDetailById,
  updateCourseDetail,
} from "../utils/mockStorage";
import toast from "react-hot-toast";

const imageOptions = [
  {
    url: "https://corportal.s3.ap-south-1.amazonaws.com/upload/pedagody/RealCaseScenaios.svg",
  },
  {
    url: "https://corportal.s3.ap-south-1.amazonaws.com/upload/pedagody/Reflective.svg",
  },
  {
    url: "https://corportal.s3.ap-south-1.amazonaws.com/upload/pedagody/Research.svg",
  },
  {
    url: "https://corportal.s3.ap-south-1.amazonaws.com/upload/pedagody/CaseDiscussion.svg",
  },
  {
    url: "https://corportal.s3.ap-south-1.amazonaws.com/upload/pedagofyAmity/casebased.svg",
  },
  {
    url: "https://corportal.s3.ap-south-1.amazonaws.com/upload/pedagofyAmity/blended-learning+1.svg",
  },
  {
    url: "https://corportal.s3.ap-south-1.amazonaws.com/upload/pedagofyAmity/collaborative.svg",
  },
  {
    url: "https://corportal.s3.ap-south-1.amazonaws.com/upload/pedagofyAmity/Community.svg",
  },
];

export default function CourseDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = location.pathname.includes("edit");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    duration: "",
    period: "",
    price: "",
    category: "",
    subcategory: "",
    mode: [],
    skills: [],
    learning: [],
    pedagogy: [],
    outcome: [],
    courseStructure: [],
    isActive: true,
    coursecardid: id,
  });

  //  const isEdit = Boolean(id)

  // temp states
  const [skillInput, setSkillInput] = useState("");
  const [pedagogyInput, setPedagogyInput] = useState({
    image: "",
    title: "",
    description: "",
  });
  const [learningInput, setLearningInput] = useState("");

  const addLearning = () => {
    if (!learningInput) return;

    setForm((prev) => ({
      ...prev,
      learning: [...prev.learning, learningInput],
    }));

    setLearningInput("");
  };
  const removeLearning = (index) => {
    setForm((prev) => ({
      ...prev,
      learning: prev.learning.filter((_, i) => i !== index),
    }));
  };

  const editLearning = (index, value) => {
    const updated = [...form.learning];
    updated[index] = value;

    setForm({ ...form, learning: updated });
  };

  const handleModeChange = (value) => {
    setForm((prev) => ({
      ...prev,
      mode: prev.mode.includes(value)
        ? prev.mode.filter((m) => m !== value)
        : [...prev.mode, value],
    }));
  };

  const [outcomeInput, setOutcomeInput] = useState({
    title: "",
    description: "",
  });

  const [structureSection, setStructureSection] = useState({
    title: "",
    description: "",
    structure: [],
  });

  const [headingInput, setHeadingInput] = useState({
    heading: "",
    subheading: [],
  });

  const [subInput, setSubInput] = useState("");

  const addSection = () => {
    if (!structureSection.title) return;

    setForm((prev) => ({
      ...prev,
      courseStructure: [...prev.courseStructure, structureSection],
    }));

    setStructureSection({
      title: "",
      description: "",
      structure: [],
    });
  };

  const addHeading = () => {
    if (!headingInput.heading) return;

    setStructureSection((prev) => ({
      ...prev,
      structure: [
        ...prev.structure,
        {
          ...headingInput,
          coursecardid: id,
        },
      ],
    }));

    setHeadingInput({ heading: "", subheading: [] });
  };

  const addSubheading = () => {
    if (!subInput) return;

    setHeadingInput((prev) => ({
      ...prev,
      subheading: [...prev.subheading, subInput],
    }));

    setSubInput("");
  };

  //   useEffect(() => {
  //   if (id) {
  //     fetchCourseDetail();
  //   }
  // }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchCourseDetail();
    }
  }, [id, isEdit]);

  const fetchCourseDetail = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/course-detail/${id}`,
      );

      const data = res.data.data;

      setForm({
        title: data.title || "",
        subtitle: data.subtitle || "",
        duration: data.duration || "",
        period: data.period || "",
        price: data.price || "",
        category: data.category || "",
        subcategory: data.subcategory || "",
        mode: data.mode || [],
        skills: data.skills || [],
        learning: data.learning || [],
        pedagogy: data.pedagogy || [],
        outcome: data.outcome || [],
        courseStructure: data.courseStructure || [],
        isActive: data.isActive ?? true,
        coursecardid: data.coursecardid?._id || id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SKILLS
  const addSkill = () => {
    if (!skillInput) return;
    setForm({ ...form, skills: [...form.skills, skillInput] });
    setSkillInput("");
  };

  // 🔥 PEDAGOGY
  const addPedagogy = () => {
    if (!pedagogyInput.title || !pedagogyInput.image) return;

    setForm((prev) => ({
      ...prev,
      pedagogy: [...prev.pedagogy, pedagogyInput],
    }));

    setPedagogyInput({ image: "", title: "", description: "" });
  };

  // 🔥 OUTCOME
  const addOutcome = () => {
    if (!outcomeInput.title) return;

    setForm((prev) => ({
      ...prev,
      outcome: [...prev.outcome, outcomeInput],
    }));

    setOutcomeInput({ title: "", description: "" });
  };

  const removeSkill = (index) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const editSkill = (index, value) => {
    const updated = [...form.skills];
    updated[index] = value;

    setForm({ ...form, skills: updated });
  };

  const removePedagogy = (index) => {
    setForm((prev) => ({
      ...prev,
      pedagogy: prev.pedagogy.filter((_, i) => i !== index),
    }));
  };

  const editPedagogy = (index, field, value) => {
    const updated = [...form.pedagogy];
    updated[index][field] = value;

    setForm({ ...form, pedagogy: updated });
  };

  const removeOutcome = (index) => {
    setForm((prev) => ({
      ...prev,
      outcome: prev.outcome.filter((_, i) => i !== index),
    }));
  };

  const editOutcome = (index, field, value) => {
    const updated = [...form.outcome];
    updated[index][field] = value;

    setForm({ ...form, outcome: updated });
  };

  const removeSection = (sectionIndex) => {
    setForm((prev) => ({
      ...prev,
      courseStructure: prev.courseStructure.filter(
        (_, i) => i !== sectionIndex,
      ),
    }));
  };

  const removeHeading = (sectionIndex, headingIndex) => {
    const updated = [...form.courseStructure];

    updated[sectionIndex].structure = updated[sectionIndex].structure.filter(
      (_, i) => i !== headingIndex,
    );

    setForm({ ...form, courseStructure: updated });
  };

  const editSectionDescription = (index, value) => {
    const updated = [...form.courseStructure];
    updated[index].description = value;

    setForm({ ...form, courseStructure: updated });
  };

  const validateForm = () => {
    if (!form.title) return "Title is required";
    if (!form.subtitle) return "Subtitle is required";
    if (!form.duration) return "Duration is required";
    if (!form.mode.length) return "Select at least one mode";
    if (!form.price) return "Price is required";
    if (form.price <= 0) return "Price must be greater than 0";
    if (!form.period) return "Period is required";
    if (!form.category) return "Category is required";
    if (!form.subcategory) return "Subcategory is required";
    if (!form.skills.length) return "Add at least one skill";
    if (!form.learning.length) return "Add at least one learning";
    if (!form.pedagogy.length) return "Add at least one pedagogy";
    if (!form.outcome.length) return "Add at least one outcome";
    if (!form.courseStructure.length) return "Add course structure";

    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return toast.error(error);

    try {
      if (isEdit) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/admin/courses/${id}`,
          form,
        );

        toast.success("Detail updated");
        navigate("/home");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/courses`, form);

        toast.success("Detail added");
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">Course Detail</h2>

      {/* BASIC */}
      <input
        name="title"
        value={form.title}
        placeholder="Title"
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        name="subtitle"
        value={form.subtitle}
        placeholder="Subtitle"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* MODE Checkbox */}
      <div className="flex gap-4">
        {["online", "offline", "hybrid"].map((m) => (
          <label key={m} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={form.mode.includes(m)}
              onChange={() => handleModeChange(m)}
            />
            {m}
          </label>
        ))}
      </div>

      {/* 🔥 DURATION DROPDOWN */}
      <select
        name="duration"
        value={form.duration}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Select Duration</option>
        <option value="30">30 Hours</option>
        <option value="30-40">30-40 Hours</option>
        <option value="50">50 Hours</option>
        <option value="60">60 Hours</option>
        <option value="80-90">80-90 Hours</option>
        <option value="90">90 Hours</option>
        <option value="120">120 Hours</option>
        <option value="150">150 Hours</option>
        <option value="180">180 Hours</option>
        <option value="240">240 Hours</option>
      </select>

      {/* 🔥 PRICE */}
      <input
        type="number"
        name="price"
        value={form.price}
        placeholder="Price"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* 🔥 PERIOD */}
      <input
        type="number"
        name="period"
        value={form.period}
        placeholder="Period (in days/months)"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* 🔥 CATEGORY */}
      <input
        type="text"
        name="category"
        value={form.category}
        placeholder="Category"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* 🔥 SUBCATEGORY */}
      <input
        type="text"
        name="subcategory"
        value={form.subcategory}
        placeholder="Subcategory"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      {/* 🔥 SKILLS */}
      <div>
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add Skill"
          className="border p-2 rounded"
        />
        <button
          onClick={addSkill}
          className="bg-[#FAAD14] px-3 py-2 font-bold rounded-md ml-2"
        >
          Add
        </button>

        <div className="flex gap-2 mt-2 flex-wrap">
          {form.skills.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={s}
                onChange={(e) => editSkill(i, e.target.value)}
                className="border p-1 rounded"
              />

              <button onClick={() => removeSkill(i)} className="text-red-500">
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 LEARNING */}
      <div>
        <h3 className="font-bold mb-1">Learning</h3>

        <div className="flex gap-2">
          <input
            value={learningInput}
            onChange={(e) => setLearningInput(e.target.value)}
            placeholder="Add Learning"
            className="border p-2 rounded w-full"
          />

          <button
            onClick={addLearning}
            className="bg-[#FAAD14] px-3 rounded font-bold"
          >
            Add
          </button>
        </div>

        {/* LIST */}
        <div className="mt-3 flex flex-col gap-2">
          {form.learning.map((l, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={l}
                onChange={(e) => editLearning(i, e.target.value)}
                className="border p-1 rounded w-full"
              />

              <button
                onClick={() => removeLearning(i)}
                className="text-red-500 font-bold"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 PEDAGOGY */}
      <div>
        <h3 className="font-bold">Pedagogy</h3>

        <div className="grid grid-cols-4 gap-3 mb-3">
          {imageOptions.map((img, i) => (
            <div
              key={i}
              onClick={() =>
                setPedagogyInput({ ...pedagogyInput, image: img.url })
              }
              className={`border p-2 rounded cursor-pointer flex items-center justify-center
        ${
          pedagogyInput.image === img.url
            ? "border-[#FAAD14] ring-2 ring-[#FAAD14]"
            : "border-gray-200"
        }`}
            >
              <img src={img.url} alt="" className="w-10 h-10 object-contain" />
            </div>
          ))}
        </div>

        <input
          placeholder="Title"
          value={pedagogyInput.title}
          onChange={(e) =>
            setPedagogyInput({ ...pedagogyInput, title: e.target.value })
          }
        />
        <input
          placeholder="Description"
          value={pedagogyInput.description}
          onChange={(e) =>
            setPedagogyInput({ ...pedagogyInput, description: e.target.value })
          }
        />

        <button onClick={addPedagogy}>Add More</button>

        <div className="mt-3 flex flex-col gap-2">
          {form.pedagogy.map((p, i) => (
            <div key={i} className="border p-3 rounded flex flex-col gap-2">
              <img src={p.image} className="w-10 h-10" />

              <input
                value={p.title}
                onChange={(e) => editPedagogy(i, "title", e.target.value)}
              />

              <input
                value={p.description}
                onChange={(e) => editPedagogy(i, "description", e.target.value)}
              />

              <button
                onClick={() => removePedagogy(i)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 OUTCOME */}
      <div>
        <h3 className="font-bold">Outcome</h3>

        <input
          placeholder="Title"
          value={outcomeInput.title}
          onChange={(e) =>
            setOutcomeInput({ ...outcomeInput, title: e.target.value })
          }
        />
        <input
          placeholder="Description"
          value={outcomeInput.description}
          onChange={(e) =>
            setOutcomeInput({ ...outcomeInput, description: e.target.value })
          }
        />

        <button onClick={addOutcome}>Add More</button>

        <div className="mt-3 flex flex-col gap-2">
          {form.outcome.map((o, i) => (
            <div key={i} className="border p-3 rounded">
              <input
                value={o.title}
                onChange={(e) => editOutcome(i, "title", e.target.value)}
              />

              <input
                value={o.description}
                onChange={(e) => editOutcome(i, "description", e.target.value)}
              />

              <button onClick={() => removeOutcome(i)} className="text-red-500">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 COURSE STRUCTURE */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold text-lg mb-2">Course Structure</h3>

        {/* SECTION */}
        <input
          placeholder="Section Title"
          value={structureSection.title}
          onChange={(e) =>
            setStructureSection({ ...structureSection, title: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
        />

        <input
          placeholder="Section Description"
          value={structureSection.description}
          onChange={(e) =>
            setStructureSection({
              ...structureSection,
              description: e.target.value,
            })
          }
          className="border p-2 rounded w-full mb-3"
        />

        {/* HEADING */}
        <input
          placeholder="Heading"
          value={headingInput.heading}
          onChange={(e) =>
            setHeadingInput({ ...headingInput, heading: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
        />

        {/* SUBHEADING */}
        <div className="flex gap-2 mb-2">
          <input
            placeholder="Subheading"
            value={subInput}
            onChange={(e) => setSubInput(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={addSubheading}
            className="bg-[#FAAD14] px-3 rounded font-bold"
          >
            Add
          </button>
        </div>

        {/* SHOW SUBHEADINGS */}
        <div className="flex flex-wrap gap-2 mb-3">
          {headingInput.subheading.map((s, i) => (
            <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">
              {s}
            </span>
          ))}
        </div>

        {/* ADD HEADING */}
        <button
          onClick={addHeading}
          className="bg-black text-white px-4 py-2 rounded mb-3"
        >
          Add Heading
        </button>

        {/* SHOW HEADINGS */}
        <div className="flex flex-col gap-2 mb-4">
          {structureSection.structure.map((h, i) => (
            <div key={i} className="border p-2 rounded bg-gray-50">
              <div className="font-semibold">{h.heading}</div>
              <div className="text-sm text-gray-600">
                {h.subheading.join(", ")}
              </div>
            </div>
          ))}
        </div>

        {/* ADD SECTION */}
        <button
          onClick={addSection}
          className="bg-[#FAAD14] px-4 py-2 rounded font-bold"
        >
          Add Section
        </button>

        {/* SHOW ALL SECTIONS */}
        <div className="mt-4 flex flex-col gap-4">
          {form.courseStructure.map((sec, si) => (
            <div key={si} className="border p-4 rounded">
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <input
                  value={sec.title}
                  onChange={(e) => {
                    const updated = [...form.courseStructure];
                    updated[si].title = e.target.value;
                    setForm({ ...form, courseStructure: updated });
                  }}
                  className="font-bold text-lg border-b outline-none"
                />

                <button
                  onClick={() => removeSection(si)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </div>

              {/* 🔥 DESCRIPTION FIELD (NEW) */}
              <textarea
                value={sec.description || ""}
                onChange={(e) => editSectionDescription(si, e.target.value)}
                placeholder="Section Description"
                className="border p-2 rounded w-full mt-2"
              />

              {/* HEADINGS */}
              {sec.structure.map((item, hi) => (
                <div key={hi} className="bg-gray-100 p-2 mt-2 rounded">
                  <div className="flex justify-between">
                    <span>{item.heading}</span>

                    <button onClick={() => removeHeading(si, hi)}>❌</button>
                  </div>

                  <div className="text-sm">{item.subheading.join(", ")}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        disabled={!form.title}
        onClick={handleSubmit}
        className="bg-[#FAAD14] py-2 font-bold"
      >
        Save
      </button>
    </div>
  );
}
