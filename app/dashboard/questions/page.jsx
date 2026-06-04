import React from 'react'

function Questions() {
  const questionCards = [
    {
      title: 'Array & String Patterns',
      description: 'Sliding window, two pointers, and substring matching questions for fast coding practice.',
    },
    {
      title: 'Graph & Tree Problems',
      description: 'DFS/BFS, tree traversal, shortest path, and connectivity scenarios.',
    },
    {
      title: 'Dynamic Programming',
      description: 'Memoization and tabulation patterns for common interview challenges.',
    },
    {
      title: 'Linked List & Recursion',
      description: 'Cycle detection, reverse list, recursion depth, and divide-and-conquer questions.',
    },
    {
      title: 'Binary Search',
      description: 'Search and optimization patterns on sorted arrays and answer spaces.',
    },
    {
      title: 'System Design Concepts',
      description: 'High-level architecture, scalability, and tradeoff thinking for interview responses.',
    },
  ]

  return (
    <div className='p-10 space-y-8'>
      <div>
        <h2 className='font-bold text-3xl text-primary'>Interview Practice</h2>
        <p className='text-gray-500 mt-2 max-w-2xl'>
          Choose a question category to start practicing with common interview algorithms, patterns, and coding exercises.
        </p>
      </div>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {questionCards.map((card) => (
          <div key={card.title} className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h3 className='text-xl font-semibold text-gray-900'>{card.title}</h3>
            <p className='mt-3 text-sm text-gray-600'>{card.description}</p>
          </div>
        ))}
      </div>

      <div className='rounded-3xl border border-primary/20 bg-primary/5 p-6'>
        <h3 className='text-lg font-semibold text-primary'>Algorithm Trick</h3>
        <p className='mt-2 text-gray-700'>
          Start by identifying the core pattern: two pointers, sliding window, binary search, recursion, or DP. Use the right data structure, simplify edge cases, and optimize one step at a time.
        </p>
      </div>
    </div>
  )
}

export default Questions
