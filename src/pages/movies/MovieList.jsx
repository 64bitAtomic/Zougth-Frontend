import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllMoviesAPI } from "../../api/movie.api";
import SEO from "../../components/SEO";

const MOVIE_STATUS = ['Watched', 'Watchlist', 'Dropped'];

const STATUS_COLORS = {
  'Watched':   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Watchlist': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'Dropped':   'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function MovieList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [watchStatus, setWatchStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const fetchMovies = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page, limit: 12, sortBy, order,
        ...(search && { search }),
        ...(watchStatus && { watchStatus }),
      };
      const res = await getAllMoviesAPI(params);
      setMovies(res.data.movies);
      setPagination(res.data.pagination);
    } catch {
      setError("Could not load movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => { setPage(1); fetchMovies(); }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => { setPage(1); fetchMovies(); }, [watchStatus, sortBy, order]);
  useEffect(() => { fetchMovies(); }, [page]);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <SEO
  title="Movies"
  description="Manage your movie watchlist."
/>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Movies</h1>
            {pagination && <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total</p>}
          </div>
          <Link
            to="/movies/add"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Movie
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative sm:col-span-2">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
            <select
              value={watchStatus}
              onChange={(e) => setWatchStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
            >
              <option value="">All Status</option>
              {MOVIE_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
            >
              <option value="createdAt">Sort: Date Added</option>
              <option value="movieName">Sort: Name</option>
              <option value="releaseYear">Sort: Year</option>
              <option value="watchStatus">Sort: Status</option>
            </select>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-800" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No movies found</p>
            <Link to="/movies/add" className="text-violet-400 text-sm mt-2 inline-block hover:text-violet-300">
              Add your first movie →
            </Link>
          </div>
        )}

        {/* Cards */}
        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <div
                key={movie._id}
                onClick={() => navigate(`/movies/${movie._id}`)}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/40 hover:scale-[1.02] transition-all duration-200"
              >
                <div className="w-full h-52 overflow-hidden bg-gray-800">
                  <img
                    src={movie.movieImg}
                    alt={movie.movieName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://www.aputf.org/wp-content/uploads/2015/06/default-placeholder1-1024x1024-570x321.png"; }}
                  />
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="text-white text-sm font-medium leading-tight line-clamp-2">{movie.movieName}</h3>
                  <div className="flex items-center justify-between">
                    {movie.releaseYear && <span className="text-gray-500 text-xs">{movie.releaseYear}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[movie.watchStatus]}`}>
                      {movie.watchStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-violet-500/40 hover:text-white transition"
            >
              ← Prev
            </button>
            <span className="text-gray-500 text-sm px-2">{pagination.page} / {pagination.totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-violet-500/40 hover:text-white transition"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}