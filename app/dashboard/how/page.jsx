import React from 'react'

function HowItWorks() {
  const steps = [
    {
      title: 'Setup your profile',
      description: 'Create your account, choose a role, and select the interview category you want to practice.',
    },
    {
      title: 'Generate question sets',
      description: 'Use AI-generated question sets for algorithms, system design, or behavioral rounds.',
    },
    {
      title: 'Answer with confidence',
      description: 'Type or record your responses, then review the flow and structure of your answer.',
    },
    {
      title: 'Get instant feedback',
      description: 'See AI suggestions on what to improve, including clarity, structure, and technical accuracy.',
    },
    {
      title: 'Repeat and improve',
      description: 'Practice again with new questions and use feedback to refine your interview skills.',
    },
  ]

  return (
    <div className='p-10 space-y-8'>
      <div>
        <h2 className='font-bold text-3xl text-primary'>How it Works?</h2>
        <p className='text-gray-500 mt-2 max-w-2xl'>Follow the full interview workflow from setup to feedback and keep improving with every session.</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {steps.map((step, index) => (
          <div key={step.title} className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-2xl font-bold text-primary'>{index + 1}</span>
              <span className='text-sm font-semibold text-gray-500'>Step {index + 1}</span>
            </div>
            <h3 className='mt-4 text-xl font-semibold text-gray-900'>{step.title}</h3>
            <p className='mt-3 text-sm text-gray-600'>{step.description}</p>
          </div>
        ))}
      </div>

      <div className='rounded-3xl border border-primary/20 bg-primary/5 p-6'>
        <h3 className='text-lg font-semibold text-primary'>Recommended workflow</h3>
        <p className='mt-2 text-gray-700'>
          Start with setup, practice a few question rounds, review the AI feedback, then repeat until you feel ready for a real interview.
        </p>
      </div>
    </div>
  )
}

export default HowItWorks
