import { useSelector } from 'react-redux'
import { Menu } from 'lucide-react'

function Navbar({ onMenuClick }) {
  const { user } = useSelector((state) => state.auth)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-800"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            Finance Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar