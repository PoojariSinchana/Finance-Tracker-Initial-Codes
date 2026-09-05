import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { downloadMonthlyReport, getMonthlyReport } from '../services/reportService'
import { formatCurrency, formatDate } from '../utils/format'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function Reports() {
  const now = new Date()
  const [period, setPeriod] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear()
  })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = useMemo(() => ({ month: period.month, year: period.year }), [
    period.month,
    period.year
  ])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getMonthlyReport(params)
        setReport(response.data.data)
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load report.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [params])

  const exportPdf = async () => {
    try {
      const response = await downloadMonthlyReport(params)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      const monthStr = String(period.month).padStart(2, '0')

      link.href = url
      link.download = `finance-report-${period.year}-${monthStr}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to export report.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            View and export your monthly financial reports.
          </p>
        </div>
        <button
          onClick={exportPdf}
          className="w-full sm:w-auto self-start bg-primary text-white font-medium px-4 py-2.5 sm:py-2 rounded-md hover:opacity-90 transition text-sm sm:text-base"
        >
          Export PDF
        </button>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label htmlFor="month" className="block text-gray-700 font-medium mb-1 text-sm">
              Month
            </label>
            <select
              id="month"
              value={period.month}
              onChange={(e) =>
                setPeriod((prev) => ({ ...prev, month: Number(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {MONTHS.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-gray-700 font-medium mb-1 text-sm">
              Year
            </label>
            <input
              id="year"
              type="number"
              value={period.year}
              onChange={(e) =>
                setPeriod((prev) => ({ ...prev, year: Number(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>

      {loading && <p className="text-gray-500 text-sm">Loading report...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {report && !loading && (
        <>
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-white p-3 sm:p-4 shadow-sm">
              <p className="text-gray-500 text-xs sm:text-sm">Income</p>
              <p className="text-lg sm:text-xl font-bold text-green-600 mt-1">
                {formatCurrency(report.totalIncome || 0)}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-3 sm:p-4 shadow-sm">
              <p className="text-gray-500 text-xs sm:text-sm">Expense</p>
              <p className="text-lg sm:text-xl font-bold text-red-600 mt-1">
                {formatCurrency(report.totalExpense || 0)}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-3 sm:p-4 shadow-sm">
              <p className="text-gray-500 text-xs sm:text-sm">Savings</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                {formatCurrency(report.savings || 0)}
              </p>
            </div>
            <div className="rounded-lg border bg-white p-3 sm:p-4 shadow-sm">
              <p className="text-gray-500 text-xs sm:text-sm">Remaining</p>
              <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1">
                {formatCurrency(report.budgetRemaining || 0)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
            <section className="rounded-lg border bg-white p-4 sm:p-5 shadow-sm xl:col-span-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Category Analytics
              </h2>
              <div className="mt-4 h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.categoryBreakdown || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-lg border bg-white p-4 sm:p-5 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Transactions
              </h2>
              <div className="mt-4 max-h-64 sm:max-h-72 space-y-3 overflow-auto">
                {report.transactions?.length > 0 ? (
                  report.transactions.map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between text-sm gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{tx.title}</p>
                        <p className="text-gray-500 text-xs truncate">
                          {tx.category} • {formatDate(tx.transactionDate)}
                        </p>
                      </div>
                      <span
                        className={`font-medium whitespace-nowrap ${
                          tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(tx.amount))}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No transactions for this period.</p>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

export default Reports