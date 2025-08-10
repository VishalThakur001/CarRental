import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import BookingCancellationModal from '../../components/BookingCancellationModal'
import BookingActionModal from '../../components/BookingActionModal'
import BookingDetailsModal from '../../components/BookingDetailsModal'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const fetchOwnerBookings = async ()=>{
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error('Failed to load bookings. Please refresh the page.')
    }
  }

  const changeBookingStatus = async (bookingId, status)=>{
    try {
      const { data } = await axios.post('/api/bookings/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error('Failed to update booking status. Please try again.')
    }
  }

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
  }

  const handleConfirmBooking = (booking) => {
    setSelectedBooking(booking)
    setShowConfirmModal(true)
  }

  const handleCompleteBooking = (booking) => {
    setSelectedBooking(booking)
    setShowCompleteModal(true)
  }

  const handleMarkPickedUp = async (booking) => {
    await changeBookingStatus(booking._id, 'on_rent')
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  const confirmBookingAction = async () => {
    if (selectedBooking) {
      await changeBookingStatus(selectedBooking._id, 'booked')
    }
  }

  const completeBookingAction = async () => {
    if (selectedBooking) {
      await changeBookingStatus(selectedBooking._id, 'completed')
    }
  }

  const confirmCancelBooking = async (bookingId, cancellationReason) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status: 'cancelled',
        cancellationReason
      })

      if(data.success){
        toast.success('Booking cancelled successfully')
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to cancel booking. Please try again.')
    }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."/>

      <div className='max-w-6xl w-full rounded-lg overflow-hidden border border-borderColor mt-6 bg-white shadow-sm'>

        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left text-sm text-gray-600 min-w-[700px]'>
            <thead className='text-gray-500 bg-gray-50'>
              <tr>
                <th className="p-4 font-medium text-xs sm:text-sm">Car Details</th>
                <th className="p-4 font-medium text-xs sm:text-sm max-md:hidden">Date Range</th>
                <th className="p-4 font-medium text-xs sm:text-sm">Total</th>
                <th className="p-4 font-medium text-xs sm:text-sm max-md:hidden">Payment</th>
                <th className="p-4 font-medium text-xs sm:text-sm">Booking Stage & Actions</th>
              </tr>
            </thead>
          <tbody>
            {bookings.map((booking, index)=>(
              <tr key={index} className='border-t border-borderColor text-gray-500'>

                <td className='p-4 flex items-center gap-3'>
                  <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>
                  <p className='font-medium max-md:hidden'>{booking.car.brand} {booking.car.model}</p>
                </td>

                <td className='p-4 max-md:hidden'>
                  {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                </td>

                <td className='p-4'>{currency}{booking.price}</td>

                <td className='p-4 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
                </td>

                <td className='p-4'>
                  <div className="flex flex-col gap-2">
                    {/* Booking Stage Workflow */}
                    {booking.status === 'pending' ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          <span className="text-xs font-medium text-yellow-600">Pending Review</span>
                        </div>
                        <button
                          onClick={() => handleConfirmBooking(booking)}
                          className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium border border-green-200"
                        >
                          ✓ Accept Booking
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm border border-red-200"
                        >
                          ✗ Decline Booking
                        </button>
                      </div>
                    ) : booking.status === 'booked' ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-xs font-medium text-green-600">Booking Confirmed</span>
                        </div>
                        <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-center text-sm font-medium border border-green-200">
                          Awaiting Pickup
                        </div>
                        <button
                          onClick={() => handleMarkPickedUp(booking)}
                          className="px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium border border-orange-200"
                        >
                          🚗 Car Picked Up
                        </button>
                      </div>
                    ) : booking.status === 'on_rent' ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                          <span className="text-xs font-medium text-orange-600">Currently On Rent</span>
                        </div>
                        <div className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-center text-sm font-medium border border-orange-200">
                          Car in Use
                        </div>
                        <button
                          onClick={() => handleCompleteBooking(booking)}
                          className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                        >
                          🏁 Car Returned
                        </button>
                      </div>
                    ) : booking.status === 'completed' ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-xs font-medium text-blue-600">Completed</span>
                        </div>
                        <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-center text-sm font-medium border border-blue-200">
                          ✓ Booking Complete
                        </div>
                        {booking.completedAt && (
                          <p className="text-xs text-gray-500 text-center">
                            Completed {new Date(booking.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          <span className="text-xs font-medium text-red-600">Cancelled</span>
                        </div>
                        <div className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-center text-sm font-medium border border-red-200">
                          ✗ Booking Cancelled
                        </div>
                        {booking.cancellationReason && (
                          <div className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-600">
                            <span className="font-medium">Reason:</span>{' '}
                            {booking.cancellationReason.length > 40
                              ? `${booking.cancellationReason.substring(0, 40)}...`
                              : booking.cancellationReason
                            }
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timeline View Button for all bookings */}
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="px-3 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm border border-gray-200 mt-1"
                    >
                      📊 View Details & Timeline
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
          </table>
        </div>

      </div>

      {/* Cancellation Modal */}
      <BookingCancellationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false)
          setSelectedBooking(null)
        }}
        onConfirm={confirmCancelBooking}
        booking={selectedBooking}
      />

      {/* Confirmation Modal */}
      <BookingActionModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false)
          setSelectedBooking(null)
        }}
        onConfirm={confirmBookingAction}
        booking={selectedBooking}
        action="confirm"
        title="Confirm Booking"
        message="Are you sure you want to accept this booking request? The customer will be notified and the booking will be confirmed."
        confirmText="Accept Booking"
        confirmColor="bg-green-600"
      />

      {/* Complete Modal */}
      <BookingActionModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false)
          setSelectedBooking(null)
        }}
        onConfirm={completeBookingAction}
        booking={selectedBooking}
        action="complete"
        title="Mark as Completed"
        message="Are you sure you want to mark this booking as completed? This action confirms that the rental period has ended and the car has been returned."
        confirmText="Mark Complete"
        confirmColor="bg-blue-600"
      />

      {/* Booking Details Modal with Timeline */}
      <BookingDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedBooking(null)
        }}
        booking={selectedBooking}
        userType="owner"
      />

    </div>
  )
}

export default ManageBookings
