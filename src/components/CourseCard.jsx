import { useNavigate } from "react-router-dom";

export default function CourseCard({ card, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      {/* Badge */}
      <div className="flex justify-between items-start">
        <span className="bg-black text-white text-[11px] font-bold px-4 py-1.5 rounded-full">
          {card.badge}
        </span>

        <span className="text-[10px] font-semibold px-2 py-1 rounded bg-[#FAAD14]">
          {card.currentAcademicProgram}
        </span>
      </div>

      {/* Heading */}
      <h3 className="text-lg font-bold text-gray-900 leading-tight">
        {card.heading}
      </h3>

      {/* Subheading */}
      <p className="text-xs font-semibold text-[#FAAD14]">{card.subheading}</p>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {card.description}
      </p>

      {/* Hours */}
      <div className="text-sm font-semibold text-gray-900 py-2 border-y">
        {card.hours?.join(", ")} Hours
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        {/* Explore */}
        <button
          onClick={() => navigate(`/course-view/${card._id}`)}
          className="flex-1 py-2 rounded-md border-2 border-[#FAAD14] text-sm font-bold hover:bg-[#FAAD14] transition"
        >
          Explore
        </button>

        {/* Edit */}
        <button
          onClick={() => navigate(`/add-course/${card._id}`)}
          className="px-3 py-2 rounded-md text-sm font-bold bg-gray-100 hover:bg-gray-200"
        >
          Edit
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(card._id)}
          className="px-3 py-2 rounded-md text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
