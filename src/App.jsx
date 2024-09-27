import { useState } from 'react'
import TodoItems from './components/TodoItems'

const App = () => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  const currentDate = new Date().toLocaleDateString('en-US', options)
  const [count, setCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  const handleTaskCountChange = (count, completedCount) => {
    setCount(count)
    setCompletedCount(completedCount)
  }

  return (
    <div className='py-10 lg:px-20 px-10'>
      <div className='w-full flex md:flex-row flex-col md:items-end justify-between md:gap-0 gap-1 mb-8'>
        <div className='flex flex-col gap-1 justify-center items-start'>
          <h1 className='helveticanow-bold sm:text-4xl text-3xl'>Today's Tasks</h1>
          <p className='text-gray-400 sm:text-base text-sm'>{currentDate}</p>
        </div>
        <p className='helveticanow-medium text-blue-600 sm:text-base text-sm'>
          {count === 0
            ? 'You currently have no tasks. Start adding some to make progress!'
            : completedCount === 0
            ? 'You haven’t completed any tasks yet. Keep going!'
            : count === completedCount
            ? 'Congratulations! You’ve completed all your tasks!'
            : `You've completed ${completedCount} out of ${count} tasks. Keep it up!`}
        </p>
      </div>
      <TodoItems onTaskCountChange={handleTaskCountChange} />
      <p className='mt-10 text-gray-400 sm:text-base text-sm'>
        This to-do application was developed by{' '}
        <a href='https://www.linkedin.com/in/mussa-gamal/' className='underline text-blue-500 hover:no-underline'>Mussa Gamal</a> utilizing Vite +
        React and Tailwind CSS.
      </p>
    </div>
  )
}

export default App
