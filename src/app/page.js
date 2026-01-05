'use client'


import React, { use, useEffect } from 'react'
import { io } from 'socket.io-client'

export const App = () => {
  const socket = io('http://localhost:4000')

  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected",socket.id)
    })
  },[])

  return (
    <div>App</div>
  )
}

export default App
