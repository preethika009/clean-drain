"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  MapPin, Camera, Tag, AlertTriangle, ChevronRight, ChevronLeft,
  Upload, Loader2, CheckCircle, Sparkles, X, FileImage
} from "lucide-react";
import { fileToBase64 } from "@/lib/utils";

// Dynamically import map to avoid SSR issues
const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

const STEPS = [
  { id: 1, title: "Location", icon: MapPin },
  { id: 2, title: "Details", icon: AlertTriangle },
  { id: 3, title: "Photos", icon: Camera },
  { id: 4, title: "Review", icon: CheckCircle },
];

const SEVERITY_OPTIONS = [
  { value: "CRITICAL_BLOCKAGE", label: "🚨 Critical Blockage", desc: "Complete drain blockage, water overflow" },
  { value: "FLOOD_RISK", label: "🌊 Flood Risk", desc: "Risk of flooding in area" },
  { value: "FOUL_ODOR", label: "💨 Foul Odor", desc: "Strong smell from drain" },
  { value: "STRUCTURAL_DAMAGE", label: "🏗️ Structural Damage", desc: "Damaged drain cover or structure" },
  { value: "ROUTINE_MAINTENANCE", label: "🔧 Routine Maintenance", desc: "Regular cleaning needed" },
];

const COMMON_TAGS = [
  "blocked-grate", "sewage-overflow", "flood-prone", "broken-cover",
  "mosquito-breeding", "road-damage", "foul-smell", "stagnant-water",
];

