import React, { useEffect, useState } from 'react'
import { assets} from '../assets/assets'
import RatingReviewForm from '../components/RatingReviewForm'
import UserCancellationModal from '../components/UserCancellationModal'
import BookingDetailsModal from '../components/BookingDetailsModal'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [userReviews, setUserReviews] = useState([])

  const fetchMyBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/user')
      if (data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to load your bookings. Please refresh the page.')
    }
  }

  const fetchUserReviews = async () => {
    try {
      const { data } = await axios.get('/api/reviews/user')
      if (data.success) {
        setUserReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to fetch user reviews:', error)
    }
  }

  const handleRateBooking = (booking) => {
    setSelectedBooking(booking)
    setShowRatingForm(true)
  }

  const handleReviewSubmitted = () => {
    fetchUserReviews()
    fetchMyBookings()
  }

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
  }

  const handleCancellationSuccess = () => {
    fetchMyBookings()
    setShowCancelModal(false)
    setSelectedBooking(null)
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  const getBookingReview = (bookingId) => {
    return userReviews.find(review => review.booking._id === bookingId)
  }

  useEffect(()=>{
    if (user) {
      fetchMyBookings()
      fetchUserReviews()
    }
  },[user])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white'>
      
      {/* Header Section */}
      <section className='bg-gradient-to-br from-primary via-purple-600 to-purple-700 text-white py-16 lg:py-20 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 relative overflow-hidden'>
        
        {/* Background Decorations */}
        <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent'></div>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32'></div>
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24'></div>
        
        <div className='relative z-10 max-w-6xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center lg:text-left'
          >
            <div className='inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium text-sm mb-6'>
              <div className='w-2 h-2 bg-yellow-300 rounded-full mr-2 animate-pulse'></div>
              Your Rental History
            </div>
            
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight'>
              My Bookings
            </h1>
            
            <p className='text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl'>
              View and manage all your car rental bookings in one place. Track your rental history and upcoming trips.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bookings Section */}
      <section className='py-16 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32'>
        <div className='max-w-7xl mx-auto'>
          
          {bookings.length > 0 ? (
            <div className='space-y-6'>
              {bookings.map((booking, index)=>(
                <motion.div 
                  key={booking._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className='bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300'
                >
                  <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 lg:p-8'>
                    
                    {/* Car Image + Info */}
                    <div className='lg:col-span-1'>
                      <div className='relative rounded-2xl overflow-hidden mb-4 group'>
                        <img 
                          src={booking.car.image} 
                          alt={`${booking.car.brand} ${booking.car.model}`}
                          className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                        />
                        
                        {/* Status Badge Overlay */}
                        <div className='absolute top-4 left-4'>
                          <div className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                            booking.status === 'booked' ? 'bg-green-500 text-white' :
                            booking.status === 'on_rent' ? 'bg-orange-500 text-white' :
                            booking.status === 'completed' ? 'bg-blue-500 text-white' :
                            booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                            booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {booking.status === 'booked' ? 'Confirmed' :
                             booking.status === 'on_rent' ? 'On Rent' :
                             booking.status === 'cancelled' ? 'Cancelled' :
                             booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className='text-lg font-bold text-gray-900 mb-1'>
                          {booking.car.brand} {booking.car.model}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {booking.car.year} • {booking.car.category}
                        </p>
                        <p className='text-sm text-gray-500 mt-1'>
                          📍 {booking.car.location}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className='lg:col-span-2 space-y-6'>
                      
                      {/* Booking Header */}
                      <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                        <div className='bg-gray-50 px-4 py-2 rounded-xl'>
                          <span className='text-sm font-semibold text-gray-700'>
                            Booking #{index + 1}
                          </span>
                        </div>
                        <div className='text-sm text-gray-500'>
                          Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Rental Period */}
                      <div className='bg-gray-50 rounded-2xl p-4'>
                        <div className='flex items-start gap-3'>
                          <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                            <img src={assets.calendar_icon_colored} alt="calendar" className='w-5 h-5'/>
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900 mb-2'>Rental Period</h4>
                            <div className='flex items-center gap-2 text-gray-700'>
                              <span className='font-medium'>
                                {new Date(booking.pickupDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className='text-gray-400'>→</span>
                              <span className='font-medium'>
                                {new Date(booking.returnDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className='text-sm text-gray-500 mt-1'>
                              {Math.ceil((new Date(booking.returnDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24)) + 1} day(s)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pickup Location */}
                      <div className='bg-gray-50 rounded-2xl p-4'>
                        <div className='flex items-start gap-3'>
                          <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0'>
                            <img src={assets.location_icon_colored} alt="location" className='w-5 h-5'/>
                          </div>
                          <div>
                            <h4 className='font-semibold text-gray-900 mb-1'>Pickup Location</h4>
                            <p className='text-gray-700'>{booking.car.location}</p>
                          </div>
                        </div>
                      </div>

                      {/* Cancellation Reason */}
                      {booking.status === 'cancelled' && booking.cancellationReason && (
                        <div className='bg-red-50 border border-red-200 rounded-2xl p-4'>
                          <div className='flex items-start gap-3'>
                            <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0'>
                              <svg className='w-5 h-5 text-red-600' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                              </svg>
                            </div>
                            <div>
                              <h4 className='font-semibold text-red-900 mb-1'>Cancellation Reason</h4>
                              <p className='text-red-700 text-sm'>{booking.cancellationReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className='lg:col-span-1 flex flex-col gap-6'>
                      
                      {/* Price Card */}
                      <div className='bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl p-6 text-center'>
                        <p className='text-white/80 text-sm mb-1'>Total Amount</p>
                        <div className='text-2xl lg:text-3xl font-bold'>{currency}{booking.price}</div>
                        <div className='mt-4'>
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className='w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white py-2 px-4 rounded-xl hover:bg-white/30 transition-colors text-sm font-medium'
                          >
                            📊 View Timeline
                          </button>
                        </div>
                      </div>

                      {/* Rating Section for Completed Bookings */}
                      {booking.status === 'completed' && (
                        <div className='bg-gray-50 rounded-2xl p-6'>
                          {getBookingReview(booking._id) ? (
                            <div className='text-center'>
                              <p className='text-sm text-gray-600 mb-3'>Your Rating</p>
                              <div className='flex justify-center items-center gap-1 mb-3'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-5 h-5 ${
                                      star <= getBookingReview(booking._id).rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    } fill-current`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className='text-xs text-green-600 font-medium flex items-center justify-center gap-1'>
                                <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                </svg>
                                Review Submitted
                              </p>
                            </div>
                          ) : (
                            <div className='text-center'>
                              <p className='text-sm text-gray-600 mb-4'>Rate your experience</p>
                              <button
                                onClick={() => handleRateBooking(booking)}
                                className='w-full bg-gradient-to-r from-primary to-purple-600 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-primary transition-all duration-300 text-sm font-semibold'
                              >
                                ⭐ Write Review
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Cancel Booking Button */}
                      {(booking.status === 'pending' || booking.status === 'booked') && (
                        <div className='bg-red-50 border border-red-200 rounded-2xl p-6'>
                          <div className='text-center'>
                            <p className='text-sm text-gray-600 mb-4'>Need to cancel?</p>
                            <button
                              onClick={() => handleCancelBooking(booking)}
                              className='w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-xl transition-colors text-sm font-semibold'
                            >
                              ❌ Cancel Booking
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-center py-16'
            >
              <div className='bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto'>
                <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-3'>No Bookings Yet</h3>
                <p className='text-gray-600 mb-6'>
                  You haven't made any car rental bookings yet. Start exploring our premium vehicle collection.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = '/cars'}
                  className='px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  Browse Cars
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modals */}
      <RatingReviewForm
        isOpen={showRatingForm}
        onClose={() => {
          setShowRatingForm(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <UserCancellationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
        onCancellationSuccess={handleCancellationSuccess}
      />

      <BookingDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
        userType="customer"
      />
    </div>
  )
}

export default MyBookings
