import React, { useState } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <header className='header'>
        <div className='headerTop'>
          <Link to="/" className='logo-div'><h1 className='logo'><div className='vd'>VD</div> Malária</h1></Link>
          <label className="burger" for="burger">
            <input type="checkbox" id="burger" checked={isChecked} onChange={handleCheckboxChange}/>
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
        <nav className={`navigation ${isChecked ? 'open' : ''}`}>
          <Link className='link' to="/">Home</Link>
          <Link className='link' to="/sobre">Sobre</Link>
          <Link className='link' to="/dashboard">Dashboard</Link>
          <Link className='link' to="/visualizacao">Visualização</Link>
        </nav>
    </header>
  )
}

export default Header