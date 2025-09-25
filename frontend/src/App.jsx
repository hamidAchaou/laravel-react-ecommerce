import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Test Heading */}
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        🚀 Tailwind CSS is working!
      </h1>

      {/* Test Button */}
      <button
        onClick={() => setCount(count + 1)}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
      >
        Clicked {count} times
      </button>

      {/* Test Card */}
      <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg">
        <p className="text-gray-700">
          This is a Tailwind styled card. 🎨
        </p>
      </div>
    </div>
  )
}

export default App