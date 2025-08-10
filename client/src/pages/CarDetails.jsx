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
    <div className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 mt-8 sm:mt-12 lg:mt-16'>

      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65'/>
        Back to all cars
       </button>

       <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12'>

          {/* Left: Car Image & Details */}
          <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className='lg:col-span-2'>
              <motion.img 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}

              src={car.image} alt="" className='w-full h-auto sm:max-h-80 md:max-h-96 lg:max-h-100 object-cover rounded-xl mb-4 sm:mb-6 shadow-md'/>
              <motion.div className='space-y-4 sm:space-y-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div>
                  <h1 className='text-2xl sm:text-3xl font-bold'>{car.brand} {car.model}</h1>
                  <div className='flex items-center gap-4 mt-2'>
                    <p className='text-gray-500 text-base sm:text-lg'>{car.category} • {car.year}</p>
                    {totalReviews > 0 && (
                      <div className='flex items-center gap-2'>
                        <div className='flex items-center'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'
                              } fill-current`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className='text-sm text-gray-600'>
                          {avgRating} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <hr className='border-borderColor my-6'/>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
                  {[
                    {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
                    {icon: assets.fuel_icon, text: car.fuel_type},
                    {icon: assets.car_icon, text: car.transmission},
                    {icon: assets.location_icon, text: car.address?.city ? `${car.address.city}, ${car.address.state}` : car.location},
                  ].map(({icon, text})=>(
                    <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    
                    key={text} className='flex flex-col items-center bg-light p-3 sm:p-4 rounded-lg text-center'>
                      <img src={icon} alt="" className='h-4 sm:h-5 mb-2'/>
                      <span className='text-xs sm:text-sm'>{text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h1 className='text-lg sm:text-xl font-medium mb-3'>Description</h1>
                  <p className='text-gray-500 text-sm sm:text-base'>{car.description}</p>
                </div>

                {/* Pickup Address */}
                {car.address && (
                  <div>
                    <h1 className='text-lg sm:text-xl font-medium mb-3'>Pickup Location</h1>
                    <div className='bg-gray-50 p-3 sm:p-4 rounded-lg'>
                      <div className='flex items-start gap-2'>
                        <img src={assets.location_icon_colored} alt="" className='w-5 h-5 mt-1'/>
                        <div>
                          <p className='font-medium text-sm sm:text-base'>{car.address.city}, {car.address.state}</p>
                          {car.address.street && <p className='text-gray-600 text-xs sm:text-sm mt-1'>{car.address.street}</p>}
                          {car.address.landmark && <p className='text-gray-500 text-xs sm:text-sm'>Near {car.address.landmark}</p>}
                          {car.address.zipCode && <p className='text-gray-500 text-xs sm:text-sm'>ZIP: {car.address.zipCode}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* Reviews Section */}
                {totalReviews > 0 && (
                  <div>
                    <div className='flex items-center justify-between mb-4'>
                      <h1 className='text-lg sm:text-xl font-medium'>
                        Customer Reviews ({totalReviews})
                      </h1>
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
                        <span className='text-lg font-semibold text-gray-800'>{avgRating}</span>
                      </div>
                    </div>

                    <div className='space-y-4 max-h-96 overflow-y-auto'>
                      {reviews.map((review, index) => (
                        <motion.div
                          key={review._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          className='bg-gray-50 rounded-lg p-4 border border-gray-200'
                        >
                          <div className='flex items-start justify-between mb-3'>
                            <div className='flex items-center gap-3'>
                              <img
                                src={review.user.image || `https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop&crop=face&auto=format&q=80`}
                                alt={review.user.name}
                                className='w-10 h-10 rounded-full object-cover'
                              />
                              <div>
                                <p className='font-medium text-gray-800'>{review.user.name}</p>
                                <div className='flex items-center gap-2'>
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
                                  <span className='text-sm text-gray-600'>
                                    Rented {new Date(review.booking.pickupDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className='flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full'>
                              <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                              </svg>
                              Verified
                            </div>
                          </div>
                          <p className='text-gray-700 text-sm leading-relaxed'>{review.reviewText}</p>
                          <p className='text-xs text-gray-500 mt-2'>
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>

                          {/* Owner Reply */}
                          {review.ownerReply && review.ownerReply.text && (
                            <div className='mt-4 ml-4 pl-4 border-l-2 border-primary bg-blue-50 rounded-r-lg p-3'>
                              <div className='flex items-center gap-2 mb-2'>
                                <div className='w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold'>
                                  O
                                </div>
                                <span className='text-sm font-medium text-gray-800'>Owner Reply</span>
                                <div className='flex items-center gap-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full'>
                                  <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                  </svg>
                                  Car Owner
                                </div>
                              </div>
                              <p className='text-gray-700 text-sm leading-relaxed'>{review.ownerReply.text}</p>
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
                  </div>
                )}

              </motion.div>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}

          onSubmit={handleSubmit} className='shadow-lg h-max lg:sticky lg:top-18 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 text-gray-500'>

            <p className='flex items-center justify-between text-xl sm:text-2xl text-gray-800 font-semibold'>{currency}{car.pricePerDay}<span className='text-sm sm:text-base text-gray-400 font-normal'>per day</span></p> 

            <hr className='border-borderColor my-6'/>

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

            {/* Price Summary */}
            {pickupDate && returnDate && (
              <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Price per day</span>
                  <span>{currency}{car.pricePerDay}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Number of days</span>
                  <span>{numberOfDays} day{numberOfDays !== 1 ? 's' : ''}</span>
                </div>
                <hr className='border-gray-200'/>
                <div className='flex justify-between font-semibold text-lg'>
                  <span>Total Price</span>
                  <span className='text-primary'>{currency}{totalPrice}</span>
                </div>
              </div>
            )}

            <button
              className='w-full bg-primary hover:bg-primary-dull transition-all py-3 sm:py-3.5 font-medium text-white rounded-xl cursor-pointer text-sm sm:text-base shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!pickupDate || !returnDate}
            >
              {pickupDate && returnDate ? `Book for ${currency}${totalPrice}` : 'Book Now'}
            </button>

            <p className='text-center text-xs sm:text-sm text-gray-500'>No credit card required to reserve</p>

          </motion.form>
       </div>

    </div>
  ) : <Loader />
}

export default CarDetails
