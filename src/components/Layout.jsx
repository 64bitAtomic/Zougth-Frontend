import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* Desktop sidebar — md se upar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60 min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav — md se neeche */}
      <BottomNav />

    </div>
  );
}