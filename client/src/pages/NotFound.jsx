import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function NotFound() {
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Page not found</h1>
        <p className="mt-2 text-gray-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Go Back
          </button>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="bg-primary text-white rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound