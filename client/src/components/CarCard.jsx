import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'

const CarCard = ({car}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={()=> {navigate(`/car-details/${car._id}`); window.scrollTo(0,0)}} 
      className='group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 h-full flex flex-col'
    >
      
      {/* Car Image Section */}
      <div className='relative h-48 lg:h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100'> 
        <img 
          src={car.image} 
          alt={`${car.brand} ${car.model}`} 
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
        />

        {/* Availability Badge */}
        {car.isAvaliable && (
          <div className='absolute top-4 left-4'>
            <div className='bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1'>
              <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
              Available
            </div>
          </div>
        )}

        {/* Price Badge */}
        <div className='absolute bottom-4 right-4'>
          <div className='bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm'>
            <div className='text-center'>
              <span className='font-bold text-lg'>{currency}{car.pricePerDay}</span>
              <div className='text-xs opacity-90'>per day</div>
            </div>
          </div>
        </div>

        {/* Overlay on Hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
      </div>

      {/* Car Details Section */}
      <div className='p-5 lg:p-6 flex-1 flex flex-col'>
        
        {/* Car Name & Category */}
        <div className='mb-4'>
          <h3 className='text-lg lg:text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors duration-300'>
            {car.brand} {car.model}
          </h3>
          <p className='text-sm text-gray-500 font-medium'>
            {car.category} • {car.year}
          </p>
        </div>

        {/* Car Specifications */}
        <div className='grid grid-cols-2 gap-3 mb-4 flex-1'>
          <div className='flex items-center gap-2 p-2 bg-gray-50 rounded-lg'>
            <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
              <img src={assets.users_icon} alt="seats" className='w-4 h-4 opacity-60'/>
            </div>
            <div>
              <div className='text-xs text-gray-500 font-medium'>Seats</div>
              <div className='text-sm font-semibold text-gray-900'>{car.seating_capacity}</div>
            </div>
          </div>

          <div className='flex items-center gap-2 p-2 bg-gray-50 rounded-lg'>
            <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
              <img src={assets.fuel_icon} alt="fuel" className='w-4 h-4 opacity-60'/>
            </div>
            <div>
              <div className='text-xs text-gray-500 font-medium'>Fuel</div>
              <div className='text-sm font-semibold text-gray-900'>{car.fuel_type}</div>
            </div>
          </div>

          <div className='flex items-center gap-2 p-2 bg-gray-50 rounded-lg'>
            <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
              <img src={assets.car_icon} alt="transmission" className='w-4 h-4 opacity-60'/>
            </div>
            <div>
              <div className='text-xs text-gray-500 font-medium'>Type</div>
              <div className='text-sm font-semibold text-gray-900'>{car.transmission}</div>
            </div>
          </div>

          <div className='flex items-center gap-2 p-2 bg-gray-50 rounded-lg'>
            <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
              <img src={assets.location_icon} alt="location" className='w-4 h-4 opacity-60'/>
            </div>
            <div>
              <div className='text-xs text-gray-500 font-medium'>Location</div>
              <div className='text-sm font-semibold text-gray-900 truncate' title={car.address?.street || car.location}>
                {car.address?.city || car.location}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:shadow-2xl'
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  )
}

export default CarCard
