"use client"
import React, { useEffect } from 'react'

const Seo = ({ title }:any) => {
  useEffect(() => {
    document.title = `BDB Law Portal - ${title}`
  }, [])
  
  return (
    <>
    </>
  )
}

export default Seo;