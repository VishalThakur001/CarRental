import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyCarData } from '../assets/assets'
import Loader from '../components/Loader'
import AvailabilityDatePicker from '../components/AvailabilityDatePicker'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const CarDetails = () => {

  const {id} = useParams()

  const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, user, showLoginWithRedirect} = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [bookedDates, setBookedDates] = useState([])
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const currency = import.meta.env.VITE_CURRENCY

  // Calculate total price based on selected dates
  const calculateTotalPrice = () => {
    if (!pickupDate || !returnDate || !car?.pricePerDay) return 0

    const picked = new Date(pickupDate)
    const returned = new Date(returnDate)

    // Calculate the difference in days and add 1 to include the pickup day
    const timeDifference = returned.getTime() - picked.getTime()
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

    // For same day pickup and return, charge for 1 day minimum
    // For multi-day rentals, add 1 to include the pickup day
    const noOfDays = daysDifference === 0 ? 1 : daysDifference + 1
    return car.pricePerDay * noOfDays
  }

  const totalPrice = calculateTotalPrice()
  const numberOfDays = (() => {
    if (!pickupDate || !returnDate) return 0
    const picked = new Date(pickupDate)
    const returned = new Date(returnDate)
    const timeDifference = returned.getTime() - picked.getTime()
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference === 0 ? 1 : daysDifference + 1
  })()

  const handleSubmit = async (e)=>{
    e.preventDefault();

    // Check if user is logged in before booking
    if (!user) {
      toast.error('Please login to book this car')
      showLoginWithRedirect()
      return
    }

    // Check if user is trying to book their own car
    if (user._id === car.owner) {
      toast.error('You cannot book your own car')
      return
    }

    if (!pickupDate || !returnDate) {
      toast.error('Please select pickup and return dates')
      return
    }

    try {
      const {data} = await axios.post('/api/bookings/create', {
        car: id,
        pickupDate,
        returnDate
      })

      if (data.success){
        toast.success(data.message)
        navigate('/my-bookings')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to book this car')
        showLoginWithRedirect()
      } else {
        toast.error(error.response?.data?.message || 'Failed to book car. Please try again.')
      }
    }
  }

  const fetchBookedDates = async () => {
    try {
      const { data } = await axios.get(`/api/bookings/car/${id}/dates`)
      if (data.success) {
        setBookedDates(data.bookedDates)
      }
    } catch (error) {
      console.log('Error fetching booked dates:', error)
    }
  }

  const fetchCarReviews = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/car/${id}`)
      if (data.success) {
        setReviews(data.reviews)
        setAvgRating(data.avgRating)
        setTotalReviews(data.totalReviews)
      }
    } catch (error) {
      console.log('Error fetching reviews:', error)
    }
  }

  useEffect(()=>{
    setCar(cars.find(car => car._id === id))
    if (id) {
      fetchBookedDates()
      fetchCarReviews()
    }
  },[cars, id])

  return car ? (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      <div className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-8'>

        {/* Back Button */}
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={()=> navigate(-1)} 
          className='flex items-center gap-3 mb-8 text-gray-600 hover:text-primary transition-colors duration-200 group'
        >
          <div className='w-8 h-8 bg-gray-100 group-hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors duration-200'>
            <img src={assets.arrow_icon} alt="back" className='rotate-180 w-4 h-4 opacity-70'/>
          </div>
          <span className='font-medium'>Back to all cars</span>
        </motion.button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>

          {/* Left: Car Image & Details */}
          <div className='lg:col-span-2 space-y-8'>
            
            {/* Car Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className='relative'
            >
              <img 
                src={car.image} 
                alt={`${car.brand} ${car.model}`} 
                className='w-full h-80 sm:h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl'
              />
              
              {/* Availability Badge */}
              {car.isAvaliable && (
                <div className='absolute top-6 left-6'>
                  <div className='bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2'>
                    <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                    <span className='font-semibold text-sm'>Available Now</span>
                  </div>
                </div>
              )}
              
              {/* Price Badge */}
              <div className='absolute bottom-6 right-6'>
                <div className='bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-2xl shadow-xl backdrop-blur-sm'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold'>{currency}{car.pricePerDay}</div>
                    <div className='text-sm opacity-90'>per day</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Car Information */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='bg-white rounded-3xl p-8 shadow-lg border border-gray-100'
            >
              
              {/* Header */}
              <div className='mb-8'>
                <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-3'>
                  {car.brand} {car.model}
                </h1>
                <div className='flex items-center gap-6'>
                  <p className='text-lg text-gray-600'>{car.category} • {car.year}</p>
                  {totalReviews > 0 && (
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'
                            } fill-current`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className='font-semibold text-gray-800'>
                        {avgRating} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className='border-t border-gray-200 pt-8'>

                {/* Car Specifications */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                  {[
                    {icon: assets.users_icon, label: 'Seats', value: `${car.seating_capacity}`},
                    {icon: assets.fuel_icon, label: 'Fuel Type', value: car.fuel_type},
                    {icon: assets.car_icon, label: 'Transmission', value: car.transmission},
                    {icon: assets.location_icon, label: 'Location', value: car.address?.city ? `${car.address.city}` : car.location},
                  ].map(({icon, label, value}, index)=>(
                    <motion.div 
                      key={label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className='text-center p-4 bg-gray-50 rounded-2xl'
                    >
                      <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <img src={icon} alt={label} className='w-6 h-6'/>
                      </div>
                      <div className='text-sm text-gray-500 mb-1'>{label}</div>
                      <div className='font-semibold text-gray-900'>{value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div className='mb-8'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>About This Vehicle</h2>
                  <p className='text-gray-600 leading-relaxed text-lg'>{car.description}</p>
                </div>

                {/* Pickup Location */}
                {car.address && (
                  <div className='mb-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-4'>Pickup Location</h2>
                    <div className='bg-gradient-to-r from-primary/5 to-purple-600/5 p-6 rounded-2xl border border-primary/20'>
                      <div className='flex items-start gap-4'>
                        <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                          <img src={assets.location_icon_colored} alt="location" className='w-6 h-6'/>
                        </div>
                        <div>
                          <h3 className='font-bold text-lg text-gray-900 mb-2'>{car.address.city}, {car.address.state}</h3>
                          {car.address.street && <p className='text-gray-700 mb-1'>{car.address.street}</p>}
                          {car.address.landmark && <p className='text-gray-600 text-sm'>Near {car.address.landmark}</p>}
                          {car.address.zipCode && <p className='text-gray-600 text-sm'>ZIP: {car.address.zipCode}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Reviews Section */}
            {totalReviews > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='bg-white rounded-3xl p-8 shadow-lg border border-gray-100'
              >
                <div className='flex items-center justify-between mb-8'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Customer Reviews ({totalReviews})
                  </h2>
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-6 h-6 ${
                            star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'
                          } fill-current`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className='text-xl font-bold text-gray-900'>{avgRating}</span>
                  </div>
                </div>

                <div className='space-y-6 max-h-96 overflow-y-auto'>
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className='bg-gray-50 rounded-2xl p-6 border border-gray-200'
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center gap-4'>
                          <img
                            src={review.user.image || `https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50&h=50&fit=crop&crop=face&auto=format&q=80`}
                            alt={review.user.name}
                            className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-md'
                          />
                          <div>
                            <h4 className='font-bold text-gray-900'>{review.user.name}</h4>
                            <div className='flex items-center gap-3'>
                              <div className='flex items-center'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    } fill-current`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className='text-sm text-gray-500'>
                                Rented {new Date(review.booking.pickupDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-1 text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium'>
                          <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                          </svg>
                          Verified
                        </div>
                      </div>
                      <p className='text-gray-700 leading-relaxed mb-3'>{review.reviewText}</p>
                      <p className='text-xs text-gray-500'>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>

                      {/* Owner Reply */}
                      {review.ownerReply && review.ownerReply.text && (
                        <div className='mt-4 ml-6 pl-6 border-l-2 border-primary bg-primary/5 rounded-r-2xl p-4'>
                          <div className='flex items-center gap-3 mb-3'>
                            <div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>
                              O
                            </div>
                            <span className='font-semibold text-gray-900'>Owner Reply</span>
                            <div className='flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full font-medium'>
                              <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                              </svg>
                              Car Owner
                            </div>
                          </div>
                          <p className='text-gray-700 leading-relaxed'>{review.ownerReply.text}</p>
                          <p className='text-xs text-gray-500 mt-2'>
                            Replied on {new Date(review.ownerReply.repliedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className='lg:sticky lg:top-24 h-fit'
          >
            <form onSubmit={handleSubmit} className='bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 space-y-6'>
              
              {/* Price Header */}
              <div className='text-center pb-6 border-b border-gray-200'>
                <div className='text-3xl font-bold text-gray-900'>{currency}{car.pricePerDay}</div>
                <div className='text-gray-600'>per day</div>
              </div>

              {/* Date Pickers */}
              <div className='space-y-4'>
                <AvailabilityDatePicker
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  label="Pickup Date"
                  required
                  bookedDates={bookedDates}
                  minDate={new Date().toISOString().split('T')[0]}
                  id="pickup-date"
                />

                <AvailabilityDatePicker
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  label="Return Date"
                  required
                  bookedDates={bookedDates}
                  minDate={pickupDate || new Date().toISOString().split('T')[0]}
                  id="return-date"
                />
              </div>

              {/* Price Summary */}
              {pickupDate && returnDate && (
                <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 space-y-3'>
                  <div className='flex justify-between text-gray-700'>
                    <span>Price per day</span>
                    <span className='font-semibold'>{currency}{car.pricePerDay}</span>
                  </div>
                  <div className='flex justify-between text-gray-700'>
                    <span>Number of days</span>
                    <span className='font-semibold'>{numberOfDays} day{numberOfDays !== 1 ? 's' : ''}</span>
                  </div>
                  <div className='border-t border-gray-300 pt-3'>
                    <div className='flex justify-between text-xl font-bold'>
                      <span>Total Price</span>
                      <span className='text-primary'>{currency}{totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={!pickupDate || !returnDate}
              >
                {pickupDate && returnDate ? `Book for ${currency}${totalPrice}` : 'Select Dates to Book'}
              </motion.button>

              <p className='text-center text-sm text-gray-500'>
                🔒 Secure booking • No hidden fees • Free cancellation within 24 hours
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  ) : <Loader />
}

export default CarDetails
