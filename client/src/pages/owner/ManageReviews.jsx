import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import OwnerReplyModal from '../../components/OwnerReplyModal'
import { useAppContext } from '../../context/AppContext'
import { motion } from 'motion/react'
import toast from 'react-hot-toast'

const ManageReviews = () => {
  const { axios } = useAppContext()
  
  const [reviews, setReviews] = useState([])
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOwnerReviews = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/reviews/owner')
      if (data.success) {
        setReviews(data.reviews)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to load reviews. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleReplyToReview = (review) => {
    setSelectedReview(review)
    setShowReplyModal(true)
  }

  const handleReplySubmitted = () => {
    fetchOwnerReviews()
  }

  const StarIcon = ({ filled, size = 'w-4 h-4' }) => (
    <svg className={`${size} ${filled ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  useEffect(() => {
    fetchOwnerReviews()
  }, [])

  if (loading) {
    return (
      <div className='px-4 pt-10 md:px-10 w-full'>
        <Title title="Manage Reviews" subTitle="View and respond to customer reviews for your cars"/>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Reviews" subTitle="View and respond to customer reviews for your cars"/>

      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">Your cars haven't received any reviews yet. Once customers complete their bookings, their reviews will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6 mt-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              {/* Car and Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={review.car.image} 
                    alt="Car" 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {review.car.brand} {review.car.model}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon key={star} filled={star <= review.rating} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {review.rating}/5 stars
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full mt-1">
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                    </svg>
                    Verified Rental
                  </div>
                </div>
              </div>

              {/* Customer Info and Review */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={review.user.image || `https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=40&h=40&fit=crop&crop=face&auto=format&q=80`}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{review.user.name}</p>
                    <p className="text-sm text-gray-600">
                      Rented {new Date(review.booking.pickupDate).toLocaleDateString()} - {new Date(review.booking.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">"{review.reviewText}"</p>
                </div>
              </div>

              {/* Owner Reply Section */}
              <div className="border-t border-gray-200 pt-4">
                {review.ownerReply && review.ownerReply.text ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">Your Reply</h4>
                      <button
                        onClick={() => handleReplyToReview(review)}
                        className="text-sm text-primary hover:text-primary-dull font-medium"
                      >
                        Edit Reply
                      </button>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-primary">
                      <p className="text-gray-700 leading-relaxed">{review.ownerReply.text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Replied on {new Date(review.ownerReply.repliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Reply to this review</h4>
                      <p className="text-sm text-gray-600">Show other customers how you value feedback</p>
                    </div>
                    <button
                      onClick={() => handleReplyToReview(review)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors text-sm font-medium"
                    >
                      Write Reply
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <OwnerReplyModal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false)
          setSelectedReview(null)
        }}
        review={selectedReview}
        onReplySubmitted={handleReplySubmitted}
      />
    </div>
  )
}

export default ManageReviews