export default function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ ackId: string; priority: string } | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Form state
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [ward, setWard] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("ROUTINE_MAINTENANCE");
  const [tags, setTags] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    setPhotos(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setPhotoPreviews(previews);
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!location) return;
    setSubmitting(true);
    setAiAnalyzing(true);

    try {
      let imageBase64: string | undefined;
      let imageMimeType: string | undefined;

      if (photos[0]) {
        const { base64, mimeType } = await fileToBase64(photos[0]);
        imageBase64 = base64;
        imageMimeType = mimeType;
      }

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          latitude: location.lat,
          longitude: location.lng,
          address: location.address,
          ward,
          tags,
          imageBase64,
          imageMimeType,
        }),
      });

      setAiAnalyzing(false);
      if (!res.ok) throw new Error("Submission failed");
      const data = await res.json();

      // Upload photos
      if (photos.length > 0 && data.ticket?.id) {
        for (const photo of photos) {
          const fd = new FormData();
          fd.append("file", photo);
          fd.append("ticketId", data.ticket.id);
          fd.append("type", "BEFORE_PHOTO");
          await fetch("/api/upload", { method: "POST", body: fd });
        }
      }

      setSubmitted({ ackId: data.ticket.ackId, priority: data.aiAnalysis.priority });
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
      setAiAnalyzing(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Issue Reported!</h2>
          <p className="text-slate-400 mb-6">Your complaint has been registered and acknowledgement sent to your email.</p>
          
          <div className="bg-primary-900/30 border border-primary-600/30 rounded-2xl p-6 mb-6">
            <p className="text-primary-300 text-xs font-semibold uppercase tracking-widest mb-1">Your Acknowledgement ID</p>
            <p className="text-4xl font-display font-black text-white tracking-widest">{submitted.ackId}</p>
          </div>

          <div className={`badge mb-6 text-sm px-4 py-2 ${
            submitted.priority === "URGENT" ? "badge-urgent" :
            submitted.priority === "HIGH" ? "badge-high" :
            submitted.priority === "MEDIUM" ? "badge-medium" : "badge-low"
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            AI Priority: {submitted.priority}
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push("/dashboard")} className="btn-secondary flex-1 justify-center">
              Go to Dashboard
            </button>
            <button onClick={() => router.push(`/track/${submitted.ackId}`)} className="btn-primary flex-1 justify-center">
              Track Issue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Report a Drain Issue</h1>
          <p className="text-slate-400">Fill in the details — our AI will categorize and prioritize your report.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                  ${step === s.id ? "bg-primary-600/20 border border-primary-600/50 text-primary-300" :
                    step > s.id ? "text-primary-400 cursor-pointer" : "text-slate-600"
                  }`}
              >
                {step > s.id ? (
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold
                    ${step === s.id ? "border-primary-500 text-primary-400" : "border-slate-600 text-slate-600"}`}>
                    {s.id}
                  </div>
                )}
                <span className="hidden sm:inline">{s.title}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${step > s.id ? "bg-primary-600/40" : "bg-slate-700"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Location */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-400" /> Select Location
                </h2>
                <p className="text-slate-400 text-sm mb-4">Click &quot;Detect Location&quot; or drag the pin to the exact drain location.</p>
                <div className="h-72 rounded-xl overflow-hidden border border-white/10 mb-4">
                  <MapPicker onLocationSelect={setLocation} />
                </div>
                {location && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-primary-900/20 border border-primary-700/30 text-sm">
                    <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{location.address}</span>
                  </div>
                )}
                <div className="mt-4">
                  <label className="label-field">Municipal Ward</label>
                  <input value={ward} onChange={(e) => setWard(e.target.value)} className="input-field" placeholder="e.g. Ward 7 - East" />
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" /> Issue Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="label-field">Issue Title *</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input-field"
                      placeholder="e.g. Blocked storm drain near market entrance"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-field">Description *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input-field resize-none h-28"
                      placeholder="Describe the drain issue in detail — smell, overflow level, duration of blockage, impact on traffic or residents..."
                      required
                    />
                  </div>
                  <div>
                    <label className="label-field">Severity Type</label>
                    <div className="grid gap-2">
                      {SEVERITY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSeverity(opt.value)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all
                            ${severity === opt.value
                              ? "border-primary-500 bg-primary-900/30 text-white"
                              : "border-white/10 bg-slate-800/20 text-slate-400 hover:border-white/20"
                            }`}
                        >
                          <span className="text-lg">{opt.label.split(" ")[0]}</span>
                          <div>
                            <div className="font-medium">{opt.label.substring(opt.label.indexOf(" ") + 1)}</div>
                            <div className="text-xs text-slate-500">{opt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label-field flex items-center gap-2"><Tag className="w-4 h-4" /> Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                            ${tags.includes(tag)
                              ? "border-primary-500 bg-primary-900/40 text-primary-300"
                              : "border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-400"
                            }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-400" /> Upload Before Photos
                </h2>
                <p className="text-slate-400 text-sm mb-4">Add up to 3 photos of the blocked drain (JPEG, PNG, WebP — max 10MB each). This helps our AI better assess the severity.</p>
                
                <label className="block w-full cursor-pointer group">
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-primary-600/50 hover:bg-primary-900/10 transition-all group-hover:shadow-glow-sm">
                    <Upload className="w-10 h-10 mx-auto text-slate-500 mb-3 group-hover:text-primary-400 transition-colors" />
                    <p className="text-white font-medium">Click to upload photos</p>
                    <p className="text-slate-500 text-sm mt-1">or drag and drop here</p>
                  </div>
                </label>

                {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {photoPreviews.map((p, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p} alt={`preview-${i}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePhoto(i)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="absolute bottom-2 left-2 badge bg-black/60 text-white text-xs">
                          <FileImage className="w-3 h-3" /> Before
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> Review & Submit
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-start p-4 rounded-xl bg-slate-800/40 border border-white/5">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">📍 Location</p>
                      <p className="text-white text-sm">{location?.address ?? "Not set"}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5">
                    <p className="text-xs text-slate-500 mb-1">📝 Title</p>
                    <p className="text-white text-sm font-medium">{title || "—"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-white/5">
                    <p className="text-xs text-slate-500 mb-1">📖 Description</p>
                    <p className="text-slate-300 text-sm">{description || "—"}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 p-4 rounded-xl bg-slate-800/40 border border-white/5">
                      <p className="text-xs text-slate-500 mb-1">⚡ Severity</p>
                      <p className="text-white text-sm">{severity}</p>
                    </div>
                    <div className="flex-1 p-4 rounded-xl bg-slate-800/40 border border-white/5">
                      <p className="text-xs text-slate-500 mb-1">📸 Photos</p>
                      <p className="text-white text-sm">{photos.length} uploaded</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary-900/20 border border-primary-700/30 mb-6">
                  <div className="flex items-center gap-2 text-primary-300 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <strong>AI Analysis will run on submission</strong>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">Gemini AI will analyze your description and photos to auto-categorize severity, assign priority, and route to the correct zone.</p>
                </div>

                {aiAnalyzing && (
                  <div className="flex items-center gap-3 text-primary-300 mb-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">AI is analyzing your complaint...</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="btn-secondary flex-1 justify-center">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => {
                  if (step === 1 && !location) { alert("Please select a location."); return; }
                  if (step === 2 && (!title || !description)) { alert("Please fill in all required fields."); return; }
                  setStep(step + 1);
                }}
                className="btn-primary flex-1 justify-center"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex-1 justify-center"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <>Submit Report <CheckCircle className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
