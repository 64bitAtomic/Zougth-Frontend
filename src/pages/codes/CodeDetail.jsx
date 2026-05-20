import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getCodeByIdAPI, updateCodeAPI, deleteCodeAPI } from "../../api/code.api";

export default function CodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const res = await getCodeByIdAPI(id);
        setCode(res.data.code);
      } catch {
        setError("Code not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchCode();
  }, [id]);

  useEffect(() => {
    if (code && isEditing) {
      reset({
        title: code.title,
        value: code.value,
        category: code.category || "",
        platform: code.platform || "",
      });
    }
  }, [isEditing, code]);

  const onUpdate = async (data) => {
    setServerError("");
    setUpdateLoading(true);
    try {
      const res = await updateCodeAPI(id, data);
      setCode(res.data.code);
      setIsEditing(false);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Delete this code?")) return;
    setDeleteLoading(true);
    try {
      await deleteCodeAPI(id);
      navigate("/codes");
    } catch {
      setDeleteLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-700 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-3">
      <p className="text-gray-400">{error}</p>
      <Link to="/codes" className="text-violet-400 text-sm hover:text-violet-300">← Back to list</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-4">

        <div className="flex items-center gap-3 mb-2">
          <Link to="/codes" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-white line-clamp-1">{code.title}</h1>
        </div>

        {!isEditing && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">

            {/* Badges + Actions */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {code.platform && (
                  <span className="text-xs text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full">{code.platform}</span>
                )}
                <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">{code.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsEditing(true); setServerError(""); }}
                  className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-xl transition-all"
                >Edit</button>
                <button
                  onClick={onDelete}
                  disabled={deleteLoading}
                  className="text-sm text-red-400 hover:text-red-300 border border-gray-700 hover:border-red-500/40 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
                >{deleteLoading ? "..." : "Delete"}</button>
              </div>
            </div>

            <div className="border-t border-gray-800" />

            {/* Value */}
            <div>
              <p className="text-gray-500 text-xs mb-2">Code / ID Value</p>
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <p className="text-white text-sm font-mono break-all">{code.value}</p>
              </div>
            </div>

            <div className="border-t border-gray-800" />

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Added</span>
              <span className="text-gray-400 text-xs">
                {new Date(code.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-xl text-sm transition-colors ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-violet-600 hover:bg-violet-500 text-white"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Code
                </>
              )}
            </button>
          </div>
        )}

        {isEditing && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-medium">Edit Code</h2>
              <button onClick={() => { setIsEditing(false); setServerError(""); }} className="text-sm text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Title *</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Value *</label>
                <textarea
                  {...register("value", { required: "Value is required" })}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-violet-500 transition resize-none"
                />
                {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Category</label>
                  <input
                    {...register("category")}
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Platform</label>
                  <input
                    {...register("platform")}
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              {serverError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={updateLoading}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors"
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}