import React from 'react'
import Link  from 'next/link'
import styled from "styled-components"


const HeroWrapper = styled.div`
background-color: #bada55;
height: 20vh;
width:100%;
display:flex;
align-items:center;
justify-content: center;
`


const Hero = (page) => {
  console.log ("Page", page.router)
  return (
    <HeroWrapper>
    <h1>{page.router}</h1>
    </HeroWrapper>
  )
}

export default Hero