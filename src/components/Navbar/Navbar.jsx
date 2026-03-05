import { useState, useEffect, useRef } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import './Navbar.css';

const Navbar = () => {
  const { content } = useSiteContent();
  const navLinks = content.navbar?.links || [];
  const joinButton = content.navbar?.joinButton || {
    label: 'Join Us',
    href: '#join',
    dropdownItems: [
      { id: 1, label: 'Not a Student?', href: '#not-student' },
      { id: 2, label: 'Partner with Us', href: '#partner' }
    ]
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveLink(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [navLinks]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo and Nav Links Group */}
        <div className="navbar-left">
          <a href="#" className="navbar-logo">
            <img src="/logo12.png" alt="Logo" className="logo-image" />
          </a>

          <div className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`navbar-link ${activeLink === link.href.slice(1) ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}

            {/* Mobile: Show Join Us inside menu */}
            <div className="mobile-join-section">
              <a href={joinButton.href} className="join-btn-mobile" onClick={closeMobileMenu}>
                {joinButton.label}
              </a>
              {joinButton.dropdownItems?.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="mobile-dropdown-link"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Join Us Button with Dropdown */}
        <div className="navbar-right">
          <div className="join-dropdown" ref={dropdownRef}>
            <button 
              className="join-btn"
              onClick={toggleDropdown}
              aria-expanded={isDropdownOpen}
            >
              {joinButton.label}
              <svg 
                className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
              <a href={joinButton.href} className="dropdown-item main-link">
                {joinButton.label}
              </a>
              <div className="dropdown-divider"></div>
              {joinButton.dropdownItems?.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <button
            className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
