import React, { useState } from 'react'
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate subscription process
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-primary to-purple-700 relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent'></div>
      <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48'></div>
      <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32'></div>
      
      <div className='relative z-10 max-w-4xl mx-auto text-center'>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='mb-12'
        >
          <div className='inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium text-sm mb-6'>
            <div className='w-2 h-2 bg-yellow-300 rounded-full mr-2 animate-pulse'></div>
            Exclusive Offers
          </div>
          
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight'>
            Never Miss a 
            <span className='block text-yellow-300'>Great Deal!</span>
          </h2>
          
          <p className='text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto'>
            Subscribe to our newsletter and be the first to know about exclusive offers, new vehicle arrivals, and special discounts.
          </p>
        </motion.div>

        {/* Subscription Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='mb-12'
        >
          <form onSubmit={handleSubmit} className='max-w-xl mx-auto'>
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-0'>
              <div className='flex-1 relative'>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-r-none outline-none text-gray-700 placeholder-gray-500 focus:ring-4 focus:ring-white/30 transition-all duration-300"
                  placeholder="Enter your email address"
                  required
                />
                <div className='absolute right-4 top-1/2 transform -translate-y-1/2 sm:hidden'>
                  <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                  </svg>
                </div>
              </div>
              
              <motion.button 
                type="submit" 
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-primary font-bold rounded-xl sm:rounded-l-none shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
          </form>
          
          <p className='text-white/70 text-sm mt-4'>
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8'
        >
          <div className='flex items-center justify-center gap-3 text-white/90'>
            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z'/>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z' clipRule='evenodd'/>
              </svg>
            </div>
            <div className='text-left'>
              <div className='font-semibold'>Exclusive Discounts</div>
              <div className='text-sm text-white/70'>Up to 30% off</div>
            </div>
          </div>
          
          <div className='flex items-center justify-center gap-3 text-white/90'>
            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'/>
              </svg>
            </div>
            <div className='text-left'>
              <div className='font-semibold'>Early Access</div>
              <div className='text-sm text-white/70'>New arrivals first</div>
            </div>
          </div>
          
          <div className='flex items-center justify-center gap-3 text-white/90'>
            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd'/>
              </svg>
            </div>
            <div className='text-left'>
              <div className='font-semibold'>Expert Tips</div>
              <div className='text-sm text-white/70'>Travel insights</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter
