import React from 'react'

export default function Square({black,children}) {
  return (
    <div color={black && 'black'}>
      {children && children}
    </div>
  )
}
