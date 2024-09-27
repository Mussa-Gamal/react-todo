import { Check, Edit, Trash } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const TodoItems = ({ onTaskCountChange }) => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('todoItems')
    return savedItems ? JSON.parse(savedItems) : []
  })

  const [editText, setEditText] = useState('')
  const editInputRefs = useRef([])
  const addInputRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem('todoItems', JSON.stringify(items))
  }, [items])

  const handleAddTask = () => {
    const text = addInputRef.current.value.trim()

    if (!text) {
      setError('Please enter a task.')
      return
    }

    setError('')

    const newTask = {
      text,
      completed: false,
      edit: false,
      dateAdded: new Date(),
    }
    setItems([...items, newTask])
    addInputRef.current.value = ''
  }

  const handleTaskCompleted = (index) => {
    const newItems = [...items]
    newItems[index].completed = !newItems[index].completed
    setItems(newItems)
  }

  const handleDeleteTask = (index) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleEditClick = (index) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, edit: !item.edit }
      }
      return { ...item, edit: false }
    })
    setItems(newItems)

    if (newItems[index].edit) {
      setEditText(newItems[index].text)
      setTimeout(() => editInputRefs.current[index]?.focus(), 0)
    }
  }

  const handleEditTask = (index) => {
    const newItems = [...items]
    newItems[index].text = editText
    newItems[index].edit = false
    setItems(newItems)
    setEditText('')
  }

  const formatDate = (date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const taskDate = new Date(date)
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true }

    const timeString = taskDate
      .toLocaleTimeString([], timeOptions)
      .toUpperCase() // Capitalize time

    if (taskDate.toDateString() === today.toDateString()) {
      return `Today, ${timeString}`
    } else if (taskDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${timeString}`
    } else {
      return (
        taskDate.toLocaleDateString('en-US', { dateStyle: 'short' }) +
        `, ${timeString}`
      )
    }
  }

  const countCompletedTasks = () => {
    return items.filter((item) => item.completed).length
  }

  useEffect(() => {
    onTaskCountChange(items.length, countCompletedTasks())
  }, [items])

  const handleAddKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask()
    }
  }

  const handleEditKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      handleEditTask(index)
    }
  }

  return (
    <>
      <input
        ref={addInputRef}
        onKeyDown={handleAddKeyDown}
        placeholder='Enter a task...'
        type='text'
        className='w-full sm:mb-3 mb-1 border-2 border-transparent bg-white sm:py-4 py-2 sm:px-8 px-6 rounded-full lg:text-3xl sm:text-2xl text-xl outline-none focus:border-blue-400 duration-200'
      />
      <p className='sm:mb-3 mb-1 sm:text-base text-sm text-rose-600 h-6'>{error}</p>
      <div className='flex items-center justify-center'>
        <ul className='w-full space-y-4 min-h-[374px] rounded-2xl'>
          {items.map(({ text, completed, edit, dateAdded }, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='relative w-full'>
                <div className='bg-white py-5 sm:px-8 px-5 rounded-2xl'>
                  <div
                    onClick={() => handleTaskCompleted(index)}
                    className={`w-full flex items-center justify-between cursor-pointer ${
                      completed ? 'line-through text-gray-300' : ''
                    }`}
                  >
                    <li className='w-full sm:text-2xl text-xl'>{text}</li>
                    <div
                      className={`sm:min-w-8 min-w-7 sm:min-h-8 min-h-7 rounded-full border-[1.75px] flex items-center justify-center duration-200 ${
                        completed
                          ? 'border-[#0760FB] bg-[#0760FB]'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {completed && <Check className='text-white sm:w-5 w-4' />}
                    </div>
                  </div>
                  <div className='bg-gray-200 w-full h-[1px] mt-4 mb-4'></div>
                  <div className='flex sm:flex-row flex-col sm:items-center justify-between sm:gap-0 gap-2'>
                    <p className='text-gray-400 sm:text-base text-sm'>
                      {formatDate(dateAdded)}
                    </p>
                    <div className='flex items-center gap-3'>
                      {edit ? (
                        <button
                          onClick={() => handleEditTask(index)}
                          className='flex items-center gap-2 bg-blue-100 text-blue-600 py-1 px-3 sm:text-base text-sm rounded-lg border-[1.75px] border-transparent hover:border-blue-300 duration-200'
                        >
                          <Check className='w-4' />
                          Apply
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(index)}
                          className='flex items-center gap-2 bg-blue-100 text-blue-600 py-1 px-3 sm:text-base text-sm rounded-lg border-[1.75px] border-transparent hover:border-blue-300 duration-200'
                        >
                          <Edit className='w-4' />
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteTask(index)}
                        className='flex items-center gap-2 bg-rose-100 text-rose-600 py-1 px-3 sm:text-base text-sm rounded-lg border-[1.75px] border-transparent hover:border-rose-300 duration-200'
                      >
                        <Trash className='w-4' />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  ref={(el) => (editInputRefs.current[index] = el)}
                  onKeyDown={(e) => handleEditKeyDown(e, index)}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={`w-full top-0 left-0 bg-white pt-5 sm:px-8 px-5 sm:text-2xl text-xl rounded-2xl outline-none absolute ${
                    edit ? '' : 'hidden'
                  }`}
                />
              </div>
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}

export default TodoItems
