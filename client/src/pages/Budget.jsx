import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudget, saveBudget } from '../redux/slices/budgetSlice'
import { getDashboardSummary } from '../services/dashboardService'
import { categories, formatCurrency } from '../utils/format'

function Budget() {
  const dispatch = useDispatch()
  const budget = useSelector((state) => state.budget)

  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [categoryBudgets, setCategoryBudgets] = useState([])
  const [summary, setSummary] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(fetchBudget())
    loadSummary()
  }, [dispatch])

  useEffect(() => {
    if (budget?.monthlyBudget !== undefined) {
      setMonthlyBudget(budget.monthlyBudget)
    }
    if (budget?.categories) {
      setCategoryBudgets(budget.categories)
    }
  }, [budget.monthlyBudget, budget.categories])

  const loadSummary = async () => {
    try {
      const response = await getDashboardSummary()
      setSummary(response.data.data)
    } catch (err) {
      console.error('Failed to load dashboard summary', err)
    }
  }

  const addCategory = () => {
    setCategoryBudgets((prev) => [...prev, { category: categories[0] || '', limit: 0 }])
  }

  const updateCategory = (i, field, value) => {
    setCategoryBudgets((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item))
    )
  }

  const removeCategory = (i) => {
    setCategoryBudgets((prev) => prev.filter((_, idx) => idx !== i))
  }

  const save = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      await dispatch(saveBudget({ monthlyBudget, categoryBudgets })).unwrap()
      await loadSummary()
      setMessage('Budget saved successfully.')
    } catch (err) {
      console.error('Failed to save budget', err)
    }
  }

  const totalExpense = summary?.totalExpense || 0
  const remaining = monthlyBudget - totalExpense
  const usedPercent = monthlyBudget > 0
    ? Math.min((totalExpense / monthlyBudget) * 100, 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Budget</h1>
        <p className="text-gray-500 mt-1">
          Set your monthly budget and track spending by category.
        </p>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {budget.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {budget.error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
          <form onSubmit={save} className="space-y-5">
            <div>
              <label htmlFor="monthlyBudget" className="block text-gray-700 font-medium mb-1">
                Monthly Budget
              </label>
              <input
                id="monthlyBudget"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter your monthly budget"
                value={monthlyBudget || ''}
                onChange={(e) => setMonthlyBudget(Number(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Category Budgets</h2>
              <button
                type="button"
                onClick={addCategory}
                className="text-sm font-medium text-primary hover:underline"
              >
                + Add Category
              </button>
            </div>

            <div className="space-y-3">
              {categoryBudgets.map((item, i) => {
                const spent = summary?.categoryBreakdown?.find(
                  (entry) => entry.category === item.category
                )?.amount || 0
                const percent = item.limit > 0 ? Math.min((spent / item.limit) * 100, 100) : 0

                return (
                  <div key={i} className="border rounded-md p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={item.category}
                        onChange={(e) => updateCategory(i, 'category', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Category limit"
                        value={item.limit || ''}
                        onChange={(e) => updateCategory(i, 'limit', Number(e.target.value) || 0)}
                        className="w-32 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      />

                      <button
                        type="button"
                        onClick={() => removeCategory(i)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatCurrency(spent)} spent</span>
                      <span>{formatCurrency(item.limit)} limit</span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${percent >= 100 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="submit"
              disabled={budget.loading}
              className="w-full bg-primary text-white font-medium py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              {budget.loading ? 'Saving...' : 'Save Budget'}
            </button>
          </form>
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Monthly Progress</h2>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Spent</span>
              <span className="font-medium text-gray-800">{formatCurrency(totalExpense)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Remaining</span>
              <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(remaining)}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>Budget used</span>
                <span>{usedPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${usedPercent >= 100 ? 'bg-red-500' : 'bg-sky-500'}`}
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
            </div>

            {remaining < 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                You've exceeded your monthly budget.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Budget