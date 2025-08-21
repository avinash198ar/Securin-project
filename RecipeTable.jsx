import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

export default function RecipeTable({ onSelect }) {
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [total, setTotal] = useState(0)

  const [title, setTitle] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [rating, setRating] = useState('')
  const [totalTime, setTotalTime] = useState('')
  const [calories, setCalories] = useState('')

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  useEffect(() => {
    axios.get(`/api/recipes?page=${page}&limit=${limit}`).then(res => {
      setRows(res.data.data || [])
      setTotal(res.data.total || 0)
    })
  }, [page, limit])

  const onSearch = async (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (title) params.append('title', title)
    if (cuisine) params.append('cuisine', cuisine)
    if (rating) params.append('rating', rating)
    if (totalTime) params.append('total_time', totalTime)
    if (calories) params.append('calories', calories)
    const res = await axios.get(`/api/recipes/search?${params.toString()}`)
    setRows(res.data.data || [])
    setTotal(res.data.data?.length || 0)
    setPage(1)
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <form onSubmit={onSearch} className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
        <input className="border rounded px-2 py-1" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Cuisine" value={cuisine} onChange={e=>setCuisine(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Rating (>=4.5, =5)" value={rating} onChange={e=>setRating(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Total Time (<=120)" value={totalTime} onChange={e=>setTotalTime(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Calories (<=400)" value={calories} onChange={e=>setCalories(e.target.value)} />
        <button className="bg-black text-white rounded px-3 py-1">Search</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Title</th>
              <th className="p-2">Cuisine</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Total Time</th>
              <th className="p-2">Serves</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="p-3 text-center" colSpan="5">No results found</td></tr>
            ) : rows.map((r, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(r)}>
                <td className="p-2 truncate max-w-xs" title={r.title}>{r.title}</td>
                <td className="p-2">{r.cuisine}</td>
                <td className="p-2">{r.rating ?? '-'}</td>
                <td className="p-2">{r.total_time ?? '-'}</td>
                <td className="p-2">{r.serves ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span>Per page:</span>
          <select className="border rounded px-2 py-1" value={limit} onChange={e => setLimit(Number(e.target.value))}>
            {[15,20,30,40,50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <span>{page} / {totalPages}</span>
          <button className="px-3 py-1 border rounded" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
        </div>
      </div>
    </div>
  )
}
