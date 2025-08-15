import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

const Testimonial = () => {

    const testimonials = [
        { name: "Priya Sharma",
          location: "Mumbai, India",
          image: assets.testimonial_image_1,
          testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional. Perfect for my business trips!",
          rating: 5
        },
        { name: "Rajesh Kumar",
          location: "Bangalore, India",
          image: assets.testimonial_image_2,
          testimonial: "CarRental made my family vacation so much easier. The car was delivered right to our home, and the customer service was fantastic!",
          rating: 5
        },
        { name: "Sneha Patel",
          location: "Delhi, India",
          image: assets.testimonial_image_1,
          testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
          rating: 5
        }
    ];

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-gray-50 to-white">
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='text-center max-w-3xl mx-auto mb-16'
      >
        <div className='inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm mb-6'>
          <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
          Customer Stories
        </div>
        
        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
          What Our 
          <span className='text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text'>
            {' '}Customers Say
          </span>
        </h2>
        
        <p className='text-lg text-gray-600 leading-relaxed'>
          Discover why thousands of travelers choose CarRental for their premium vehicle needs across India.
        </p>
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            key={index} 
            className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 relative overflow-hidden group"
          >
            
            {/* Background Decoration */}
            <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500'></div>
            
            {/* Quote Icon */}
            <div className='absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
              <svg className='w-4 h-4 text-primary' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z'/>
              </svg>
            </div>

            <div className="relative z-10">
              
              {/* Customer Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className='relative'>
                  <img 
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200" 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                  />
                  <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center'>
                    <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                    </svg>
                    {testimonial.location}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array(testimonial.rating).fill(0).map((_, starIndex) => (
                  <svg key={starIndex} className='w-4 h-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                  </svg>
                ))}
                <span className='text-sm font-medium text-gray-600 ml-2'>({testimonial.rating}.0)</span>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 text-sm lg:text-base leading-relaxed italic">
                "{testimonial.testimonial}"
              </blockquote>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className='text-center mt-16'
      >
        <p className='text-gray-600 mb-6'>
          Join thousands of satisfied customers who trust CarRental for their travel needs.
        </p>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className='px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300'
        >
          Start Your Journey Today
        </motion.button>
      </motion.div>
    </section>
  )
}

export default Testimonial
