import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInsights, fetchPrediction } from '../redux/slices/insightSlice'
import { formatCurrency } from '../utils/format'

function Insights() {
  const dispatch = useDispatch()
  const { insights, predictions, provider, loading, error } = useSelector(
    (state) => state.insights
  )

  useEffect(() => {
    dispatch(fetchInsights())
    dispatch(fetchPrediction())
  }, [dispatch])

  const refresh = () => {
    dispatch(fetchInsights())
    dispatch(fetchPrediction())
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Insights</h1>
          <p className="text-gray-500 mt-1">
            AI-powered recommendations and predictions based on your spending.
          </p>
        </div>
        <button
          onClick={refresh}
          className="self-start rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Refresh Insights
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Recommendations</h2>
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {provider || 'heuristic'}
            </span>
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm">Generating insights...Running</p>
          ) : insights?.length > 0 ? (
            <div className="space-y-3">
            <p style={{ color: 'blue', fontWeight: 'bold' }}>
              DEBUG: insights.length = {insights?.length ?? 'undefined'}
            </p>
            {insights.map((insight, i) => (
              <div
                key={i}
                className="border rounded-md p-3 flex gap-3 items-start"
              >
                <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0 bg-sky-500" />
                <p className="text-gray-700 text-sm">{JSON.stringify(insight)}</p>
              </div>
            ))}
          </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Add transactions to generate insights.
            </p>
          )}
        </section>

        <section className="rounded-lg border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Spending Prediction</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Predicted Expense</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency(predictions?.predictedExpense || 0)}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <span>Confidence</span>
                <span>{predictions?.confidence || 0}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${predictions?.confidence || 0}%` }}
                />
              </div>
            </div>

            {predictions?.budgetRisk && (
              <div className="bg-amber-100 border border-amber-400 text-amber-700 px-3 py-2 rounded text-sm">
                Predicted spending is above your monthly budget.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Insights