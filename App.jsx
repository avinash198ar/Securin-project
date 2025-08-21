import React, { useState } from 'react'
import RecipeTable from './components/RecipeTable.jsx'
import RecipeDrawer from './components/RecipeDrawer.jsx'

export default function App() {
  const [selected, setSelected] = useState(null)
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">US Recipes</h1>
      <RecipeTable onSelect={setSelected} />
      <RecipeDrawer recipe={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
