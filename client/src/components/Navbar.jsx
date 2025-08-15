import React, { useState, useEffect, useRef } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
import NotificationIcon from './NotificationIcon'

const Navbar = () => {

    const {setShowLogin, showLoginWithRedirect, user, logout, isOwner, axios, setIsOwner, authLoading} = useAppContext()

    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const navigate = useNavigate()
    const dropdownRef = useRef(null)

    const changeRole = async ()=>{
        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (data.success) {
                setIsOwner(true)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Failed to update account status. Please try again.')
        }
    }

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownOpen])

  return (
    <motion.nav
      initial={{y: -20, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.5}}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        location.pathname === "/" 
          ? "bg-white/80 backdrop-blur-xl border-b border-white/20" 
          : "bg-white border-b border-gray-200"
      } shadow-lg`}
    >
      <div className='flex items-center justify-between px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-4'>

        {/* Logo */}
        <Link to='/'>
          <motion.img 
            whileHover={{scale: 1.05}} 
            src={assets.logo} 
            alt="logo" 
            className="h-8 filter drop-shadow-sm"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-8'>
          
          {/* Navigation Links */}
          <div className='flex items-center gap-6'>
            <Link
              to="/cars"
              className='text-gray-700 hover:text-primary transition-colors duration-200 font-medium relative group'
            >
              Cars
              <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full'></span>
            </Link>

            {user && (
              <Link
                to="/my-bookings"
                className='text-gray-700 hover:text-primary transition-colors duration-200 font-medium relative group'
              >
                My Bookings
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full'></span>
              </Link>
            )}

            {/* Quick Search */}
            <div className='relative'>
              <div className='flex items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-full hover:border-primary/50 transition-colors duration-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10'>
                <input
                  type="text"
                  className="bg-transparent outline-none placeholder-gray-500 text-sm w-32 lg:w-40"
                  placeholder="Search cars..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      navigate(`/cars?search=${encodeURIComponent(e.target.value.trim())}`);
                    }
                  }}
                />
                <img src={assets.search_icon} alt="search" className='w-4 h-4 opacity-60 ml-2'/>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className='flex items-center gap-4'>
            {user && <NotificationIcon />}

            {/* More Options Dropdown */}
            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors duration-200'
              >
                <img src={assets.menu_icon} alt="menu" className='w-4 h-4'/>
                <span className='text-sm font-medium'>More</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className='absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden'
                >
                  <div className='py-2'>
                    <Link
                      to="/"
                      className='flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors'
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className='text-lg'>🏠</span>
                      Home
                    </Link>
                    <Link
                      to="/about-us"
                      className='flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors'
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className='text-lg'>ℹ️</span>
                      About Us
                    </Link>

                    {user && (
                      <>
                        <div className='border-t border-gray-100 my-2'></div>

                        <Link
                          to="/profile"
                          className='flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors'
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className='text-lg'>👤</span>
                          My Profile
                        </Link>

                        {isOwner ? (
                          <>
                            <Link
                              to="/owner"
                              className='flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/5 transition-colors text-primary font-medium'
                              onClick={() => setDropdownOpen(false)}
                            >
                              <span className='text-lg'>📊</span>
                              Owner Dashboard
                            </Link>
                            <button
                              onClick={() => {navigate('/owner/add-car'); setDropdownOpen(false)}}
                              className='flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors'
                            >
                              <span className='text-lg'>➕</span>
                              Add Car
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {changeRole(); setDropdownOpen(false)}}
                            className='flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-green-50 transition-colors text-green-600 font-medium'
                          >
                            <span className='text-lg'>🏆</span>
                            Become Owner
                          </button>
                        )}

                        <div className='border-t border-gray-100 my-2'></div>
                        <div className='px-4 py-3 bg-gray-50'>
                          <div className='text-xs text-gray-500 mb-1'>Signed in as</div>
                          <div className='text-sm font-medium text-gray-700'>{user.name}</div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Login/Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={()=> {user ? logout() : showLoginWithRedirect()}}
              disabled={authLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {authLoading ? 'Loading...' : (user ? 'Logout' : 'Login')}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed h-screen w-full top-20 right-0 flex flex-col gap-6 p-6 transition-all duration-300 z-40 ${
          location.pathname === "/" ? "bg-white/95 backdrop-blur-xl" : "bg-white"
        } ${open ? "translate-x-0" : "translate-x-full"} border-t border-gray-200`}>
          
          {/* Mobile Menu Items */}
          <div className='space-y-4'>
            <Link
              to="/"
              className='flex items-center gap-3 text-lg py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors'
              onClick={() => setOpen(false)}
            >
              <span className='text-xl'>🏠</span>
              Home
            </Link>

            <Link
              to="/cars"
              className='flex items-center gap-3 text-lg py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors'
              onClick={() => setOpen(false)}
            >
              <span className='text-xl'>🚗</span>
              Cars
            </Link>

            {user && (
              <>
                <Link
                  to="/my-bookings"
                  className='flex items-center gap-3 text-lg py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors'
                  onClick={() => setOpen(false)}
                >
                  <span className='text-xl'>📋</span>
                  My Bookings
                </Link>

                <Link
                  to="/profile"
                  className='flex items-center gap-3 text-lg py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors'
                  onClick={() => setOpen(false)}
                >
                  <span className='text-xl'>👤</span>
                  My Profile
                </Link>
              </>
            )}

            <Link
              to="/about-us"
              className='flex items-center gap-3 text-lg py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors'
              onClick={() => setOpen(false)}
            >
              <span className='text-xl'>ℹ️</span>
              About Us
            </Link>
          </div>

          {user && (
            <>
              <div className='border-t border-gray-200 pt-4'>
                {isOwner ? (
                  <div className='space-y-3'>
                    <Link
                      to="/owner"
                      className='w-full px-4 py-3 bg-primary/10 text-primary rounded-xl text-center font-semibold flex items-center justify-center gap-2'
                      onClick={() => setOpen(false)}
                    >
                      <span>📊</span>
                      Owner Dashboard
                    </Link>
                    <button
                      onClick={() => {navigate('/owner/add-car'); setOpen(false)}}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-medium flex items-center justify-center gap-2'
                    >
                      <span>➕</span>
                      Add Car
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {changeRole(); setOpen(false)}}
                    className='w-full px-4 py-3 bg-green-50 text-green-600 rounded-xl text-center font-semibold flex items-center justify-center gap-2'
                  >
                    <span>���</span>
                    Become Owner
                  </button>
                )}

                <div className='mt-4 p-4 bg-gray-50 rounded-xl'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='text-xs text-gray-500'>Signed in as</div>
                      <div className='font-medium text-gray-700'>{user.name}</div>
                    </div>
                    <NotificationIcon />
                  </div>
                </div>
              </div>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={()=> {user ? logout() : showLoginWithRedirect(); setOpen(false)}}
            disabled={authLoading}
            className="w-full px-4 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg mt-6 disabled:opacity-50"
          >
            {authLoading ? 'Loading...' : (user ? 'Logout' : 'Login')}
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className='md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200' 
          aria-label="Menu" 
          onClick={()=> setOpen(!open)}
        >
          <img 
            src={open ? assets.close_icon : assets.menu_icon} 
            alt="menu" 
            className='w-6 h-6'
          />
        </button>
      </div>
    </motion.nav>
  )
}

export default Navbar
