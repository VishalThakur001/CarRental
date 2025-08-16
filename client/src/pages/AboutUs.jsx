import React from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-purple-600 to-purple-700 text-white py-20 lg:py-32 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 relative overflow-hidden">
        
        {/* Background Decorations */}
        <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent'></div>
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32'></div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium text-sm mb-8'>
              <div className='w-2 h-2 bg-yellow-300 rounded-full mr-2 animate-pulse'></div>
              About Our Company
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Redefining 
              <span className='block text-yellow-300'>Car Rental</span>
              in India
            </h1>
            
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Your trusted partner for premium car rental services across India, connecting travelers with quality vehicles and exceptional experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16 lg:py-24 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
        
        {/* Our Story Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-20 lg:mb-32"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className='inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm mb-6'>
                <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
                Our Journey
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                Built by Developer,
                <span className='text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text block'>
                  Designed for Everyone
                </span>
              </h2>
              
              <div className='space-y-4 text-gray-600 leading-relaxed text-lg'>
                <p>
                  I am <strong className='text-gray-900'>Vishal Thakur</strong>, a passionate developer dedicated to building efficient and user-friendly digital solutions. My Car Rental Project is designed to make vehicle booking simple, fast, and accessible for everyone.
                </p>
                <p>
                  With a focus on seamless user experience and real-time availability, the platform allows customers to book and manage rentals with ease. From intuitive navigation to robust backend functionality, every feature has been crafted to ensure convenience for both customers and rental service providers.
                </p>
                <p>
                  My goal is to combine technology and practicality, delivering a solution that saves time, reduces hassle, and enhances mobility across India.
                </p>
              </div>

              {/* Developer Info Card */}
              <div className='mt-8'>
                <div className='bg-white p-6 rounded-2xl shadow-lg border border-gray-100'>
                  <h4 className='font-bold text-gray-900'>Vishal Thakur</h4>
                  <p className='text-sm text-primary font-medium'>Full Stack Developer</p>
                  <p className='text-xs text-gray-600 mb-2'>Backend & Database</p>
                  <a 
                    href="https://yourprofessionalwebsite.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    My Portfolio
                  </a>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className='relative'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-3xl blur-3xl'></div>
              <img 
                src={assets.main_car} 
                alt="Car rental platform" 
                className="relative z-10 w-full rounded-3xl shadow-2xl" 
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Mission & Values */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-20 lg:mb-32"
        >
          <div className='text-center mb-16'>
            <div className='inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm mb-6'>
              <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
              Our Values
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What Drives Us
              <span className='text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text'>
                Forward
              </span>
            </h2>
            
            <p className='text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto'>
              Our mission is built on core values that ensure every customer receives the best possible car rental experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Trust & Safety",
                description: "Every vehicle and driver is verified and insured for your complete peace of mind. We prioritize your safety above everything else.",
                icon: "🛡️",
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Affordability",
                description: "Competitive pricing with transparent rates and no hidden fees, making premium car rental accessible to everyone across India.",
                icon: "💰",
                color: "from-green-500 to-green-600"
              },
              {
                title: "Convenience",
                description: "Book instantly, pick up anywhere, and enjoy 24/7 customer support. We make car rental as easy as a few clicks.",
                icon: "⚡",
                color: "from-purple-500 to-purple-600"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Statistics */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary via-purple-600 to-purple-700 rounded-3xl p-8 lg:p-16 max-w-7xl mx-auto text-white relative overflow-hidden"
        >
          {/* Background Decorations */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent'></div>
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32'></div>
          <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24'></div>
          
          <div className='relative z-10'>
            <div className='text-center mb-12'>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                CarRental in Numbers
              </h2>
              <p className='text-white/90 text-lg'>
                Our platform's growth speaks for itself
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Happy Customers", icon: "👥" },
                { number: "500+", label: "Premium Cars", icon: "🚗" },
                { number: "50+", label: "Cities Covered", icon: "🏙️" },
                { number: "4.9/5", label: "Customer Rating", icon: "⭐" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className='text-4xl mb-3'>{stat.icon}</div>
                  <div className="text-3xl lg:text-4xl font-bold text-yellow-300 mb-2">{stat.number}</div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mt-20 lg:mt-32'
        >
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-6'>
              Ready to Start Your Journey?
            </h2>
            <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
              Join thousands of satisfied customers who trust CarRental for their travel needs. Experience the difference of premium service and reliable vehicles.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/cars'}
                className='px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300'
              >
                Browse Cars Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/owner/add-car'}
                className='px-8 py-4 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all duration-300'
              >
                List Your Car
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default AboutUs