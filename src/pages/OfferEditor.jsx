import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const emptyDeliverable = () => ({ title: "", description: "" });
const emptyBatch = () => ({
  title: "",
  description: "",
  startAt: "",
  endAt: "",
  timezoneLabel: "IST",
  mode: "online",
  venue: "",
  seats: 30,
  isActive: true,
});

const initialForm = {
  slug: "2-hour-preview-of-the-training",
  badge: "2 Hour Preview",
  cardTitle: "2 Hour Preview of the Training",
  cardSubtitle: "Live guided preview session",
  cardDescription:
    "Users can reserve a live preview slot, choose their preferred batch, and pay online before confirmation.",
  heroEyebrow: "Limited Preview Offer",
  heroTitle: "2 Hour Preview of the Training",
  heroSubtitle:
    "Share the complete preview promise, make available batches selectable, and collect payment before confirming the seat.",
  price: 500,
  originalPrice: 999,
  currency: "INR",
  buttonText: "Reserve My Spot",
  supportText:
    "Slot confirmation and batch details will be shown immediately after payment.",
  confirmationTitle: "Your preview seat is confirmed",
  confirmationMessage:
    "Payment successful. Keep this confirmation safe and join the selected batch on time.",
  contactWhatsapp: "918448154111",
  highlights: [
    "2 hour live preview session",
    "Batch selection before payment",
    "Admin-controlled copy, pricing, and seats",
  ],
  terms: [
    "Seats are limited and batch-specific.",
    "Payment confirmation is required for seat reservation.",
  ],
  deliverables: [
    {
      title: "Live 2 hour session",
      description:
        "A structured preview of the training experience with faculty guidance.",
    },
    {
      title: "Real session format",
      description:
        "Attendees experience the format, teaching style, and expected learning environment.",
    },
  ],
  batches: [emptyBatch()],
  visibleOnExplore: true,
  isFeatured: true,
  isActive: true,
  displayOrder: 1,
};

const toDateTimeLocal = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const normalizeFetchedOffer = (offer) => ({
  ...initialForm,
  ...offer,
  deliverables:
    offer.deliverables?.length > 0
      ? offer.deliverables.map((item) => ({
          _id: item._id,
          title: item.title || "",
          description: item.description || "",
        }))
      : [emptyDeliverable()],
  batches:
    offer.batches?.length > 0
      ? offer.batches.map((batch) => ({
          ...batch,
          _id: batch._id,
          startAt: toDateTimeLocal(batch.startAt),
          endAt: toDateTimeLocal(batch.endAt),
          timezoneLabel: batch.timezoneLabel || "IST",
          mode: batch.mode || "online",
          venue: batch.venue || "",
          seats: batch.seats || 30,
          isActive: batch.isActive ?? true,
        }))
      : [emptyBatch()],
  highlights: offer.highlights?.length > 0 ? offer.highlights : [""],
  terms: offer.terms?.length > 0 ? offer.terms : [""],
});

const Section = ({ title, subtitle, children }) => (
  <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
    <div className="mb-5">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
    <span>{label}</span>
    {children}
  </label>
);

const inputClassName =
  "w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black";

