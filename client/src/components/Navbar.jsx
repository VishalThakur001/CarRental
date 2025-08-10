import React, { useState, useEffect, useRef } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
import NotificationIcon from './NotificationIcon'

const Navbar = () => {

    const {setShowLogin, showLoginWithRedirect, user, logout, isOwner, axios, setIsOwner} = useAppContext()

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
    <motion.div
    initial={{y: -20, opacity: 0}}
    animate={{y: 0, opacity: 1}}
    transition={{duration: 0.5}}
    className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3 text-gray-600 border-b border-borderColor relative transition-all ${location.pathname === "/" && "bg-light"}`}>

        {/* Logo */}
        <Link to='/'>
            <motion.img whileHover={{scale: 1.05}} src={assets.logo} alt="logo" className="h-7"/>
        </Link>

        {/* Desktop Navigation - Compact */}
        <div className='hidden md:flex items-center gap-6'>
            {/* Essential Links */}
            <Link
                to="/cars"
                className='hover:text-primary transition-colors duration-200 text-sm font-medium'
            >
                Cars
            </Link>

            {user && (
                <Link
                    to="/my-bookings"
                    className='hover:text-primary transition-colors duration-200 text-sm font-medium'
                >
                    My Bookings
                </Link>
            )}

            {/* Quick Search */}
            <div className='flex items-center text-sm gap-2 border border-borderColor px-3 py-1.5 rounded-full max-w-48 bg-white/50 backdrop-blur-sm'>
                <input
                    type="text"
                    className="py-1 w-full bg-transparent outline-none placeholder-gray-500 text-sm"
                    placeholder="Search cars..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                            navigate(`/cars?search=${encodeURIComponent(e.target.value.trim())}`);
                        }
                    }}
                />
                <img src={assets.search_icon} alt="search" className='w-4 h-4 opacity-60 cursor-pointer'/>
            </div>

            {/* User Actions */}
            <div className='flex items-center gap-3'>
                {user && <NotificationIcon />}

                {/* More Options Dropdown */}
                <div className='relative' ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className='flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:border-primary transition-colors text-sm font-medium'
                    >
                        <img src={assets.menu_icon} alt="menu" className='w-4 h-4'/>
                        <span>More</span>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className='absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'
                        >
                            <div className='py-2'>
                                <Link
                                    to="/"
                                    className='block px-4 py-2 text-sm hover:bg-gray-50 transition-colors'
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    🏠 Home
                                </Link>
                                <Link
                                    to="/about-us"
                                    className='block px-4 py-2 text-sm hover:bg-gray-50 transition-colors'
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    ℹ️ About Us
                                </Link>

                                {user && (
                                    <>
                                        <div className='border-t border-gray-100 my-1'></div>

                                        {isOwner ? (
                                            <>
                                                <Link
                                                    to="/owner"
                                                    className='block px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-blue-600'
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    📊 Owner Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => {navigate('/owner/add-car'); setDropdownOpen(false)}}
                                                    className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors'
                                                >
                                                    ➕ Add Car
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => {changeRole(); setDropdownOpen(false)}}
                                                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-green-600'
                                            >
                                                🏆 Become Owner
                                            </button>
                                        )}

                                        <div className='border-t border-gray-100 my-1'></div>
                                        <div className='px-4 py-2 text-xs text-gray-500'>
                                            Welcome, {user.name}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Login/Logout Button */}
                <button
                    onClick={()=> {user ? logout() : showLoginWithRedirect()}}
                    className="px-4 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg text-sm font-medium"
                >
                    {user ? 'Logout' : 'Login'}
                </button>
            </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden fixed h-screen w-full top-16 border-t border-borderColor right-0 flex flex-col items-start gap-4 p-6 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "translate-x-0" : "translate-x-full"}`}>
            {/* Mobile Menu Items */}
            <Link
                to="/"
                className='hover:text-primary transition-colors duration-200 text-lg py-2'
                onClick={() => setOpen(false)}
            >
                🏠 Home
            </Link>

            <Link
                to="/cars"
                className='hover:text-primary transition-colors duration-200 text-lg py-2'
                onClick={() => setOpen(false)}
            >
                🚗 Cars
            </Link>

            {user && (
                <Link
                    to="/my-bookings"
                    className='hover:text-primary transition-colors duration-200 text-lg py-2'
                    onClick={() => setOpen(false)}
                >
                    📋 My Bookings
                </Link>
            )}

            <Link
                to="/about-us"
                className='hover:text-primary transition-colors duration-200 text-lg py-2'
                onClick={() => setOpen(false)}
            >
                ℹ️ About Us
            </Link>

            {user && (
                <>
                    <div className='w-full border-t border-gray-200 my-2'></div>

                    {isOwner ? (
                        <>
                            <Link
                                to="/owner"
                                className='w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-lg text-center font-medium'
                                onClick={() => setOpen(false)}
                            >
                                📊 Owner Dashboard
                            </Link>
                            <button
                                onClick={() => {navigate('/owner/add-car'); setOpen(false)}}
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg text-center font-medium'
                            >
                                ➕ Add Car
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {changeRole(); setOpen(false)}}
                            className='w-full px-4 py-3 bg-green-50 text-green-600 rounded-lg text-center font-medium'
                        >
                            🏆 Become Owner
                        </button>
                    )}

                    <div className='w-full border-t border-gray-200 my-2'></div>
                    <div className='flex items-center justify-between w-full'>
                        <span className='text-sm font-medium text-gray-700'>
                            Welcome, {user.name}
                        </span>
                        <NotificationIcon />
                    </div>
                </>
            )}

            <button
                onClick={()=> {user ? logout() : showLoginWithRedirect(); setOpen(false)}}
                className="w-full px-4 py-3 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg font-medium mt-4"
            >
                {user ? 'Logout' : 'Login'}
            </button>
        </div>

        <button className='md:hidden cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors duration-200' aria-label="Menu" onClick={()=> setOpen(!open)}>
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className='w-6 h-6'/>
        </button>
      
    </motion.div>
  )
}

export default Navbar
