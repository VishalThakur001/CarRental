import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const CarCard = ({car}) => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

  return (
    <div onClick={()=> {navigate(`/car-details/${car._id}`); window.scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer bg-white'>
      
      <div className='relative h-40 sm:h-48 overflow-hidden'> 
        <img src={car.image} alt="Car Image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'/>

        {car.isAvaliable && <p className='absolute top-2 sm:top-4 left-2 sm:left-4 bg-primary/90 text-white text-xs px-2 sm:px-2.5 py-1 rounded-full'>Available Now</p>}

        <div className='absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/80 backdrop-blur-sm text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg'>
            <span className='font-semibold text-sm sm:text-base'>{currency}{car.pricePerDay}</span>
            <span className='text-xs sm:text-sm text-white/80'> / day</span>
        </div>
      </div>

      <div className='p-3 sm:p-4 lg:p-5'>
        <div className='flex justify-between items-start mb-2'>
            <div>
                <h3 className='text-base sm:text-lg font-medium leading-tight'>{car.brand} {car.model}</h3>
                <p className='text-muted-foreground text-xs sm:text-sm'>{car.category} • {car.year}</p>
            </div>
        </div>

        <div className='mt-3 sm:mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
            <div className='flex items-center text-xs sm:text-sm text-muted-foreground'>
                <img src={assets.users_icon} alt="" className='h-3 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0'/>
                <span>{car.seating_capacity} Seats</span>
            </div>
            <div className='flex items-center text-xs sm:text-sm text-muted-foreground'>
                <img src={assets.fuel_icon} alt="" className='h-3 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0'/>
                <span>{car.fuel_type}</span>
            </div>
            <div className='flex items-center text-xs sm:text-sm text-muted-foreground'>
                <img src={assets.car_icon} alt="" className='h-3 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0'/>
                <span>{car.transmission}</span>
            </div>
            <div className='flex items-center text-xs sm:text-sm text-muted-foreground'>
                <img src={assets.location_icon} alt="" className='h-3 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0'/>
                <span title={car.address?.street || car.location} className='truncate'>
                    {car.address?.city || car.location}
                    {car.address?.state && `, ${car.address.state}`}
                </span>
            </div>
        </div>

      </div>

    </div>
  )
}

export default CarCard
