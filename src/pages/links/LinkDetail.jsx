import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getLinkByIdAPI, updateLinkAPI, deleteLinkAPI } from "../../api/link.api";

export default function LinkDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await getLinkByIdAPI(id);
        setLink(res.data.link);
      } catch {
        setError("Link not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [id]);

  useEffect(() => {
    if (link && isEditing) {
      reset({
        title: link.title,
        url: link.url,
        category: link.category || "",
        description: link.description || "",
      });
    }
  }, [isEditing, link]);

  const onUpdate = async (data) => {
    setServerError("");
    setUpdateLoading(true);
    try {
      const res = await updateLinkAPI(id, data);
      setLink(res.data.link);
      setIsEditing(false);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Delete this link?")) return;
    setDeleteLoading(true);
    try {
      await deleteLinkAPI(id);
      navigate("/links");
    } catch {
      setDeleteLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link.url);
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
      <Link to="/links" className="text-violet-400 text-sm hover:text-violet-300">← Back to list</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link to="/links" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-white line-clamp-1">{link.title}</h1>
        </div>

        {!isEditing && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">

            {/* Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">
                {link.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-xl transition-all"
                >
                  {copied ? "Copied!" : "Copy URL"}
                </button>
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

            {/* URL */}
            <div>
              <p className="text-gray-500 text-xs mb-1">URL</p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 text-sm break-all transition-colors"
              >
                {link.url}
              </a>
            </div>

            {link.description && (
              <div>
                <p className="text-gray-500 text-xs mb-1">Description</p>
                <p className="text-white text-sm">{link.description}</p>
              </div>
            )}

            <div className="border-t border-gray-800" />

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Added</span>
              <span className="text-gray-400 text-xs">
                {new Date(link.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Open button */}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-xl text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Link
            </a>
          </div>
        )}

        {isEditing && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-medium">Edit Link</h2>
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
                <label className="block text-sm text-gray-400 mb-1.5">URL *</label>
                <input
                  {...register("url", { required: "URL is required" })}
                  type="url"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                />
                {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url.message}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Category</label>
                <input
                  {...register("category")}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition resize-none"
                />
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