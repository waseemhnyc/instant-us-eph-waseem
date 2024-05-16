'use client'

import { init } from '@instantdb/react'

import { useState, useRef } from 'react'

// ---------
// Helpers
// ---------
function Button({ children, onClick }) {
  return (
    <button
      className="px-2 py-1 outline hover:bg-gray-200 focus:outline-amber-500 focus:outline-2"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// ---------
// App
// ---------

// Replace this with your own App ID from https://instantdb.com/dash
const APP_ID = 'REPLACE_ME'

// Initialize connection to InstantDB app
const db = init({ appId: APP_ID })

function App() {
  // Read from InstantDB
  const { isLoading, error, data } = db.useQuery({ messages: {} })
  const inputRef = useRef(null)
  const [editId, setEditId] = useState(null)

  if (isLoading) {
    return <div>Fetching data...</div>
  }
  if (error) {
    return <div className='p-2 font-mono'>{JSON.stringify(error, null, 2)}</div>
  }
  const { messages } = data

  const onSubmit = () => {
    console.log("(TODO): Add message")
  }

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  };

  return (
    <div className='p-4 space-y-6 w-full sm:w-[640px] mx-auto'>
      <h1 className='text-2xl font-bold'>Logged in as: (TODO) Implement auth</h1>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between border-b border-b-gray-500 pb-2 space-x-2">
          <div className="flex flex-1" >
            <input
              ref={inputRef}
              className="flex-1 py-1 px-2 focus:outline-2 focus:outline-amber-500"
              autoFocus
              placeholder="Enter some message..."
              onKeyDown={onKeyDown}
              type="text"
            />
          </div>
          <Button onClick={onSubmit}>Submit</Button>

        </div>
        <div className="truncate text-xs text-gray-500">
          (TODO) Replace me with a typing indicator!
        </div>
      </div>

      <div className="space-y-2">
        {messages.map((message) => (
          <div key={message.id}>
            {editId === message.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  console.log("(TODO) Implement update message")
                  setEditId(null)
                }}
              >
                <input
                  defaultValue={message.text}
                  autoFocus
                  type="text"
                />
              </form>
            ) : (
              <div className="flex justify-between">
                <p>(TODO) Show message author: {message.text}</p>
                <span className="space-x-4">
                  <Button onClick={() => setEditId(message.id)}>Edit</Button>
                  <Button onClick={() => console.log("(TODO) Implement delete message")}>Delete</Button>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="border-b border-b-gray-300 pb-2">(TODO) Who's online:</div>
      <Button onClick={() => console.log("(TODO) Implement delete all")}>Delete All</Button>
    </div>
  )
}

export default App
