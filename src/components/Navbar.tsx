import React, { useState, useEffect } from 'react';
import './Navbar.css'

const Navbar: React.FC = () => {
  const [offset, setOffset] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      if (isMenuOpen) return; 
      
      const headerHeight = 110; 
      if (scrollPosition > headerHeight) {
        setOffset(-36);
      } else {
        setOffset(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);  

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header>
      <div 
        className="container" 
        style={{ transform: `translateY(${offset}px)` }}
      >
        <nav className="nav">
          
          <p id="page-name"><span>PORT</span>FOLIO</p>

          
          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
             <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="2" fill="black"/>
                <rect x="2" y="11" width="20" height="2" fill="black"/>
                <rect x="2" y="18" width="20" height="2" fill="black"/>
            </svg>
          </button>

          
          <ul className={`nav-elements ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
            <li><a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a></li>
            <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
            <li><a href="/About.txt" onClick={() => setIsMenuOpen(false)}>About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;