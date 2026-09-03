import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactions,
  removeTransactionById,
  saveTransaction
} from '../redux/slices/transactionSlice'
import { categories, formatCurrency, formatDate, paymentMethods } from '../utils/format'

const emptyForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'upi',
  description: '',
  transactionDate: new Date().toISOString().slice(0, 10)
}

const emptyFilters = {
  search: '',
  type: '',
  category: '',
  sort: 'latest',
  page: 1
}

function Transactions() {
  const dispatch = useDispatch()
  const { transactions, pagination, loading, error } = useSelector(
    (state) => state.transactions
  )

  const [filters, setFilters] = useState(emptyFilters)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const query = useMemo(() => ({ ...filters, limit: 10 }), [
    filters.search,
    filters.type,
    filters.category,
    filters.sort,
    filters.page
  ])

  useEffect(() => {
    dispatch(fetchTransactions(query))
  }, [dispatch, query])

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value, page: field === 'page' ? value : 1 }))
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditingId(item._id)
    setForm({
      type: item.type,
      title: item.title,
      amount: item.amount,
      category: item.category,
      paymentMethod: item.paymentMethod,
      description: item.description || '',
      transactionDate: item.transactionDate?.slice(0, 10) || emptyForm.transactionDate
    })
    setShowForm(true)
  }

  const submitForm = async (event) => {
  event.preventDefault()
  setMessage('')

  if (!form.amount || Number(form.amount) <= 0) {
    setMessage('Amount must be greater than zero.')
    return
  }

  try {
    const payload = { ...form, amount: Number(form.amount) }

    await dispatch(
      saveTransaction({ id: editingId, data: payload })
    ).unwrap()

    setShowForm(false)
    dispatch(fetchTransactions(query))
    setMessage(editingId ? 'Transaction updated.' : 'Transaction added.')
  } catch (err) {
    const text =
      typeof err === 'string'
        ? err
        : err?.message || 'Failed to save transaction.'
    console.error('saveTransaction error:', err)
    setMessage(text)
  }
}

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return

    try {
      await dispatch(removeTransactionById(item._id)).unwrap()
      dispatch(fetchTransactions(query))
      setMessage('Transaction deleted.')
    } catch (err) {
      setMessage(typeof err === 'string' ? err : 'Failed to delete transaction.')
    }
  }

  const page = pagination?.page || 1
  const totalPages = pagination?.pages || pagination?.totalPages || 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-500 mt-1">
            View, filter, and manage your income and expenses.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="self-start bg-primary text-white font-medium px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          Add Transaction
        </button>
      </div>

      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={filters.type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="amount_desc">Amount high→low</option>
            <option value="amount_asc">Amount low→high</option>
          </select>

          <button
            onClick={resetFilters}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            Reset Filters
          </button>
        </div>
      </section>

      {(error || message) && (
        <div
          className={`px-4 py-3 rounded border ${
            error
              ? 'bg-red-100 border-red-400 text-red-700'
              : 'bg-green-100 border-green-400 text-green-700'
          }`}
        >
          {error || message}
        </div>
      )}

      <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions?.length > 0 ? (
                transactions.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.type === 'income'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(item.transactionDate)}</td>
                    <td className="px-4 py-3 text-gray-600">{item.paymentMethod}</td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        item.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(item.amount))}
                    </td>
                    <td className="px-4 py-3 space-x-3">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-primary font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item)}
                        className="text-red-600 font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => updateFilter('page', Math.max(page - 1, 1))}
              disabled={page <= 1}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => updateFilter('page', Math.min(page + 1, totalPages))}
              disabled={page >= totalPages}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingId ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitForm} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Amount</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Payment Method
                </label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Date</label>
                <input
                  type="date"
                  value={form.transactionDate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, transactionDate: e.target.value }))
                  }
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-medium py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions