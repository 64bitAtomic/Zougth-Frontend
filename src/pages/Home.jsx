import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import SEO from "../components/SEO";
import logo from "../../public/favicon-32x32.png";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Anime Tracker",
    desc: "Track your anime with watch status, genres, episodes, and seasons. Filter, search, and sort your entire collection.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    title: "Movie Manager",
    desc: "Manage your movie watchlist. Mark as watched, track by language, genre, and release year.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Series Tracker",
    desc: "Keep track of web series across platforms. Monitor seasons, episodes, and watch progress.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: "Link Vault",
    desc: "Save and organize important URLs. Categorize, search, and access your links instantly.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Code Vault",
    desc: "Store important codes, IDs, and serial keys securely. Copy them instantly when needed.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Personal Dashboard",
    desc: "Get a bird's eye view of your entire Vault — stats, recent entries, and quick actions.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
];

const mockupCards = [
  { name: "Sword Art Online", type: "TV", status: "Completed", color: "text-emerald-400 bg-emerald-500/10" },
  { name: "Breaking Bad", type: "Series", status: "Watching", color: "text-blue-400 bg-blue-500/10" },
  { name: "Interstellar", type: "Movie", status: "Watched", color: "text-emerald-400 bg-emerald-500/10" },
  { name: "GitHub", type: "Link", status: "Development", color: "text-yellow-400 bg-yellow-500/10" },
  { name: "Netflix Key", type: "Code", status: "Streaming", color: "text-pink-400 bg-pink-500/10" },
];

export default function Home() {
  <SEO
  title="Your Personal Vault"
  description="Track anime, movies, web series. Save important links and codes. All in one personal vault."
  url={`${import.meta.env.VITE_WEB_URL}/`}
/>
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
              <img src={logo} alt="Zought Logo" className="w-6 h-6" />
            <span className="font-semibold text-white">Zought</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
            Your Personal Management System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            One Vault for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400">
              Everything You Love
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Track anime, movies, and web series. Save important links and codes.
            All in one place, all yours.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/signup"
              className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Get Started — It's Free
            </Link>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 px-6 py-3 rounded-xl text-sm transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Mockup / Preview */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">

            {/* Mockup header */}
            <div className="bg-gray-800/50 px-4 py-3 flex items-center gap-2 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="flex-1 mx-4 bg-gray-800 rounded-lg px-3 py-1 text-xs text-gray-500">
                Vault.app/dashboard
              </div>
            </div>

            {/* Mockup content */}
            <div className="p-5 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { label: "Anime", val: 24, color: "text-violet-400" },
                  { label: "Movies", val: 48, color: "text-blue-400" },
                  { label: "Series", val: 12, color: "text-emerald-400" },
                  { label: "Links", val: 36, color: "text-yellow-400" },
                  { label: "Codes", val: 8, color: "text-pink-400" },
                  { label: "Total", val: 128, color: "text-white" },
                ].map(s => (
                  <div key={s.label} className="bg-gray-800/60 rounded-xl p-3">
                    <p className="text-gray-500 text-xs">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Recent items */}
              <div>
                <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">Recent</p>
                <div className="space-y-2">
                  {mockupCards.map((card, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-800/40 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-lg" />
                        <div>
                          <p className="text-white text-xs font-medium">{card.name}</p>
                          <p className="text-gray-500 text-xs">{card.type}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${card.color}`}>
                        {card.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Everything in One Place</h2>
            <p className="text-gray-400">Six powerful modules to manage your digital life</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`bg-gray-900 border ${f.border} rounded-2xl p-5 hover:bg-gray-800/50 transition-colors`}
              >
                <div className={`w-10 h-10 ${f.bg} ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-medium mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 border-t border-gray-800/50">
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-violet-600/5 rounded-3xl blur-3xl pointer-events-none" />
          <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-10 space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to Organize Your World?</h2>
            <p className="text-gray-400">
              Join and start managing your anime, movies, series, links, and codes — all in one Vault.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/signup"
                className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 px-6 py-3 rounded-xl text-sm transition-all"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-gray-500 text-sm">Vault</span>
          </div>
          <p className="text-gray-600 text-xs">Your personal management system</p>
        </div>
      </footer>

    </div>
  );
}