import React from 'react'
import { useSelector } from 'react-redux'

export default function Slots () {
  const value = useSelector(state => state.bookReducer.state)
  console.log(value)
  console.log(value.from)
  return (
    <>
      <h1>{value.vehicle}</h1>
      {/* <h1>{value.from}</h1> */}
      {/* <h1>{value.to}</h1> */}
    </>
  )
}
