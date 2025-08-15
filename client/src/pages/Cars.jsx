import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { statesList } from '../data/stateCityMapping'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const Cars = () => {

  // getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const searchQuery = searchParams.get('search')

  const {cars, axios} = useAppContext()

  const [input, setInput] = useState(searchQuery || '')
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    state: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    fuelType: '',
    transmission: '',
    seatingCapacity: ''
  })

  const isSearchData = pickupLocation && pickupDate && returnDate
  const [filteredCars, setFilteredCars] = useState([])

  // Get unique values for filter options
  const getUniqueValues = (field) => {
    const values = cars.map(car => {
      if (field === 'state') return car.address?.state || 'Other'
      if (field === 'brand') return car.brand
      if (field === 'category') return car.category
      if (field === 'fuelType') return car.fuel_type
      if (field === 'transmission') return car.transmission
      if (field === 'seatingCapacity') return car.seating_capacity
      return car[field]
    }).filter(Boolean)
    return [...new Set(values)].sort()
  }

  const applyFilter = async () => {
    let filtered = cars.slice()

    // Apply text search
    if (input !== '') {
      filtered = filtered.filter((car) => {
        return car.brand.toLowerCase().includes(input.toLowerCase())
        || car.model.toLowerCase().includes(input.toLowerCase())
        || car.category.toLowerCase().includes(input.toLowerCase())
        || car.transmission.toLowerCase().includes(input.toLowerCase())
        || car.location.toLowerCase().includes(input.toLowerCase())
        || (car.address && car.address.city && car.address.city.toLowerCase().includes(input.toLowerCase()))
        || (car.address && car.address.state && car.address.state.toLowerCase().includes(input.toLowerCase()))
        || (car.address && car.address.street && car.address.street.toLowerCase().includes(input.toLowerCase()))
      })
    }

    // Apply advanced filters
    if (filters.state) {
      filtered = filtered.filter(car =>
        (car.address?.state || 'Other') === filters.state
      )
    }

    if (filters.brand) {
      filtered = filtered.filter(car => car.brand === filters.brand)
    }

    if (filters.category) {
      filtered = filtered.filter(car => car.category === filters.category)
    }

    if (filters.fuelType) {
      filtered = filtered.filter(car => car.fuel_type === filters.fuelType)
    }

    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission)
    }

    if (filters.seatingCapacity) {
      filtered = filtered.filter(car => car.seating_capacity.toString() === filters.seatingCapacity)
    }

    if (filters.minPrice) {
      filtered = filtered.filter(car => car.pricePerDay >= parseInt(filters.minPrice))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.pricePerDay <= parseInt(filters.maxPrice))
    }

    setFilteredCars(filtered)
  }

  const searchCarAvailablity = async () =>{
    const {data} = await axios.post('/api/bookings/check-availability', {location: pickupLocation, pickupDate, returnDate})
    if (data.success) {
      setFilteredCars(data.availableCars)
      if(data.availableCars.length === 0){
        toast('No cars available')
      }
      return null
    }
  }

  useEffect(()=>{
    isSearchData && searchCarAvailablity()
  },[])

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter()
  }, [input, cars, filters])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({
      state: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      category: '',
      fuelType: '',
      transmission: '',
      seatingCapacity: ''
    })
    setInput('')
  }

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '') || input !== ''

  // Quick filter suggestions
  const quickFilters = [
    { label: 'Luxury Cars', filters: { category: 'Luxury' } },
    { label: 'SUV', filters: { category: 'SUV' } },
    { label: 'Under ₹2000', filters: { maxPrice: '2000' } },
    { label: 'Automatic', filters: { transmission: 'Automatic' } },
    { label: '7+ Seats', filters: { seatingCapacity: '7' } },
    { label: 'Petrol', filters: { fuelType: 'Petrol' } }
  ]

  const applyQuickFilter = (quickFilterData) => {
    setFilters(prev => ({ ...prev, ...quickFilterData }))
  }

  // Handle search parameter from URL
  useEffect(()=>{
    if(searchQuery && searchQuery !== input) {
      setInput(searchQuery)
    }
  },[searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">

      {/* Hero Section */}
      <section className='py-16 lg:py-20 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-br from-primary via-purple-600 to-purple-700 text-white relative overflow-hidden'>
        
        {/* Background Decorations */}
        <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent'></div>
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48'></div>
        <div className='absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32'></div>
        
        <div className='relative z-10 max-w-6xl mx-auto text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-medium text-sm mb-6'>
              <div className='w-2 h-2 bg-yellow-300 rounded-full mr-2 animate-pulse'></div>
              Premium Vehicle Collection
            </div>
            
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight'>
              Find Your Perfect 
              <span className='block text-yellow-300'>Rental Car</span>
            </h1>
            
            <p className='text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-12'>
              Browse our extensive collection of premium vehicles and book the perfect car for your journey across India.
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='max-w-4xl mx-auto'
          >
            <div className='bg-white/10 backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/20'>
              
              {/* Search Bar */}
              <div className='flex items-center bg-white rounded-2xl p-4 mb-6 shadow-lg'>
                <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3'>
                  <img src={assets.search_icon} alt="search" className='w-4 h-4'/>
                </div>
                <input
                  onChange={(e)=> setInput(e.target.value)}
                  value={input}
                  type="text"
                  placeholder='Search by brand, model, location...'
                  className='flex-1 outline-none text-gray-700 text-lg placeholder:text-gray-500'
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    showFilters || hasActiveFilters 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  title={showFilters ? 'Hide filters' : 'Show filters'}
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z' />
                  </svg>
                </button>
              </div>

              {/* Quick Filters */}
              {!showFilters && (
                <div className='flex flex-wrap gap-3 justify-center'>
                  <p className='text-white/70 text-sm w-full text-center mb-3'>Quick filters:</p>
                  {quickFilters.map((quickFilter, index) => {
                    const isActive = Object.entries(quickFilter.filters).every(
                      ([key, value]) => filters[key] === value
                    )
                    return (
                      <button
                        key={index}
                        onClick={() => applyQuickFilter(quickFilter.filters)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-yellow-300 text-gray-900 shadow-lg'
                            : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                        }`}
                      >
                        {quickFilter.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-8 bg-white border-b border-gray-200'
        >
          <div className='max-w-6xl mx-auto'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h3 className='text-2xl font-bold text-gray-900'>Advanced Filters</h3>
                <p className='text-gray-600 mt-1'>Refine your search to find the perfect vehicle</p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className='flex items-center gap-2 text-primary hover:text-primary-dull font-semibold transition-colors'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                  Clear All
                </button>
              )}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              
              {/* State Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                    <img src={assets.location_icon} alt="location" className='w-3 h-3'/>
                  </div>
                  State
                </label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                >
                  <option value=''>All States</option>
                  {getUniqueValues('state').map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                    <img src={assets.car_icon} alt="car" className='w-3 h-3'/>
                  </div>
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                >
                  <option value=''>All Brands</option>
                  {getUniqueValues('brand').map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                >
                  <option value=''>All Categories</option>
                  {getUniqueValues('category').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                    <img src={assets.fuel_icon} alt="fuel" className='w-3 h-3'/>
                  </div>
                  Fuel Type
                </label>
                <select
                  value={filters.fuelType}
                  onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                >
                  <option value=''>All Fuel Types</option>
                  {getUniqueValues('fuelType').map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              {/* Transmission Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>Transmission</label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                >
                  <option value=''>All Transmissions</option>
                  {getUniqueValues('transmission').map(transmission => (
                    <option key={transmission} value={transmission}>{transmission}</option>
                  ))}
                </select>
              </div>

              {/* Seating Capacity Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                  <div className='w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center'>
                    <img src={assets.users_icon} alt="seats" className='w-3 h-3'/>
                  </div>
                  Seating
                </label>
                <select
                  value={filters.seatingCapacity}
                  onChange={(e) => handleFilterChange('seatingCapacity', e.target.value)}
                  className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                >
                  <option value=''>Any Seating</option>
                  {getUniqueValues('seatingCapacity').map(seats => (
                    <option key={seats} value={seats}>{seats} Seats</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className='lg:col-span-2 space-y-2'>
                <label className='text-sm font-semibold text-gray-700'>Price Range (₹/day)</label>
                <div className='grid grid-cols-2 gap-3'>
                  <input
                    type='number'
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder='Min price'
                    className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                  />
                  <input
                    type='number'
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder='Max price'
                    className='w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300'
                  />
                </div>
                {(filters.minPrice || filters.maxPrice) && (
                  <p className='text-xs text-gray-500'>
                    {filters.minPrice && filters.maxPrice
                      ? `₹${filters.minPrice} - ₹${filters.maxPrice} per day`
                      : filters.minPrice
                      ? `Above ₹${filters.minPrice} per day`
                      : `Below ₹${filters.maxPrice} per day`
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className='mt-8 p-6 bg-gray-50 rounded-2xl'>
                <div className='flex items-center justify-between mb-4'>
                  <p className='font-semibold text-gray-800'>Active Filters ({Object.values(filters).filter(v => v).length + (input ? 1 : 0)}):</p>
                  <p className='text-sm text-gray-600'>{filteredCars.length} vehicle{filteredCars.length !== 1 ? 's' : ''} found</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {input && (
                    <span className='inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium'>
                      Search: "{input}"
                      <button
                        onClick={() => setInput('')}
                        className='ml-2 text-primary hover:text-primary-dull'
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null
                    const labels = {
                      state: 'State',
                      brand: 'Brand',
                      category: 'Category',
                      fuelType: 'Fuel',
                      transmission: 'Transmission',
                      seatingCapacity: 'Seats',
                      minPrice: 'Min ₹',
                      maxPrice: 'Max ₹'
                    }
                    return (
                      <span key={key} className='inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium'>
                        {labels[key]}: {value}{key === 'seatingCapacity' ? ' Seats' : ''}
                        <button
                          onClick={() => handleFilterChange(key, '')}
                          className='ml-2 text-primary hover:text-primary-dull'
                        >
                          ×
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Cars Grid Section */}
      <section className='py-16 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32'>
        <div className='max-w-7xl mx-auto'>
          
          {/* Results Header */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-2xl lg:text-3xl font-bold text-gray-900'>
                Available Vehicles
              </h2>
              <p className='text-gray-600 mt-1'>
                Showing {filteredCars.length} of {cars.length} Cars
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearFilters}
                className='px-6 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-semibold transition-all duration-300'
              >
                Clear All Filters
              </motion.button>
            )}
          </div>

          {/* Cars Grid */}
          {filteredCars.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8'
            >
              {filteredCars.map((car, index)=> (
                <motion.div 
                  key={car._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 8), duration: 0.4 }}
                >
                  <CarCard car={car}/>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center py-16'
            >
              <div className='bg-white rounded-3xl p-12 shadow-lg max-w-md mx-auto'>
                <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33m12.16 0a7.962 7.962 0 01-2.241 1.64M6.828 12.828L12 7.657l5.172 5.171M3 12a9 9 0 1118 0 9 9 0 01-18 0z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-3'>No vehicles found</h3>
                <p className='text-gray-600 mb-6'>
                  {hasActiveFilters
                    ? 'Try adjusting your filters to see more results.'
                    : 'No cars available at the moment.'
                  }
                </p>
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    className='px-8 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300'
                  >
                    Clear All Filters
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Cars
