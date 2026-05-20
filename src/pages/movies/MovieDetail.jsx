import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getMovieByIdAPI, updateMovieAPI, updateMovieStatusAPI, deleteMovieAPI } from "../../api/movie.api";

const MOVIE_STATUS = ['Watched', 'Watchlist', 'Dropped'];
const STATUS_COLORS = {
  'Watched':   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Watchlist': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'Dropped':   'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await getMovieByIdAPI(id);
        setMovie(res.data.movie);
      } catch {
        setError("Movie not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie && isEditing) {
      reset({
        movieName: movie.movieName,
        releaseYear: movie.releaseYear || "",
        language: movie.language || "",
        genres: movie.genres?.join(", ") || "",
        movieImg: movie.movieImg || "",
      });
    }
  }, [isEditing, movie]);

  const onUpdate = async (data) => {
    setServerError("");
    setUpdateLoading(true);
    try {
      const payload = {
        ...data,
        genres: data.genres ? data.genres.split(",").map(g => g.trim()).filter(Boolean) : [],
        releaseYear: data.releaseYear ? Number(data.releaseYear) : null,
      };
      const res = await updateMovieAPI(id, payload);
      setMovie(res.data.movie);
      setIsEditing(false);
    } catch (err) {
      setServerError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const onStatusChange = async (e) => {
    setStatusLoading(true);
    try {
      const res = await updateMovieStatusAPI(id, e.target.value);
      setMovie(res.data.movie);
    } catch {
      setMovie(prev => ({ ...prev }));
    } finally {
      setStatusLoading(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Delete this movie?")) return;
    setDeleteLoading(true);
    try {
      await deleteMovieAPI(id);
      navigate("/movies");
    } catch {
      setDeleteLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-700 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-3">
      <p className="text-gray-400">{error}</p>
      <Link to="/movies" className="text-violet-400 text-sm hover:text-violet-300">← Back to list</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={movie.movieImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm opacity-30"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

        <div className="absolute top-5 left-5">
          <Link to="/movies" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 flex items-end gap-5">
          <img
            src={movie.movieImg}
            alt={movie.movieName}
            className="w-28 h-40 object-cover rounded-xl border border-gray-700 shadow-2xl shrink-0"
            onError={(e) => { e.target.src = "https://www.aputf.org/wp-content/uploads/2015/06/default-placeholder1-1024x1024-570x321.png"; }}
          />
          <div className="pb-1 space-y-2">
            <h1 className="text-2xl font-bold text-white leading-tight">{movie.movieName}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              {movie.releaseYear && (
                <span className="text-xs text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-lg">{movie.releaseYear}</span>
              )}
              {movie.language && (
                <span className="text-xs text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-lg">{movie.language}</span>
              )}
            </div>
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map(g => (
                  <span key={g} className="text-xs px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full">{g}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {!isEditing && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <select
                value={movie.watchStatus}
                onChange={onStatusChange}
                disabled={statusLoading}
                className={`text-sm px-3 py-1.5 rounded-xl border ${STATUS_COLORS[movie.watchStatus]} bg-transparent cursor-pointer focus:outline-none disabled:opacity-50`}
              >
                {MOVIE_STATUS.map(s => (
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

            <div className="space-y-3">
              {movie.releaseYear && <InfoRow label="Release Year" value={movie.releaseYear} />}
              {movie.language && <InfoRow label="Language" value={movie.language} />}
              <InfoRow
                label="Added"
                value={new Date(movie.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              />
            </div>
          </div>
        )}

        {isEditing && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-medium">Edit Movie</h2>
              <button onClick={() => { setIsEditing(false); setServerError(""); }} className="text-sm text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Movie Name *</label>
                <input
                  {...register("movieName", { required: "Movie name is required" })}
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                />
                {errors.movieName && <p className="text-red-400 text-xs mt-1">{errors.movieName.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Release Year</label>
                  <input
                    {...register("releaseYear")}
                    type="number"
                    min="1888" max="2030"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Language</label>
                  <input
                    {...register("language")}
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Genres</label>
                <input
                  {...register("genres")}
                  type="text"
                  placeholder="Sci-Fi, Drama"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Poster URL</label>
                <input
                  {...register("movieImg")}
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