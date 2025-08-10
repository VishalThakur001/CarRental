import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const OwnerReplyModal = ({ isOpen, onClose, review, onReplySubmitted }) => {
  const { axios } = useAppContext();
  const [replyText, setReplyText] = useState(review?.ownerReply?.text || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = review?.ownerReply?.text;

  // Reply suggestions based on review rating
  const getReplysuggestions = () => {
    const rating = review?.rating || 0;

    if (rating >= 4) {
      return [
        "Thank you so much for your wonderful review! We're thrilled you had a great experience with our car.",
        "We appreciate your positive feedback! It means a lot to us that you enjoyed renting our vehicle.",
        "Thank you for choosing us! Your kind words motivate us to keep providing excellent service.",
        "So glad you had a smooth rental experience! Thanks for taking the time to leave this review."
      ];
    } else if (rating >= 3) {
      return [
        "Thank you for your feedback. We appreciate you taking the time to share your experience with us.",
        "We value your honest review and will use it to improve our service. Thank you for choosing us.",
        "Thank you for the feedback. We're always working to enhance our customers' experience.",
        "We appreciate your review and the opportunity to serve you. Your feedback helps us grow."
      ];
    } else {
      return [
        "Thank you for your honest feedback. We sincerely apologize that your experience didn't meet expectations. We take all feedback seriously and will work to improve.",
        "We're sorry to hear about your concerns. Your feedback is valuable to us and we're committed to making improvements. Thank you for giving us the opportunity to do better.",
        "We apologize for any inconvenience you experienced. We appreciate you taking the time to share your feedback and will use it to enhance our service.",
        "Thank you for bringing this to our attention. We're sorry your experience wasn't up to our usual standards and we're working to address these issues."
      ];
    }
  };

  const replySuggestions = getReplysuggestions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (replyText.trim().length < 10) {
      toast.error('Reply must be at least 10 characters long');
      return;
    }

    try {
      setIsSubmitting(true);
      const endpoint = isEditing 
        ? `/api/reviews/reply/${review._id}` 
        : `/api/reviews/reply/${review._id}`;
      
      const method = isEditing ? 'put' : 'post';
      
      const { data } = await axios[method](endpoint, {
        replyText: replyText.trim()
      });

      if (data.success) {
        toast.success(isEditing ? 'Reply updated successfully!' : 'Reply submitted successfully!');
        onReplySubmitted();
        handleClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to submit reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReplyText(review?.ownerReply?.text || '');
    onClose();
  };

  const StarIcon = ({ filled, size = 'w-4 h-4' }) => (
    <svg className={`${size} ${filled ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Edit Your Reply' : 'Reply to Review'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <img src={assets.close_icon} alt="Close" className="w-6 h-6" />
              </button>
            </div>

            {/* Review Context */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <img 
                  src={review?.car?.image} 
                  alt="Car" 
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">
                    {review?.car?.brand} {review?.car?.model}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} filled={star <= review?.rating} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      by {review?.user?.name}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed bg-white p-3 rounded-lg border">
                    "{review?.reviewText}"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reviewed on {new Date(review?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply <span className="text-red-500">*</span>
                </label>

                {/* Reply Suggestions */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">💡 Quick Reply Suggestions:</p>
                  <div className="grid gap-2">
                    {replySuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setReplyText(suggestion)}
                        disabled={isSubmitting}
                        className="text-left p-3 text-sm border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setReplyText('')}
                      disabled={isSubmitting}
                      className="px-3 py-1 text-xs text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyText(replyText + ' ')}
                      disabled={isSubmitting}
                      className="px-3 py-1 text-xs text-primary border border-primary/20 rounded-md hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                      Custom Reply
                    </button>
                  </div>
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Thank the customer for their feedback and address any concerns they mentioned. Keep it professional and helpful."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:bg-gray-100"
                  rows="5"
                  maxLength="400"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Minimum 10 characters required
                  </p>
                  <p className="text-xs text-gray-500">
                    {replyText.length}/400 characters
                  </p>
                </div>
              </div>

              {/* Reply Guidelines */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 Reply Guidelines:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Thank the customer for their honest feedback</li>
                  <li>• Address any specific concerns they mentioned</li>
                  <li>• Highlight improvements made based on feedback</li>
                  <li>• Keep the tone professional and courteous</li>
                  <li>• Remember: Other potential customers will see this</li>
                </ul>
              </div>

              {/* Important Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-amber-600">⚠️</div>
                  <div>
                    <p className="font-medium text-amber-800 mb-1">
                      One Reply Only
                    </p>
                    <p className="text-sm text-amber-700">
                      You can only reply once to each review. {isEditing ? 'You can edit this reply, but cannot delete it once saved.' : 'Choose your words carefully as you cannot delete your reply later.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || replyText.trim().length < 10}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {isSubmitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Reply' : 'Submit Reply')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OwnerReplyModal;
