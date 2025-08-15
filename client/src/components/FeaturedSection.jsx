import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import CarCard from './CarCard'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const {cars} = useAppContext()

  return (
    <section className='py-16 lg:py-24 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-gray-50 to-white'>
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='text-center max-w-3xl mx-auto mb-16'
      >
        <div className='inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm mb-6'>
          <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
          Premium Collection
        </div>
        
        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
          Discover Our 
          <span className='text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text block sm:inline'>
            {' '}Featured Vehicles
          </span>
        </h2>
        
        <p className='text-lg text-gray-600 leading-relaxed'>
          Explore our handpicked selection of premium vehicles, each offering luxury, comfort, and the perfect driving experience for your journey.
        </p>
      </motion.div>

      {/* Cars Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-16'
      >
        {cars.slice(0,8).map((car, index) => (
          <motion.div 
            key={car._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className='h-full'
          >
            <CarCard car={car}/>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className='text-center'
      >
        <div className='inline-flex flex-col sm:flex-row gap-4'>
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={()=> {
              navigate('/cars'); 
              window.scrollTo(0,0)
            }}
            className='px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3'
          >
            <span>Explore All Cars</span>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/about-us')}
            className='px-8 py-4 bg-white border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3'
          >
            <span>Learn More</span>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </motion.button>
        </div>
        
        <p className='text-sm text-gray-500 mt-6 max-w-md mx-auto'>
          Can't find what you're looking for? Browse our complete catalog or contact us for personalized recommendations.
        </p>
      </motion.div>
    </section>
  )
}

export default FeaturedSection
