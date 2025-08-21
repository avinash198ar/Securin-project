import React from 'react'

export default function RecipeDrawer({ recipe, onClose }) {
  return (
    <div className={
      "fixed top-0 right-0 h-full w-full md:w-[32rem] bg-white shadow-2xl transition-transform duration-300 " + 
      (recipe ? "translate-x-0" : "translate-x-full")
    }>
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{recipe?.title}</h2>
          <p className="text-gray-500">{recipe?.cuisine}</p>
        </div>
        <button className="border rounded px-3 py-1" onClick={onClose}>Close</button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-4rem)]">
        {!recipe ? (
          <div className="text-gray-500">No data available</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500 text-sm">Description</div>
                <div className="whitespace-pre-wrap">{recipe.description || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Total Time</div>
                <div>{recipe.total_time ?? '-'}</div>
              </div>
            </div>

            <details className="border rounded p-3">
              <summary className="cursor-pointer font-medium">Prep & Cook Time</summary>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div><span className="text-gray-500 text-sm">Prep Time:</span> {recipe.prep_time ?? '-'}</div>
                <div><span className="text-gray-500 text-sm">Cook Time:</span> {recipe.cook_time ?? '-'}</div>
              </div>
            </details>

            <div>
              <div className="font-medium mb-2">Nutrients</div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border">
                  <thead>
                    <tr className="text-left">
                      <th className="p-2 border">Field</th>
                      <th className="p-2 border">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe?.nutrients ? Object.entries(recipe.nutrients).map(([k,v]) => (
                      <tr key={k}>
                        <td className="p-2 border">{k}</td>
                        <td className="p-2 border">{String(v)}</td>
                      </tr>
                    )) : (
                      <tr><td className="p-2 border" colSpan="2">No nutrients data</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
