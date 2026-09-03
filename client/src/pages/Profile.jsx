import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileThunk } from '../redux/slices/authSlice'
import { changePassword, getAccountStats } from '../services/authService'
import { formatCurrency } from '../utils/format'

function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [stats, setStats] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '' })
    }
    loadStats()
  }, [user])

  const loadStats = async () => {
    try {
      const data = await getAccountStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load account stats', err)
    }
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await dispatch(updateProfileThunk(profile)).unwrap()
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err?.message || 'Failed to update profile.')
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await changePassword(passwords)
      setPasswords({ currentPassword: '', newPassword: '' })
      setMessage('Password changed successfully.')
    } catch (err) {
      setError(err?.message || 'Failed to change password.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your account details, password, and view your activity.
        </p>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
          <form onSubmit={saveProfile} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-primary text-white font-medium px-4 py-2 rounded-md hover:opacity-90 transition"
              >
                Save Profile
              </button>
            </div>
          </form>

          <h2 className="text-lg font-semibold text-gray-800 mt-8">Change Password</h2>
          <form onSubmit={savePassword} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-primary text-white font-medium px-4 py-2 rounded-md hover:opacity-90 transition"
              >
                Change Password
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Account Statistics</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Transactions</span>
              <span className="font-medium text-gray-800">
                {stats?.transactionCount ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Income</span>
              <span className="font-medium text-green-600">
                {formatCurrency(stats?.totalIncome || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expenses</span>
              <span className="font-medium text-red-600">
                {formatCurrency(stats?.totalExpense || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Savings</span>
              <span className="font-medium text-gray-800">
                {formatCurrency(stats?.savings || 0)}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile