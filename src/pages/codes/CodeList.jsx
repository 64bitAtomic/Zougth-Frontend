import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCodesAPI, getCodeCategoriesAPI, deleteCodeAPI } from "../../api/code.api";
import SEO from "../../components/SEO";

export default function CodeList() {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const params = {
        page, limit: 20, sortBy, order,
        ...(search && { search }),
        ...(category && { category }),
      };
      const res = await getAllCodesAPI(params);
      setCodes(res.data.codes);
      setPagination(res.data.pagination);
    } catch {}
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCodeCategoriesAPI();
      setCategories(res.data.categories);
    } catch {}
  };

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    const timeout = setTimeout(() => { setPage(1); fetchCodes(); }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => { setPage(1); fetchCodes(); }, [category, sortBy, order]);
  useEffect(() => { fetchCodes(); }, [page]);

  const handleCopy = (e, id, value) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this code?")) return;
    setDeletingId(id);
    try {
      await deleteCodeAPI(id);
      setCodes(prev => prev.filter(c => c._id !== id));
      setPagination(prev => prev ? { ...prev, total: prev.total - 1 } : prev);
    } catch {}
    finally { setDeletingId(null); }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <SEO
  title="Code Vault"
  description="Store and access your important codes and IDs."
/>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Code Vault</h1>
            {pagination && <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total</p>}
          </div>
          <Link
            to="/codes/add"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Code
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
                placeholder="Search codes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
            >
              <option value="createdAt">Sort: Date Added</option>
              <option value="title">Sort: Title</option>
              <option value="category">Sort: Category</option>
              <option value="platform">Sort: Platform</option>
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

        {/* Loading */}
        {loading && (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-800 rounded w-1/3" />
                    <div className="h-3 bg-gray-800 rounded w-1/2" />
                  </div>
                  <div className="h-6 w-16 bg-gray-800 rounded-full ml-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && codes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No codes found</p>
            <Link to="/codes/add" className="text-violet-400 text-sm mt-2 inline-block hover:text-violet-300">
              Add your first code →
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && codes.length > 0 && (
          <div className="space-y-2">
            {codes.map((code) => (
              <div
                key={code._id}
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-4 hover:border-violet-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium">{code.title}</p>
                      {code.platform && (
                        <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full shrink-0">
                          {code.platform}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full shrink-0">
                        {code.category}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs font-mono mt-1.5 truncate">{code.value}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleCopy(e, code._id, code.value)}
                      className="text-gray-500 hover:text-violet-400 transition-colors p-1.5 rounded-lg hover:bg-violet-500/10"
                      title="Copy value"
                    >
                      {copiedId === code._id ? (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => navigate(`/codes/${code._id}`)}
                      className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, code._id)}
                      disabled={deletingId === code._id}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
            >← Prev</button>
            <span className="text-gray-500 text-sm px-2">{pagination.page} / {pagination.totalPages}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-violet-500/40 hover:text-white transition"
            >Next →</button>
          </div>
        )}

      </div>
    </div>
  );
}