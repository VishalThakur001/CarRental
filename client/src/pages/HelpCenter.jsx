import React, { useState } from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'

const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      question: "How do I book a car?",
      answer: "Simply search for your location and dates, browse available cars, select your preferred vehicle, and complete the booking process. You'll receive a confirmation email with pickup details.",
      category: "Booking"
    },
    {
      question: "What documents do I need to rent a car?",
      answer: "You need a valid driver's license, government-issued ID (Aadhar card/Passport), and a credit card for security deposit. All documents should be original and valid.",
      category: "Requirements"
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 24 hours before pickup time for a full refund. Cancellations within 24 hours may incur a small fee.",
      category: "Cancellation"
    },
    {
      question: "Is insurance included?",
      answer: "Yes, all our rentals include comprehensive insurance coverage. Additional coverage options are available for extra protection.",
      category: "Insurance"
    },
    {
      question: "What if the car breaks down?",
      answer: "We provide 24/7 roadside assistance. Call our support number immediately, and we'll arrange repairs or a replacement vehicle at no extra cost.",
      category: "Support"
    },
    {
      question: "How do I become a car owner on the platform?",
      answer: "Visit our 'List Your Car' page, fill out the application form, and our team will verify your documents. Once approved, you can start listing your vehicles.",
      category: "Owner"
    },
    {
      question: "What are the fuel policies?",
      answer: "Cars are provided with a full tank and should be returned with the same level. If returned with less fuel, a refueling charge will be applied.",
      category: "Policies"
    },
    {
      question: "Can I extend my rental period?",
      answer: "Yes, you can extend your rental if the car is available. Contact customer support or use the app to request an extension.",
      category: "Booking"
    }
  ]

  const contactMethods = [
    {
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "+91 1800-123-4567",
      hours: "24/7 Available",
      icon: "📞",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Email Support",
      description: "Send us your queries via email",
      contact: "support@carrental.com",
      hours: "Response within 2 hours",
      icon: "📧",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available on website",
      hours: "9 AM - 11 PM",
      icon: "💬",
      color: "from-purple-500 to-purple-600"
    }
  ]

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              24/7 Customer Support
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              How Can We
              <span className='block text-yellow-300'>Help You?</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-12">
              Find answers to your questions and get the support you need for a seamless car rental experience.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
                <div className="flex items-center bg-white rounded-xl p-4">
                  <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3'>
                    <img src={assets.search_icon} alt="search" className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for help topics, booking questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-gray-700 text-lg placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="py-16 lg:py-24 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
        
        {/* Contact Methods */}
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
              Multiple Ways to Reach Us
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Get in Touch 
              <span className='text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text'>
                With Our Team
              </span>
            </h2>
            
            <p className='text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto'>
              Choose the contact method that works best for you. Our support team is here to help 24/7.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${method.color}`}></div>
                <div className='p-8'>
                  <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{method.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{method.title}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <div className='bg-gray-50 rounded-2xl p-4 mb-4'>
                    <p className="text-primary font-bold text-lg">{method.contact}</p>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{method.hours}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-20 lg:mb-32"
        >
          <div className='text-center mb-16'>
            <div className='inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium text-sm mb-6'>
              <div className='w-2 h-2 bg-primary rounded-full mr-2 animate-pulse'></div>
              Common Questions
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked 
              <span className='text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text'>
                Questions
              </span>
            </h2>
            
            <p className='text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto'>
              Find quick answers to the most common questions about our car rental service.
            </p>
          </div>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 lg:px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className='flex items-center gap-4'>
                    <div className='px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full'>
                      {faq.category}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary flex-shrink-0 ml-4"
                  >
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 lg:px-8 pb-6 border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33m12.16 0a7.962 7.962 0 01-2.241 1.64M6.828 12.828L12 7.657l5.172 5.171M3 12a9 9 0 1118 0 9 9 0 01-18 0z' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-3'>No results found</h3>
              <p className="text-gray-600 text-lg">No results found for "{searchQuery}". Try a different search term or contact our support team.</p>
            </motion.div>
          )}
        </motion.section>

        {/* Emergency Contact */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
            
            {/* Background Pattern */}
            <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent'></div>
            <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
            <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12'></div>
            
            <div className="relative z-10 text-center">
              <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className="text-4xl">🚨</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Emergency Support</h3>
              <p className="text-red-100 mb-8 text-lg">
                For roadside assistance or emergencies during your rental period
              </p>
              <motion.a 
                href="tel:+911800123456" 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 bg-white text-red-600 font-bold py-4 px-8 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-lg"
              >
                <span className='text-2xl'>📞</span>
                <div>
                  <div className='text-sm opacity-80'>Emergency Hotline</div>
                  <div className='text-lg'>+91 1800-123-456</div>
                </div>
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default HelpCenter
