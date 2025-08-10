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
    <div>

      <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}

      className='flex flex-col items-center py-12 sm:py-16 lg:py-20 bg-light px-4'>
        <Title title='Available Cars' subTitle='Browse our selection of premium vehicles available for your next adventure'/>

        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}

        className='w-full max-w-6xl px-4 sm:px-0'>
          {/* Search Bar */}
          <div className='flex items-center bg-white px-4 mt-6 max-w-sm sm:max-w-lg lg:max-w-2xl w-full h-12 sm:h-14 rounded-full shadow-md mx-auto relative'>
            <img src={assets.search_icon} alt="" className='w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0'/>
            <input
              onChange={(e)=> setInput(e.target.value)}
              value={input}
              type="text"
              placeholder='Search by make, model, location...'
              className='w-full h-full outline-none text-gray-700 text-sm sm:text-base placeholder:text-gray-500'
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-all duration-200 ${
                showFilters || hasActiveFilters ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100'
              }`}
              title={showFilters ? 'Hide filters' : 'Show filters'}
            >
              <img src={assets.filter_icon} alt="" className={`w-4 h-4 sm:w-5 sm:h-5 ${
                showFilters || hasActiveFilters ? 'brightness-0 invert' : ''
              }`}/>
            </button>
          </div>

          {/* Quick Filter Pills */}
          {!showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className='flex flex-wrap gap-2 justify-center mt-4 max-w-4xl mx-auto'
            >
              <p className='text-xs text-gray-500 w-full text-center mb-2'>Quick filters:</p>
              {quickFilters.map((quickFilter, index) => {
                const isActive = Object.entries(quickFilter.filters).every(
                  ([key, value]) => filters[key] === value
                )
                return (
                  <button
                    key={index}
                    onClick={() => applyQuickFilter(quickFilter.filters)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {quickFilter.label}
                  </button>
                )
              })}
            </motion.div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 mt-6 mx-auto max-w-6xl'
            >
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800'>Advanced Filters</h3>
                  <p className='text-sm text-gray-500'>Find the perfect car for your needs</p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className='text-sm text-primary hover:text-primary-dull font-medium flex items-center gap-1'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                    Clear All
                  </button>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                {/* State Filter */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                  >
                    <option value=''>All States</option>
                    {getUniqueValues('state').map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                  >
                    <option value=''>All Brands</option>
                    {getUniqueValues('brand').map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                  >
                    <option value=''>All Categories</option>
                    {getUniqueValues('category').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Fuel Type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                  >
                    <option value=''>All Fuel Types</option>
                    {getUniqueValues('fuelType').map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission Filter */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                  >
                    <option value=''>All Transmissions</option>
                    {getUniqueValues('transmission').map(transmission => (
                      <option key={transmission} value={transmission}>{transmission}</option>
                    ))}
                  </select>
                </div>

                {/* Seating Capacity Filter */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Seating</label>
                  <select
                    value={filters.seatingCapacity}
                    onChange={(e) => handleFilterChange('seatingCapacity', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                  >
                    <option value=''>Any Seating</option>
                    {getUniqueValues('seatingCapacity').map(seats => (
                      <option key={seats} value={seats}>{seats} Seats</option>
                    ))}
                  </select>
                </div>

                {/* Price Range - Spanning 2 columns on larger screens */}
                <div className='lg:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Price Range (₹/day)</label>
                  <div className='grid grid-cols-2 gap-2'>
                    <input
                      type='number'
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder='Min price'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                    />
                    <input
                      type='number'
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder='Max price'
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                    />
                  </div>
                  {(filters.minPrice || filters.maxPrice) && (
                    <p className='text-xs text-gray-500 mt-1'>
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
                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <div className='flex items-center justify-between mb-3'>
                    <p className='text-sm text-gray-600'>Active Filters ({Object.values(filters).filter(v => v).length + (input ? 1 : 0)}):</p>
                    <p className='text-xs text-gray-500'>{filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found</p>
                  </div>
                  <div className='flex flex-wrap gap-2 max-h-32 overflow-y-auto'>
                    {input && (
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary'>
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
                        <span key={key} className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary'>
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
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}

      className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 mt-8 sm:mt-10'>
        <div className='flex items-center justify-between xl:px-20 max-w-7xl mx-auto mb-4'>
          <p className='text-gray-500 text-sm sm:text-base'>
            Showing {filteredCars.length} of {cars.length} Cars
            {hasActiveFilters && ' (filtered)'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className='text-sm text-primary hover:text-primary-dull font-medium'
            >
              Clear All Filters
            </button>
          )}
        </div>

        {filteredCars.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:px-20 max-w-7xl mx-auto'>
            {filteredCars.map((car, index)=> (
              <motion.div key={car._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index % 8), duration: 0.4 }}
              >
                <CarCard car={car}/>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-12 xl:px-20 max-w-7xl mx-auto'
          >
            <div className='bg-gray-50 rounded-2xl p-8'>
              <img src={assets.search_icon} alt='No results' className='w-16 h-16 mx-auto mb-4 opacity-50'/>
              <h3 className='text-xl font-semibold text-gray-800 mb-2'>No cars found</h3>
              <p className='text-gray-600 mb-4'>
                {hasActiveFilters
                  ? 'Try adjusting your filters to see more results.'
                  : 'No cars available at the moment.'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors font-medium'
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

    </div>
  )
}

export default Cars
