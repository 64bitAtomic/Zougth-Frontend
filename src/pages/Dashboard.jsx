import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardAPI } from "../api/dashboard.api";
import SEO from "../components/SEO";

const STATUS_COLORS = {
  'Watching':  'bg-blue-500/10 text-blue-400',
  'Completed': 'bg-emerald-500/10 text-emerald-400',
  'On Hold':   'bg-yellow-500/10 text-yellow-400',
  'Dropped':   'bg-red-500/10 text-red-400',
  'Planned':   'bg-gray-500/10 text-gray-400',
  'Watched':   'bg-emerald-500/10 text-emerald-400',
  'Watchlist': 'bg-gray-500/10 text-gray-400',
};

const statCards = (stats) => [
  { label: "Anime",      value: stats.anime,   path: "/anime",   color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Movies",     value: stats.movies,  path: "/movies",  color: "text-blue-400",   bg: "bg-blue-500/10"   },
  { label: "Series",     value: stats.series,  path: "/series",  color: "text-emerald-400",bg: "bg-emerald-500/10"},
  { label: "Links",      value: stats.links,   path: "/links",   color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { label: "Codes",      value: stats.codes,   path: "/codes",   color: "text-pink-400",   bg: "bg-pink-500/10"   },
  { label: "Total",      value: stats.total,   path: null,       color: "text-white",      bg: "bg-gray-800"      },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDashboardAPI();
        setData(res.data);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-700 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, recent } = data;

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto space-y-8">
      <SEO title="Dashboard" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your personal Vault overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards(stats).map((card) => (
          <div
            key={card.label}
            onClick={() => card.path && navigate(card.path)}
            className={`${card.bg} rounded-2xl p-4 space-y-1 ${card.path ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
          >
            <p className="text-gray-400 text-xs">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Anime */}
      {recent.anime.length > 0 && (
        <Section title="Recent Anime" path="/anime" navigate={navigate}>
          <div className="grid grid-cols-3 gap-3">
            {recent.anime.map((a) => (
              <div
                key={a._id}
                onClick={() => navigate(`/anime/${a._id}`)}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/40 transition-colors"
              >
                <img
                  src={a.animeImg}
                  alt={a.animeName}
                  className="w-full h-32 sm:h-40 object-cover"
                  onError={(e) => { e.target.src = "https://www.aputf.org/wp-content/uploads/2015/06/default-placeholder1-1024x1024-570x321.png"; }}
                />
                <div className="p-2.5 space-y-1">
                  <p className="text-white text-xs font-medium line-clamp-1">{a.animeName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[a.watchStatus]}`}>
                    {a.watchStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Recent Movies */}
      {recent.movies.length > 0 && (
        <Section title="Recent Movies" path="/movies" navigate={navigate}>
          <div className="grid grid-cols-3 gap-3">
            {recent.movies.map((m) => (
              <div
                key={m._id}
                onClick={() => navigate(`/movies/${m._id}`)}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/40 transition-colors"
              >
                <img
                  src={m.movieImg}
                  alt={m.movieName}
                  className="w-full h-32 sm:h-40 object-cover"
                  onError={(e) => { e.target.src = "https://www.aputf.org/wp-content/uploads/2015/06/default-placeholder1-1024x1024-570x321.png"; }}
                />
                <div className="p-2.5 space-y-1">
                  <p className="text-white text-xs font-medium line-clamp-1">{m.movieName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[m.watchStatus]}`}>
                    {m.watchStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Recent Series */}
      {recent.series.length > 0 && (
        <Section title="Recent Series" path="/series" navigate={navigate}>
          <div className="grid grid-cols-3 gap-3">
            {recent.series.map((s) => (
              <div
                key={s._id}
                onClick={() => navigate(`/series/${s._id}`)}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/40 transition-colors"
              >
                <img
                  src={s.seriesImg}
                  alt={s.seriesName}
                  className="w-full h-32 sm:h-40 object-cover"
                  onError={(e) => { e.target.src = "https://www.aputf.org/wp-content/uploads/2015/06/default-placeholder1-1024x1024-570x321.png"; }}
                />
                <div className="p-2.5 space-y-1">
                  <p className="text-white text-xs font-medium line-clamp-1">{s.seriesName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[s.watchStatus]}`}>
                    {s.watchStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Recent Links */}
      {recent.links.length > 0 && (
        <Section title="Recent Links" path="/links" navigate={navigate}>
          <div className="space-y-2">
            {recent.links.map((l) => (
              <a
                key={l._id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-yellow-500/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{l.title}</p>
                  <p className="text-gray-500 text-xs truncate">{l.url}</p>
                </div>
                <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full shrink-0 ml-3">
                  {l.category}
                </span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Recent Codes */}
      {recent.codes.length > 0 && (
        <Section title="Recent Codes" path="/codes" navigate={navigate}>
          <div className="space-y-2">
            {recent.codes.map((c) => (
              <div
                key={c._id}
                onClick={() => navigate(`/codes/${c._id}`)}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-pink-500/30 transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{c.title}</p>
                  <p className="text-gray-500 text-xs font-mono truncate">{c.value}</p>
                </div>
                <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full shrink-0 ml-3">
                  {c.platform || c.category}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Empty state */}
      {stats.total === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-gray-500">Vault is empty — start adding!</p>
          <div className="flex items-center justify-center gap-3 flex-wrap mt-4">
            {[
              { label: "+ Anime", path: "/anime/add" },
              { label: "+ Movie", path: "/movies/add" },
              { label: "+ Series", path: "/series/add" },
              { label: "+ Link", path: "/links/add" },
              { label: "+ Code", path: "/codes/add" },
            ].map((btn) => (
              <button
                key={btn.path}
                onClick={() => navigate(btn.path)}
                className="text-sm text-violet-400 border border-violet-500/30 px-4 py-2 rounded-xl hover:bg-violet-500/10 transition-colors"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// Reusable section header
function Section({ title, path, navigate, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-medium">{title}</h2>
        <button
          onClick={() => navigate(path)}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          View all →
        </button>
      </div>
      {children}
    </div>
  );
}