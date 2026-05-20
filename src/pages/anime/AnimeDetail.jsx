import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  getAnimeByIdAPI,
  updateAnimeAPI,
  updateAnimeStatusAPI,
  deleteAnimeAPI,
} from "../../api/anime.api";

const WATCH_STATUS = ['Watching', 'Completed', 'On Hold', 'Dropped', 'Planned'];
const ANIME_TYPES = ['TV', 'OVA', 'ONA', 'Movie', 'Special'];

const STATUS_COLORS = {
  'Watching':  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'On Hold':   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Dropped':   'bg-red-500/10 text-red-400 border-red-500/20',
  'Planned':   'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await getAnimeByIdAPI(id);
        setAnime(res.data.anime);
      } catch {
        setError("Anime not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [id]);

  useEffect(() => {
    if (anime && isEditing) {
      reset({
        animeName: anime.animeName,
        type: anime.type,
        totalEpisodes: anime.totalEpisodes || "",
        totalSeasons: anime.totalSeasons || "",
        genres: anime.genres?.join(", ") || "",
        animeImg: anime.animeImg || "",
      });
    }
  }, [isEditing, anime]);

  const onUpdate = async (data) => {
    setServerError("");
    setUpdateLoading(true);
    try {
      const payload = {
        ...data,
        genres: data.genres
          ? data.genres.split(",").map((g) => g.trim()).filter(Boolean)
          : [],
        totalEpisodes: data.totalEpisodes ? Number(data.totalEpisodes) : null,
        totalSeasons: data.totalSeasons ? Number(data.totalSeasons) : null,
      };
      const res = await updateAnimeAPI(id, payload);
      setAnime(res.data.anime);
      setIsEditing(false);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const onStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusLoading(true);
    try {
      const res = await updateAnimeStatusAPI(id, newStatus);
      setAnime(res.data.anime);
    } catch {
      setAnime((prev) => ({ ...prev }));
    } finally {
      setStatusLoading(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Delete this anime?")) return;
    setDeleteLoading(true);
    try {
      await deleteAnimeAPI(id);
      navigate("/anime");
    } catch {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-700 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-400">{error}</p>
        <Link to="/anime" className="text-violet-400 text-sm hover:text-violet-300">← Back to list</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden">
        {/* Blurred background */}
        <img
          src={anime.animeImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-30"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        {/* Back button */}
        <div className="absolute top-5 left-5">
          <Link
            to="/anime"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        {/* Poster + Title */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 flex items-end gap-5">
          <img
            src={anime.animeImg}
            alt={anime.animeName}
            className="w-28 h-40 object-cover rounded-xl border border-gray-700 shadow-2xl shrink-0"
            onError={(e) => {
              e.target.src = "https://www.aputf.org/wp-content/uploads/2015/06/default-placeholder1-1024x1024-570x321.png";
            }}
          />
          <div className="pb-1 space-y-2">
            <h1 className="text-2xl font-bold text-white leading-tight">{anime.animeName}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-lg">{anime.type}</span>
              {anime.totalEpisodes && (
                <span className="text-xs text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-lg">{anime.totalEpisodes} eps</span>
              )}
              {anime.totalSeasons && (
                <span className="text-xs text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-lg">{anime.totalSeasons} seasons</span>
              )}
            </div>
            {anime.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {anime.genres.map((g) => (
                  <span key={g} className="text-xs px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full">
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* View Mode */}
        {!isEditing && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">

            {/* Status + Actions */}
            <div className="flex items-center justify-between">
              <select
                value={anime.watchStatus}
                onChange={onStatusChange}
                disabled={statusLoading}
                className={`text-sm px-3 py-1.5 rounded-xl border ${STATUS_COLORS[anime.watchStatus]} bg-transparent cursor-pointer focus:outline-none disabled:opacity-50`}
              >
                {WATCH_STATUS.map((s) => (
                  <option key={s} value={s} className="bg-gray-900 text-white">{s}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsEditing(true); setServerError(""); }}
                  className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-xl transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={onDelete}
                  disabled={deleteLoading}
                  className="text-sm text-red-400 hover:text-red-300 border border-gray-700 hover:border-red-500/40 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {deleteLoading ? "..." : "Delete"}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-800" />

            {/* Info */}
            <div className="space-y-3">
              <InfoRow label="Type" value={anime.type} />
              {anime.totalEpisodes && <InfoRow label="Episodes" value={anime.totalEpisodes} />}
              {anime.totalSeasons && <InfoRow label="Seasons" value={anime.totalSeasons} />}
              <InfoRow
                label="Added"
                value={new Date(anime.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              />
            </div>

          </div>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-medium">Edit Anime</h2>
              <button
                onClick={() => { setIsEditing(false); setServerError(""); }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Anime Name *</label>
                <input
                  {...register("animeName", { required: "Anime name is required" })}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
                />
                {errors.animeName && <p className="text-red-400 text-xs mt-1">{errors.animeName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Type</label>
                  <select
                    {...register("type")}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                  >
                    {ANIME_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Episodes</label>
                  <input
                    {...register("totalEpisodes")}
                    type="number"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Seasons</label>
                  <input
                    {...register("totalSeasons")}
                    type="number"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Genres</label>
                  <input
                    {...register("genres")}
                    type="text"
                    placeholder="Action, Romance"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Poster URL</label>
                <input
                  {...register("animeImg")}
                  type="url"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
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

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-white text-sm">{value}</span>
    </div>
  );
}