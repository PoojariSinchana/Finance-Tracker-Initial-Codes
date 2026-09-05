import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import SummaryCard from '../components/dashboard/SummaryCard'
import { getDashboardSummary } from '../services/dashboardService'
import { formatCurrency, formatDate } from '../utils/format'

const COLORS = ['#2563eb', '#059669', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2']

function Dashboard() {
  const location = useLocation()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
  setLoading(true)
  setError('')
  try {
    const response = await getDashboardSummary()
    if (!cancelled) setSummary(response.data.data)
  } catch (err) {
    if (!cancelled) setError(err?.response?.data?.message || err.message || 'Failed to load dashboard summary.')
  } finally {
    if (!cancelled) setLoading(false)
  }
}

    load()

    const onFocus = () => load()
    window.addEventListener('focus', onFocus)

    return () => {
      cancelled = true
      window.removeEventListener('focus', onFocus)
    }
  }, [location.key])

  if (loading) {
    return <div className="text-gray-500 py-10 text-center">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  const trend = summary?.monthlyTrend || []
  const categories = summary?.categoryBreakdown || []
  const incomeExpense = trend.map((item) => ({
    month: item.month,
    Income: item.income,
    Expense: item.expense
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          An overview of your income, spending, and budget health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard label="Total Income" value={formatCurrency(summary?.totalIncome || 0)} />
      <SummaryCard label="Total Expense" value={formatCurrency(summary?.totalExpense || 0)} />
      <SummaryCard label="Remaining Budget" value={formatCurrency(summary?.remainingBudget || 0)} />
      <SummaryCard label="Savings" value={formatCurrency(summary?.savings || 0)} />
    </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800">Monthly Spending Trend</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} dot={false} name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Category Distribution</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => entry.category}
                >
                  {categories.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800">Income vs Expense</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpense}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="Income" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          <div className="mt-4 space-y-3">
            {summary?.recentTransactions?.length > 0 ? (
              summary.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{tx.title}</p>
                    <p className="text-gray-500 text-xs">
                      {tx.category} • {formatDate(tx.date)}
                    </p>
                  </div>
                  <span
                    className={`font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(Math.abs(tx.amount))}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No transactions yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard