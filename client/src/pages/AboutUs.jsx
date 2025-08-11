import React from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-primary to-primary-dull text-white py-20 px-6 md:px-16 lg:px-24 xl:px-32"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About CarRental
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl opacity-90"
          >
            Your trusted partner for premium car rental services across India
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="py-16 px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Our Story Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
              >
                Our Story
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-gray-600 leading-relaxed mb-4"
              >
                We are Vishal Thakur and Rohit Sharma, passionate developers dedicated to building efficient and user-friendly digital solutions. Our Car Rental Project is designed to make vehicle booking simple, fast, and accessible for everyone.
                With a focus on seamless user experience, secure transactions, and real-time availability, our platform allows customers to browse, book, and manage rentals with ease. From intuitive navigation to robust backend functionality, every feature has been crafted to ensure convenience for both customers and rental service providers.
                Our goal is to combine technology and practicality, delivering a solution that saves time, reduces hassle, and enhances mobility.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-gray-600 leading-relaxed"
              >
                Today, we serve customers across major Indian cities, offering everything from 
                economy cars to luxury vehicles, all maintained to the highest standards.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <img src={assets.main_car} alt="Car rental" className="w-full rounded-lg shadow-lg" />
            </motion.div>
          </div>
        </motion.div>

        {/* Mission & Values */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-20"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
          >
            Our Mission & Values
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Trust & Safety",
                description: "Every vehicle and driver is verified and insured for your peace of mind.",
                icon: "🛡️"
              },
              {
                title: "Affordability",
                description: "Competitive pricing with no hidden fees, making car rental accessible to everyone.",
                icon: "💰"
              },
              {
                title: "Convenience",
                description: "Book instantly, pick up anywhere, and enjoy seamless customer support.",
                icon: "⚡"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg p-8 md:p-12 max-w-6xl mx-auto"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
          >
            CarRental by the Numbers
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Happy Customers" },
              { number: "15K+", label: "Cars Available" },
              { number: "25+", label: "Cities Covered" },
              { number: "4.8/5", label: "Customer Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutUs
