import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { stateCityMapping, statesList } from '../data/stateCityMapping'
import { useAppContext } from '../context/AppContext'
import {motion} from 'motion/react'

const Hero = () => {

    const [pickupLocation, setPickupLocation] = useState('')
    const [selectedState, setSelectedState] = useState('')

    const {pickupDate, setPickupDate, returnDate, setReturnDate, navigate} = useAppContext()

    const handleSearch = (e)=>{
        e.preventDefault()
        navigate('/cars?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&returnDate=' + returnDate)
    }

  return (
    <div className='min-h-screen bg-gradient-to-br from-light via-white to-purple-50 relative overflow-hidden'>
      
      {/* Background Decorative Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-purple-500/8 to-primary/8 rounded-full blur-3xl'></div>
        <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-8'>
        
        {/* Hero Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[85vh]'>
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='space-y-8'
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 rounded-full text-primary font-medium text-sm'
            >
              <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
              Premium Car Rental Platform
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className='space-y-4'
            >
              <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight'>
                Experience the 
                <span className='text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text block'>
                  Future of Driving
                </span>
              </h1>
              <p className='text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed'>
                Discover premium vehicles, experience luxury, and create unforgettable journeys with our curated collection of cars.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className='grid grid-cols-3 gap-6 pt-4'
            >
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>500+</div>
                <div className='text-sm text-gray-600'>Premium Cars</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>50+</div>
                <div className='text-sm text-gray-600'>Cities</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>10k+</div>
                <div className='text-sm text-gray-600'>Happy Customers</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className='relative flex justify-center lg:justify-end'
          >
            <div className='relative'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl transform rotate-6'></div>
              <img
                src={assets.main_car}
                alt="Premium Car"
                className='relative z-10 max-h-72 sm:max-h-80 lg:max-h-96 xl:max-h-[450px] w-auto object-contain filter drop-shadow-2xl'
              />
            </div>
          </motion.div>
        </div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='mt-12 lg:mt-20'
        >
          <div className='max-w-6xl mx-auto'>
            <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10'>
              
              {/* Card Header */}
              <div className='text-center mb-8'>
                <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
                  Find Your Perfect Ride
                </h2>
                <p className='text-gray-600'>
                  Choose your destination and dates to start your journey
                </p>
              </div>

              <form onSubmit={handleSearch} className='space-y-8'>
                
                {/* Search Fields */}
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                  
                  {/* State Selection */}
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                      <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                        <img src={assets.location_icon} alt="location" className='w-3 h-3'/>
                      </div>
                      State
                    </label>
                    <div className='relative'>
                      <select
                        required
                        value={selectedState}
                        onChange={(e)=> {
                          setSelectedState(e.target.value)
                          setPickupLocation('')
                        }}
                        className='w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl outline-none text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 appearance-none cursor-pointer'
                      >
                        <option value="">Choose State</option>
                        {statesList.map((state, index)=> <option key={`${state}-${index}`} value={state}>{state}</option>)}
                      </select>
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* City Selection */}
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                      <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                        <img src={assets.location_icon} alt="location" className='w-3 h-3'/>
                      </div>
                      City
                    </label>
                    <div className='relative'>
                      <select
                        required
                        value={pickupLocation}
                        onChange={(e)=>setPickupLocation(e.target.value)}
                        disabled={!selectedState}
                        className='w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 appearance-none cursor-pointer'
                      >
                        <option value="">{selectedState ? 'Choose City' : 'Select state first'}</option>
                        {selectedState && stateCityMapping[selectedState] &&
                          stateCityMapping[selectedState].map((city, index)=> <option key={`${city}-${index}`} value={city}>{city}</option>)
                        }
                      </select>
                      <div className='absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Date */}
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                      <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                        <img src={assets.calendar_icon_colored} alt="calendar" className='w-3 h-3'/>
                      </div>
                      Pick-up Date
                    </label>
                    <input
                      value={pickupDate}
                      onChange={e=>setPickupDate(e.target.value)}
                      type="date"
                      min={(() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      })()}
                      className='w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl outline-none text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                      required
                    />
                  </div>

                  {/* Return Date */}
                  <div className='space-y-2'>
                    <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                      <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                        <img src={assets.calendar_icon_colored} alt="calendar" className='w-3 h-3'/>
                      </div>
                      Return Date
                    </label>
                    <input
                      value={returnDate}
                      onChange={e=>setReturnDate(e.target.value)}
                      type="date"
                      className='w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl outline-none text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                      required
                    />
                  </div>
                </div>
                
                {/* Search Button */}
                <div className='flex justify-center pt-4'>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className='px-12 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3'
                  >
                    <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
                      <img src={assets.search_icon} alt="search" className='brightness-300 w-4 h-4'/>
                    </div>
                    <span>Search Available Cars</span>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