export default function OfferEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const fetchOffer = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/admin/offers/${id}`);
        setForm(normalizeFetchedOffer(res.data.data));
      } catch (error) {
        console.error(error);
        toast.error("Offer details load nahi hue");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id, isEdit]);

  const publicLink = useMemo(
    () =>
      `${import.meta.env.VITE_PUBLIC_APP_URL || "http://localhost:5173"}/offers/${form.slug}`,
    [form.slug],
  );

  const setValue = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateStringArrayItem = (field, index, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const addStringArrayItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeStringArrayItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        prev[field].length === 1
          ? [""]
          : prev[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateDeliverable = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addDeliverable = () => {
    setForm((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, emptyDeliverable()],
    }));
  };

  const removeDeliverable = (index) => {
    setForm((prev) => ({
      ...prev,
      deliverables:
        prev.deliverables.length === 1
          ? [emptyDeliverable()]
          : prev.deliverables.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateBatch = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      batches: prev.batches.map((batch, batchIndex) =>
        batchIndex === index ? { ...batch, [key]: value } : batch,
      ),
    }));
  };

  const addBatch = () => {
    setForm((prev) => ({
      ...prev,
      batches: [...prev.batches, emptyBatch()],
    }));
  };

  const removeBatch = (index) => {
    setForm((prev) => ({
      ...prev,
      batches:
        prev.batches.length === 1
          ? [emptyBatch()]
          : prev.batches.filter((_, batchIndex) => batchIndex !== index),
    }));
  };

  const buildPayload = () => ({
    ...form,
    price: Number(form.price),
    originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
    displayOrder: Number(form.displayOrder || 0),
    highlights: form.highlights.map((item) => item.trim()).filter(Boolean),
    terms: form.terms.map((item) => item.trim()).filter(Boolean),
    deliverables: form.deliverables
      .map((item) => ({
        _id: item._id,
        title: item.title.trim(),
        description: item.description.trim(),
      }))
      .filter((item) => item.title),
    batches: form.batches.map((batch) => ({
      _id: batch._id,
      title: batch.title.trim(),
      description: batch.description.trim(),
      startAt: batch.startAt,
      endAt: batch.endAt,
      timezoneLabel: batch.timezoneLabel.trim(),
      mode: batch.mode,
      venue: batch.venue.trim(),
      seats: Number(batch.seats),
      isActive: Boolean(batch.isActive),
    })),
  });

  const validate = () => {
    if (!form.slug.trim()) return "Slug required hai";
    if (!form.cardTitle.trim()) return "Card title required hai";
    if (!form.heroTitle.trim()) return "Hero title required hai";
    if (!form.price || Number(form.price) <= 0) return "Valid price enter karo";
    if (!form.batches.length) return "Kam se kam ek batch hona chahiye";

    for (const batch of form.batches) {
      if (!batch.title.trim()) return "Har batch ka title required hai";
      if (!batch.startAt || !batch.endAt)
        return "Har batch ka start/end time required hai";
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload();

      if (isEdit) {
        await axios.patch(`${apiUrl}/admin/offers/${id}`, payload);
        toast.success("Offer Updated Successfully!!");
      } else {
        await axios.post(`${apiUrl}/admin/offers`, payload);
        toast.success("Offer Created Successfully!!");
      }

      navigate("/offers");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Offer Not Saved!!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading offer details...</div>;
  }

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
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Offer Builder
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Preview Offer" : "Create Preview Offer"}
          </h1>
        </div>

        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
          <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Public Link
          </div>
          <div className="mt-1 text-sm font-semibold text-gray-900">
            {publicLink}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Section
            title="Card & Hero Copy"
            subtitle="Ye content public explore page aur offer landing page dono me use hoga."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug">
                <input
                  className={inputClassName}
                  value={form.slug}
                  onChange={(e) => setValue("slug", e.target.value)}
                />
              </Field>
              <Field label="Badge">
                <input
                  className={inputClassName}
                  value={form.badge}
                  onChange={(e) => setValue("badge", e.target.value)}
                />
              </Field>
              <Field label="Card Title">
                <input
                  className={inputClassName}
                  value={form.cardTitle}
                  onChange={(e) => setValue("cardTitle", e.target.value)}
                />
              </Field>
              <Field label="Card Subtitle">
                <input
                  className={inputClassName}
                  value={form.cardSubtitle}
                  onChange={(e) => setValue("cardSubtitle", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Card Description">
              <textarea
                rows={4}
                className={inputClassName}
                value={form.cardDescription}
                onChange={(e) => setValue("cardDescription", e.target.value)}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Hero Eyebrow">
                <input
                  className={inputClassName}
                  value={form.heroEyebrow}
                  onChange={(e) => setValue("heroEyebrow", e.target.value)}
                />
              </Field>
              <Field label="CTA Button Text">
                <input
                  className={inputClassName}
                  value={form.buttonText}
                  onChange={(e) => setValue("buttonText", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Hero Title">
              <input
                className={inputClassName}
                value={form.heroTitle}
                onChange={(e) => setValue("heroTitle", e.target.value)}
              />
            </Field>

            <Field label="Hero Subtitle">
              <textarea
                rows={4}
                className={inputClassName}
                value={form.heroSubtitle}
                onChange={(e) => setValue("heroSubtitle", e.target.value)}
              />
            </Field>
          </Section>

          <Section
            title="Pricing & Status"
            subtitle="Admin featured offer choose karega aur active/inactive yahin se control hoga."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Price (INR)">
                <input
                  type="number"
                  className={inputClassName}
                  value={form.price}
                  onChange={(e) => setValue("price", e.target.value)}
                />
              </Field>
              <Field label="Original Price">
                <input
                  type="number"
                  className={inputClassName}
                  value={form.originalPrice ?? ""}
                  onChange={(e) => setValue("originalPrice", e.target.value)}
                />
              </Field>
              <Field label="Currency">
                <input
                  className={inputClassName}
                  value={form.currency}
                  onChange={(e) => setValue("currency", e.target.value)}
                />
              </Field>
              <Field label="Display Order">
                <input
                  type="number"
                  className={inputClassName}
                  value={form.displayOrder}
                  onChange={(e) => setValue("displayOrder", e.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["visibleOnExplore", "Show on Explore page"],
                ["isFeatured", "Use as primary register offer"],
                ["isActive", "Offer is active"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) => setValue(key, e.target.checked)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section
            title="Highlights & Terms"
            subtitle="Ye offer card, summary aur explore page ke support points ke liye use honge."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Highlights</h3>
                  <button
                    onClick={() => addStringArrayItem("highlights")}
                    className="text-sm font-bold text-[#FAAD14]"
                  >
                    + Add
                  </button>
                </div>
                {form.highlights.map((item, index) => (
                  <div key={`highlight-${index}`} className="flex gap-2">
                    <input
                      className={inputClassName}
                      value={item}
                      onChange={(e) =>
                        updateStringArrayItem(
                          "highlights",
                          index,
                          e.target.value,
                        )
                      }
                    />
                    <button
                      onClick={() => removeStringArrayItem("highlights", index)}
                      className="rounded-2xl bg-red-100 px-4 text-sm font-bold text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Terms</h3>
                  <button
                    onClick={() => addStringArrayItem("terms")}
                    className="text-sm font-bold text-[#FAAD14]"
                  >
                    + Add
                  </button>
                </div>
                {form.terms.map((item, index) => (
                  <div key={`term-${index}`} className="flex gap-2">
                    <input
                      className={inputClassName}
                      value={item}
                      onChange={(e) =>
                        updateStringArrayItem("terms", index, e.target.value)
                      }
                    />
                    <button
                      onClick={() => removeStringArrayItem("terms", index)}
                      className="rounded-2xl bg-red-100 px-4 text-sm font-bold text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section
            title="Deliverables"
            subtitle="Explore button ke baad user ko exactly kya milega, wo yahan define karo."
          >
            {form.deliverables.map((deliverable, index) => (
              <div
                key={deliverable._id || `deliverable-${index}`}
                className="rounded-3xl border border-gray-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Deliverable {index + 1}
                  </h3>
                  <button
                    onClick={() => removeDeliverable(index)}
                    className="text-sm font-bold text-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <input
                      className={inputClassName}
                      value={deliverable.title}
                      onChange={(e) =>
                        updateDeliverable(index, "title", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      rows={3}
                      className={inputClassName}
                      value={deliverable.description}
                      onChange={(e) =>
                        updateDeliverable(index, "description", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}

            <button
              onClick={addDeliverable}
              className="rounded-2xl border border-dashed border-[#FAAD14] px-4 py-3 text-sm font-bold text-[#FAAD14]"
            >
              + Add Deliverable
            </button>
          </Section>

          <Section
            title="Batch Management"
            subtitle="The small selectable cards in Step 2 will be rendered using this data."
          >
            {form.batches.map((batch, index) => (
              <div
                key={batch._id || `batch-${index}`}
                className="rounded-3xl border border-gray-200 p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Batch {index + 1}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Seats and Timings will be control from this section.
                    </p>
                  </div>
                  <button
                    onClick={() => removeBatch(index)}
                    className="text-sm font-bold text-red-600"
                  >
                    Remove Batch
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Batch Title">
                    <input
                      className={inputClassName}
                      value={batch.title}
                      onChange={(e) =>
                        updateBatch(index, "title", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Mode">
                    <select
                      className={inputClassName}
                      value={batch.mode}
                      onChange={(e) =>
                        updateBatch(index, "mode", e.target.value)
                      }
                    >
                      <option value="online">online</option>
                      <option value="offline">offline</option>
                      <option value="hybrid">hybrid</option>
                    </select>
                  </Field>
                  <Field label="Start">
                    <input
                      type="datetime-local"
                      className={inputClassName}
                      value={batch.startAt}
                      onChange={(e) =>
                        updateBatch(index, "startAt", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="End">
                    <input
                      type="datetime-local"
                      className={inputClassName}
                      value={batch.endAt}
                      onChange={(e) =>
                        updateBatch(index, "endAt", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Timezone Label">
                    <input
                      className={inputClassName}
                      value={batch.timezoneLabel}
                      onChange={(e) =>
                        updateBatch(index, "timezoneLabel", e.target.value)
                      }
                    />
                  </Field>
                  <Field label="Seats">
                    <input
                      type="number"
                      className={inputClassName}
                      value={batch.seats}
                      onChange={(e) =>
                        updateBatch(index, "seats", e.target.value)
                      }
                    />
                  </Field>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                  <Field label="Venue / Join Link Label">
                    <input
                      className={inputClassName}
                      value={batch.venue}
                      onChange={(e) =>
                        updateBatch(index, "venue", e.target.value)
                      }
                    />
                  </Field>
                  <label className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={Boolean(batch.isActive)}
                      onChange={(e) =>
                        updateBatch(index, "isActive", e.target.checked)
                      }
                    />
                    <span>Batch active</span>
                  </label>
                </div>

                <Field label="Batch Description">
                  <textarea
                    rows={3}
                    className={inputClassName}
                    value={batch.description}
                    onChange={(e) =>
                      updateBatch(index, "description", e.target.value)
                    }
                  />
                </Field>
              </div>
            ))}

            <button
              onClick={addBatch}
              className="rounded-2xl border border-dashed border-[#FAAD14] px-4 py-3 text-sm font-bold text-[#FAAD14]"
            >
              + Add Batch
            </button>
          </Section>
        </div>

        <div className="space-y-6">
          <Section
            title="Confirmation & Support"
            subtitle="Payment ke baad user ko kya dikhana hai, wo yahan decide karo."
          >
            <Field label="Support Text">
              <textarea
                rows={4}
                className={inputClassName}
                value={form.supportText}
                onChange={(e) => setValue("supportText", e.target.value)}
              />
            </Field>
            <Field label="Confirmation Title">
              <input
                className={inputClassName}
                value={form.confirmationTitle}
                onChange={(e) => setValue("confirmationTitle", e.target.value)}
              />
            </Field>
            <Field label="Confirmation Message">
              <textarea
                rows={4}
                className={inputClassName}
                value={form.confirmationMessage}
                onChange={(e) =>
                  setValue("confirmationMessage", e.target.value)
                }
              />
            </Field>
            <Field label="Support WhatsApp">
              <input
                className={inputClassName}
                value={form.contactWhatsapp}
                onChange={(e) => setValue("contactWhatsapp", e.target.value)}
              />
            </Field>
          </Section>

          <Section
            title="Quick Preview"
            subtitle="The Admin can confirm the major values ​​right here before saving."
          >
            <div className="rounded-3xl bg-gradient-to-br from-[#e6fff0] via-[#d9fbe6] to-[#c8f7da] shadow-md p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-[#0f2f2f]">
                {form.badge || "Offer"}
              </div>
              <h3 className="mt-3 text-2xl font-bold">{form.cardTitle || "Card title"}</h3>
              <p className="mt-2 text-sm text-gray-700">{form.cardDescription}</p>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em]">
                    Current Price
                  </div>
                  <div className="text-3xl text-[#faad14] font-bold">₹{form.price || 0}</div>
                </div>
                <div className="rounded-full bg-[#FAAD14] px-4 py-2 text-xs font-bold text-black">
                  {form.buttonText}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gray-50 p-5 text-sm text-gray-700">
              <div className="font-semibold text-gray-900">Active Batches</div>
              <div className="mt-3 space-y-3">
                {form.batches.map((batch, index) => (
                  <div
                    key={batch._id || `preview-batch-${index}`}
                    className="rounded-2xl bg-white p-4"
                  >
                    <div className="font-semibold text-gray-900">
                      {batch.title || `Batch ${index + 1}`}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {batch.startAt
                        ? new Date(batch.startAt).toLocaleString("en-IN")
                        : "Select start time"}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {batch.mode} | Seats: {batch.seats || 0} |{" "}
                      {batch.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full rounded-2xl bg-[#FAAD14] px-5 py-4 text-sm font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : isEdit ? "Update Offer" : "Create Offer"}
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}
