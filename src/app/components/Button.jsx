import Link from 'next/link'
import React from 'react'

const Button = ({name, redirect}) => {
  return (
    <Link href={redirect}>{name}</Link>
  )
}

export default Button