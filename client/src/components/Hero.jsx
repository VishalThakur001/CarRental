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
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className='min-h-screen flex flex-col items-center justify-center gap-8 sm:gap-12 lg:gap-14 bg-gradient-to-br from-light via-white to-blue-50 text-center px-4 relative overflow-hidden'>

      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 to-blue-500/3 rounded-full blur-3xl'></div>
      </div>

        <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='relative z-10'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4'>
            Luxury Cars on Rent
          </h1>
          <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium'>
            Discover premium vehicles for your perfect journey
          </p>
        </motion.div>

      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        className='relative z-10 mb-8'>
        <img
          src={assets.main_car}
          alt="car"
          className='max-h-48 sm:max-h-60 md:max-h-72 lg:max-h-80 xl:max-h-96 w-auto object-contain filter drop-shadow-2xl'
        />
      </motion.div>

      <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className='w-full max-w-6xl xl:max-w-7xl relative z-20 mb-8'>

        {/* Modern Search Card */}
        <div className='bg-white backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-6 sm:p-8 lg:p-10 hover:shadow-3xl transition-all duration-500 ring-1 ring-gray-200/20'>
          <div className='mb-6'>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>Find Your Perfect Ride</h2>
            <p className='text-gray-600 text-sm sm:text-base'>Choose your destination and dates to get started</p>
          </div>

          <form onSubmit={handleSearch} className='space-y-6'>

            {/* Location Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
                    <img src={assets.location_icon} alt="location" className='w-4 h-4 opacity-60'/>
                  </div>
                  <h3 className='font-semibold text-gray-800'>Location</h3>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='relative'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>State</label>
                    <div className='relative'>
                      <select
                        required
                        value={selectedState}
                        onChange={(e)=> {
                          setSelectedState(e.target.value)
                          setPickupLocation('') // Reset city when state changes
                        }}
                        className='w-full px-4 py-4 pr-10 border border-gray-300 rounded-xl outline-none bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md transition-all duration-300 appearance-none cursor-pointer'
                      >
                        <option value="">Choose State</option>
                        {statesList.map((state, index)=> <option key={`${state}-${index}`} value={state}>{state}</option>)}
                      </select>
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                      </div>
                    </div>
                    {selectedState && <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full'></div>}
                  </div>
                  <div className='relative'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>City</label>
                    <div className='relative'>
                      <select
                        required
                        value={pickupLocation}
                        onChange={(e)=>setPickupLocation(e.target.value)}
                        disabled={!selectedState}
                        className='w-full px-4 py-4 pr-10 border border-gray-300 rounded-xl outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md transition-all duration-300 appearance-none cursor-pointer'
                      >
                        <option value="">{selectedState ? 'Choose City' : 'Select state first'}</option>
                        {selectedState && stateCityMapping[selectedState] &&
                          stateCityMapping[selectedState].map((city, index)=> <option key={`${city}-${index}`} value={city}>{city}</option>)
                        }
                      </select>
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none'>
                        <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                      </div>
                    </div>
                    {!selectedState && (
                      <p className='text-xs text-amber-600 mt-1 flex items-center gap-1'>
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                        </svg>
                        Please select a state first
                      </p>
                    )}
                    {pickupLocation && <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full'></div>}
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
                    <img src={assets.calendar_icon_colored} alt="calendar" className='w-4 h-4'/>
                  </div>
                  <h3 className='font-semibold text-gray-800'>Rental Period</h3>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='relative'>
                    <label htmlFor='pickup-date' className='block text-sm font-medium text-gray-700 mb-2'>Pick-up Date</label>
                    <div className='relative'>
                      <input
                          value={pickupDate}
                          onChange={e=>setPickupDate(e.target.value)}
                          type="date"
                          id="pickup-date"
                          min={(() => {
                            const today = new Date();
                            const year = today.getFullYear();
                            const month = String(today.getMonth() + 1).padStart(2, '0');
                            const day = String(today.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                          })()}
                          className='w-full px-4 py-4 pr-4 border border-gray-300 rounded-xl outline-none text-sm text-gray-700 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md transition-all duration-300'
                          required
                      />
                    </div>
                    {pickupDate && <div className='absolute top-6 -right-1 w-3 h-3 bg-green-500 rounded-full'></div>}
                  </div>
                  <div className='relative'>
                    <label htmlFor='return-date' className='block text-sm font-medium text-gray-700 mb-2'>Return Date</label>
                    <div className='relative'>
                      <input
                          value={returnDate}
                          onChange={e=>setReturnDate(e.target.value)}
                          type="date"
                          id="return-date"
                          className='w-full px-4 py-4 pr-4 border border-gray-300 rounded-xl outline-none text-sm text-gray-700 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-md transition-all duration-300'
                          required
                      />
                    </div>
                    {returnDate && <div className='absolute top-6 -right-1 w-3 h-3 bg-green-500 rounded-full'></div>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <div className='pt-6 border-t border-gray-100'>
              <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className='w-full bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group'>
                <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors'>
                  <img src={assets.search_icon} alt="search" className='brightness-300 w-4 h-4'/>
                </div>
                <span>Search Available Cars</span>
                <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                </svg>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Hero
