'use client'

import { init, tx, id } from '@instantdb/react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

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
const APP_ID = 'b81d1f91-431e-4980-8e96-2a75f7c84cce'

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
    console.log(inputRef.current.value)
    console.log("(TODO): Add message")
    db.transact(
      tx.messages[id()].update({
        text: inputRef.current.value,
        createdAt: Date.now(),
      })
    )
  }

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  };

  return (
    <div className='p-4 space-y-6 w-full sm:w-[640px] mx-auto'>
      <LoginButton />
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
                  // console.log(e.target[0].value)
                  db.transact(tx.messages[message.id].update({ text: e.target[0].value }))
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
                  <Button onClick={() => {
                    console.log("(TODO) Implement delete message")
                    // db.transact(tx.todos[todo.id].delete())
                    db.transact(
                      tx.messages[message.id].delete()
                    )
                  }}>Delete</Button>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="border-b border-b-gray-300 pb-2">(TODO) Who's online:</div>
      <Button onClick={() => {
        console.log("(TODO) Implement delete all")
        db.transact(
          // goals.map(g => tx.goals[g.id].delete())
          messages.map(m => tx.messages[m.id].delete())
        )
      }}>Delete All</Button>
    </div>
  )
}

// e.g. 89602129-cuf0j.apps.googleusercontent.com
const GOOGLE_CLIENT_ID = '921259245874-pcm05ifilbfce4gk36k1l3sl4m38d159.apps.googleusercontent.com';

// Use the google client name in the Instant dashboard auth tab
const GOOGLE_CLIENT_NAME = 'Instant Demo 0516';

function LoginButton() {
  const [nonce] = useState(crypto.randomUUID());

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        nonce={nonce}
        onError={() => alert('Login failed')}
        onSuccess={({ credential }) => {
          db.auth
            .signInWithIdToken({
              clientName: GOOGLE_CLIENT_NAME,
              idToken: credential,
              // Make sure this is the same nonce you passed as a prop
              // to the GoogleLogin button
              nonce,
            })
            .catch((err) => {
              alert('Uh oh: ' + err.body?.message);
            });
        }}
      />
    </GoogleOAuthProvider>
  );
}

export default App
