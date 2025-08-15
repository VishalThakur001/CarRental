import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const Banner = () => {
  return (
    <section className='py-16 lg:py-24 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32'>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='max-w-7xl mx-auto'
      >
        <div className='bg-gradient-to-br from-primary via-purple-600 to-purple-700 rounded-3xl overflow-hidden shadow-2xl relative'>
          
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
          <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48'></div>
          <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32'></div>
          
          <div className='relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 lg:p-12 xl:p-16'>
            
            {/* Content Section */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-white space-y-6'
            >
              {/* Badge */}
              <div className='inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium text-sm'>
                <div className='w-2 h-2 bg-white rounded-full mr-2 animate-pulse'></div>
                Car Owner Opportunity
              </div>

              {/* Heading */}
              <div className='space-y-4'>
                <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight'>
                  Turn Your Car Into a
                  <span className='block text-yellow-300'>Money-Making Machine</span>
                </h2>
                <p className='text-lg lg:text-xl text-white/90 leading-relaxed max-w-lg'>
                  List your vehicle on our platform and start earning passive income. We handle insurance, verification, and payments — you just collect the profits.
                </p>
              </div>

              {/* Features List */}
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0'>
                    <svg className='w-4 h-4 text-green-900' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  </div>
                  <span className='text-white/90 font-medium'>Complete insurance coverage included</span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0'>
                    <svg className='w-4 h-4 text-green-900' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  </div>
                  <span className='text-white/90 font-medium'>Verified driver background checks</span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0'>
                    <svg className='w-4 h-4 text-green-900' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  </div>
                  <span className='text-white/90 font-medium'>Secure & instant payments</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <Link to="/owner/add-car">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className='px-8 py-4 bg-white hover:bg-gray-100 text-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3'
                  >
                    <span>List Your Car Now</span>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-3'
                >
                  <span>Learn More</span>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            {/* Image Section */}
            <motion.div 
              initial={{ opacity: 0, x: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='relative flex justify-center lg:justify-end'
            >
              <div className='relative'>
                <div className='absolute inset-0 bg-white/10 rounded-full blur-3xl'></div>
                <img 
                  src={assets.banner_car_image} 
                  alt="Luxury Car" 
                  className='relative z-10 max-h-72 lg:max-h-80 xl:max-h-96 w-auto object-contain filter drop-shadow-2xl'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Banner
