import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import { X } from 'lucide-react'

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Budget', path: '/budget' },
    { label: 'Insights', path: '/insights' },
    { label: 'Reports', path: '/reports' },
    { label: 'Profile', path: '/profile' }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleNavClick = () => {
    onClose?.()
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-primary text-white h-screen flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">FinTrack</h1>
            <p className="text-sm text-gray-300 mt-1">Personal Finance Manager</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-300 hover:text-white"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`block rounded-md px-4 py-2.5 text-sm font-medium transition ${
                isActive(item.path)
                  ? 'bg-white/20 text-white'
                  : 'text-gray-200 hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full rounded-md px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-white/10 transition text-left"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar