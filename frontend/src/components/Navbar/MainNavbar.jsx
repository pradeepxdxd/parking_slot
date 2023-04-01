import { Button, InputGroup, ListGroup } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../../services/auth'
import './Navbar.css'

const authenticate = () => {
  return isLoggedIn()
}

function MainNavbar () {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear('token')
    navigate('/')
  }

  return (
    <>
      <nav className='navbar navbar-expand-lg bg-body-tertiary'>
        <div className='container-fluid'>
          {authenticate() ? (
            <NavLink className='navbar-brand' to='dashboard'>
              Dashboard
            </NavLink>
          ) : (
            <NavLink className='navbar-brand' to='/'>
              Parking
            </NavLink>
          )}
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'></ul>
            {authenticate() ? (
              <div className='d-flex'>
                <Button variant='outline-primary' onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            ) : (
              <div className='d-flex'>
                <Button variant='outline-primary' as={Link} to='/'>
                  Login
                </Button>
                <Button variant='outline-danger mx-3' as={Link} to='/signup'>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default MainNavbar
