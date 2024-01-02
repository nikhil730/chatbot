import React from 'react'
import VectorImage from '../assets/images/Vector.png';
import '../styles/Header.css'

function Header() {
  return (
    <div>
      <div className="navbar">
        <div className="vector-wrapper">
          <img className="vector-icon" alt="VectorImage" src={VectorImage} />
        </div>
      </div>
    </div>
  )
}

export default Header
