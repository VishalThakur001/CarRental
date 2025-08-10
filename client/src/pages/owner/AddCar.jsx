import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { stateCityMapping, statesList } from '../../data/stateCityMapping'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency} = useAppContext()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: '',
    pricePerDay: '',
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: '',
    location: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: ''
    },
    description: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null

    // Frontend validation with user-friendly messages
    if (!image) {
      toast.error('Please upload a car image before submitting')
      return
    }

    if (!car.category) {
      toast.error('Please select a car category')
      return
    }

    if (!car.transmission) {
      toast.error('Please select transmission type')
      return
    }

    if (!car.fuel_type) {
      toast.error('Please select fuel type')
      return
    }

    if (!car.location || !car.address.state) {
      toast.error('Please select both state and city for pickup location')
      return
    }

    if (car.year && (car.year < 1900 || car.year > new Date().getFullYear() + 1)) {
      toast.error('Please enter a valid model year')
      return
    }

    if (car.pricePerDay && car.pricePerDay <= 0) {
      toast.error('Daily price must be greater than 0')
      return
    }

    if (car.seating_capacity && (car.seating_capacity < 1 || car.seating_capacity > 50)) {
      toast.error('Seating capacity must be between 1 and 50')
      return
    }

    // Validate image file
    if (image.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(image.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const {data} = await axios.post('/api/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: '',
          pricePerDay: '',
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: '',
          location: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            landmark: ''
          },
          description: '',
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error adding car:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.status === 413) {
        toast.error('Image file is too large. Please upload a smaller image.')
      } else if (error.response?.status === 400) {
        toast.error('Invalid car details. Please check all fields and try again.')
      } else if (error.response?.status === 401) {
        toast.error('You need to be logged in to add a car.')
      } else if (error.message.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection.')
      } else {
        toast.error('Failed to add car. Please try again or contact support if the problem persists.')
      }
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-6 sm:py-8 lg:py-10 md:px-6 lg:px-10 flex-1'>

      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 sm:gap-5 text-gray-500 text-sm mt-6 max-w-2xl'>

        {/* Car Image */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full'>
          <label htmlFor="car-image" className='cursor-pointer'>
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className='h-16 sm:h-20 w-16 sm:w-20 rounded-lg object-cover border-2 border-dashed border-gray-300 hover:border-primary transition-colors'/>
            <input type="file" id="car-image" accept="image/*" hidden onChange={e=> setImage(e.target.files[0])}/>
          </label>
          <div>
            <p className='text-sm sm:text-base text-gray-700 font-medium'>Upload Car Image *</p>
            <p className='text-xs sm:text-sm text-gray-500'>Click to upload a picture of your car (Max 5MB, JPEG/PNG/WebP)</p>
            {!image && (
              <p className='text-xs text-red-500 mt-1'>Car image is required</p>
            )}
          </div>
        </div>

        {/* Car Brand & Model */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input type="text" placeholder="e.g. BMW, Mercedes, Audi..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e=> setCar({...car, brand: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input type="text" placeholder="e.g. X5, E-Class, M4..." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.model} onChange={e=> setCar({...car, model: e.target.value})}/>
          </div>
          
        </div>

        {/* Car Year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          <div className='flex flex-col w-full'>
            <label>Model Year</label>
            <input type="number" placeholder="2025" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e=> setCar({...car, year: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input type="number" placeholder="100" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.pricePerDay} onChange={e=> setCar({...car, pricePerDay: e.target.value})}/>
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select onChange={e=> setCar({...car, category: e.target.value})} value={car.category} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' required>
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Wagon">Wagon</option>
              <option value="Pickup Truck">Pickup Truck</option>
              <option value="Van">Van</option>
              <option value="Minivan">Minivan</option>
              <option value="Crossover">Crossover</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports Car">Sports Car</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

         {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select onChange={e=> setCar({...car, transmission: e.target.value})} value={car.transmission} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' required>
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select onChange={e=> setCar({...car, fuel_type: e.target.value})} value={car.fuel_type} className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' required>
              <option value="">Select a fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input type="number" placeholder="4" required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e=> setCar({...car, seating_capacity: e.target.value})}/>
          </div>
        </div>

         {/* Car Location & Address */}
         <div className='flex flex-col w-full'>
            <label className='font-medium text-gray-700 mb-2'>Pickup Location & Address</label>

            {/* State and City Selection */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
              <div className='flex flex-col'>
                <label className='text-sm text-gray-600'>State *</label>
                <select
                  onChange={e=> {
                    const selectedState = e.target.value;
                    setCar({
                      ...car,
                      address: {...car.address, state: selectedState, city: ''},
                      location: '' // Reset city selection when state changes
                    })
                  }}
                  value={car.address.state}
                  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                  required
                >
                  <option value="">Select state first</option>
                  {statesList.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col'>
                <label className='text-sm text-gray-600'>Main Pickup City *</label>
                <select
                  onChange={e=> {
                    const selectedCity = e.target.value;
                    setCar({...car, location: selectedCity, address: {...car.address, city: selectedCity}})
                  }}
                  value={car.location}
                  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                  required
                  disabled={!car.address.state}
                >
                  <option value="">
                    {car.address.state ? 'Select pickup city' : 'Select state first'}
                  </option>
                  {car.address.state && stateCityMapping[car.address.state] &&
                    stateCityMapping[car.address.state].map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))
                  }
                </select>
                {!car.address.state && (
                  <p className='text-xs text-gray-500 mt-1'>Please select a state first to see available cities</p>
                )}
              </div>
            </div>

            {/* Detailed Address */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col'>
                <label className='text-sm text-gray-600'>Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Main Street, Area Name"
                  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                  value={car.address.street}
                  onChange={e=> setCar({...car, address: {...car.address, street: e.target.value}})}
                />
              </div>

              <div className='flex flex-col'>
                <label className='text-sm text-gray-600'>ZIP Code</label>
                <input
                  type="text"
                  placeholder="e.g. 110001"
                  className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                  value={car.address.zipCode}
                  onChange={e=> setCar({...car, address: {...car.address, zipCode: e.target.value}})}
                />
              </div>
            </div>

            <div className='flex flex-col mt-4'>
              <label className='text-sm text-gray-600'>Landmark (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Near Metro Station, Shopping Mall"
                className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
                value={car.address.landmark}
                onChange={e=> setCar({...car, address: {...car.address, landmark: e.target.value}})}
              />
            </div>
         </div>
        {/* Car Description */}
         <div className='flex flex-col w-full'>
            <label>Description</label>
            <textarea rows={5} placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine." required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e=> setCar({...car, description: e.target.value})}></textarea>
          </div>

        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>


      </form>

    </div>
  )
}

export default AddCar
