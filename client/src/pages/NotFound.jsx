import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function NotFound() {
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md sm:max-w-lg mx-auto">
        <p className="text-6xl sm:text-7xl lg:text-8xl font-bold text-primary">
          404
        </p>

        <h1 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Page not found
        </h1>

        <p className="mt-2 text-sm sm:text-base text-gray-500 px-2 sm:px-0">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto border border-gray-300 rounded-md px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Go Back
          </button>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="w-full sm:w-auto bg-primary text-white rounded-md px-4 py-2.5 sm:py-2 text-sm font-medium hover:opacity-90 transition text-center"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound