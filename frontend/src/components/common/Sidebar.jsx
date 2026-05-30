import { NavLink } from 'react-router-dom';

export default function Sidebar({ links }) {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition ${
                isActive ? 'bg-indigo-600' : 'hover:bg-gray-700'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
