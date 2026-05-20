import { NavLink } from "react-router-dom";
import { navItems } from "./Sidebar";

// Mobile pe sirf 5 items — Code Vault chhod do (overflow hoga)
const mobileItems = navItems.slice(0, 6);

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-10 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "text-violet-400"
                  : "text-gray-500 hover:text-gray-300"
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}