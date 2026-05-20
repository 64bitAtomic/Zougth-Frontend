import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addMovieAPI } from "../../api/movie.api";

const MOVIE_STATUS = ['Watched', 'Watchlist', 'Dropped'];

export default function MovieAdd() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { watchStatus: "Watchlist" }
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const payload = {
        ...data,
        genres: data.genres ? data.genres.split(",").map(g => g.trim()).filter(Boolean) : [],
        releaseYear: data.releaseYear ? Number(data.releaseYear) : undefined,
      };
      await addMovieAPI(payload);
      navigate("/movies");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <Link to="/movies" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-white">Add Movie</h1>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Movie Name *</label>
              <input
                {...register("movieName", { required: "Movie name is required" })}
                type="text"
                placeholder="e.g. Interstellar"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              />
              {errors.movieName && <p className="text-red-400 text-xs mt-1">{errors.movieName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Watch Status</label>
                <select
                  {...register("watchStatus")}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition"
                >
                  {MOVIE_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Release Year</label>
                <input
                  {...register("releaseYear")}
                  type="number"
                  placeholder="e.g. 2014"
                  min="1888"
                  max="2030"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Language</label>
              <input
                {...register("language")}
                type="text"
                placeholder="e.g. English"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                Genres <span className="text-gray-600">(comma separated)</span>
              </label>
              <input
                {...register("genres")}
                type="text"
                placeholder="e.g. Sci-Fi, Drama"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Poster URL</label>
              <input
                {...register("movieImg")}
                type="url"
                placeholder="https://..."
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl text-sm transition-colors"
            >
              {loading ? "Adding..." : "Add Movie"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}