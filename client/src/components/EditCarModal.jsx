import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { stateCityMapping, statesList } from '../data/stateCityMapping';
import toast from 'react-hot-toast';
import { validateImageFile } from '../utils/errorHandling';

const EditCarModal = ({ isOpen, onClose, carData, onCarUpdated }) => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
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
  });

  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with existing car data
  useEffect(() => {
    if (carData) {
      setCar({
        brand: carData.brand || '',
        model: carData.model || '',
        year: carData.year || '',
        pricePerDay: carData.pricePerDay || '',
        category: carData.category || '',
        transmission: carData.transmission || '',
        fuel_type: carData.fuel_type || '',
        seating_capacity: carData.seating_capacity || '',
        location: carData.location || '',
        address: {
          street: carData.address?.street || '',
          city: carData.address?.city || carData.location || '',
          state: carData.address?.state || '',
          zipCode: carData.address?.zipCode || '',
          landmark: carData.address?.landmark || ''
        },
        description: carData.description || '',
      });
      setImage(null); // Reset image on data change
    }
  }, [carData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Frontend validation with user-friendly messages
    if (!car.category) {
      toast.error('Please select a car category');
      return;
    }

    if (!car.transmission) {
      toast.error('Please select transmission type');
      return;
    }

    if (!car.fuel_type) {
      toast.error('Please select fuel type');
      return;
    }

    if (!car.location || !car.address.state) {
      toast.error('Please select both state and city for pickup location');
      return;
    }

    if (car.year && (car.year < 1900 || car.year > new Date().getFullYear() + 1)) {
      toast.error('Please enter a valid model year');
      return;
    }

    if (car.pricePerDay && car.pricePerDay <= 0) {
      toast.error('Daily price must be greater than 0');
      return;
    }

    if (car.seating_capacity && (car.seating_capacity < 1 || car.seating_capacity > 50)) {
      toast.error('Seating capacity must be between 1 and 50');
      return;
    }

    // Validate image file if uploading new one
    if (image && !validateImageFile(image)) {
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('carData', JSON.stringify(car));
      formData.append('carId', carData._id);

      const { data } = await axios.post('/api/owner/edit-car', formData);

      if (data.success) {
        toast.success(data.message);
        onCarUpdated();
        handleClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating car:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 413) {
        toast.error('Image file is too large. Please upload a smaller image.');
      } else if (error.response?.status === 400) {
        toast.error('Invalid car details. Please check all fields and try again.');
      } else if (error.response?.status === 401) {
        toast.error('You need to be logged in to update a car.');
      } else if (error.message.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error('Failed to update car. Please try again or contact support if the problem persists.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setImage(null);
    onClose();
  };

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
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Edit Car Details</h2>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <img src={assets.close_icon} alt="Close" className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Current Image & Upload */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    {/* Current image */}
                    <img 
                      src={carData?.image} 
                      alt="Current car" 
                      className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200"
                    />
                    <span className="text-sm text-gray-500">Current Image</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label htmlFor="car-image" className="cursor-pointer">
                      <img 
                        src={image ? URL.createObjectURL(image) : assets.upload_icon} 
                        alt="" 
                        className="h-16 w-16 rounded-lg object-cover border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
                      />
                      <input
                        type="file"
                        id="car-image"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        hidden
                        onChange={e => setImage(e.target.files[0])}
                      />
                    </label>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Upload New Image</p>
                      <p className="text-xs text-gray-500">Click to replace current image (Max 5MB, JPEG/PNG/WebP)</p>
                    </div>
                  </div>
                </div>

                {/* Car Brand & Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input 
                      type="text" 
                      placeholder="e.g. BMW, Mercedes, Audi..." 
                      required 
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary" 
                      value={car.brand} 
                      onChange={e => setCar({...car, brand: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input 
                      type="text" 
                      placeholder="e.g. X5, E-Class, M4..." 
                      required 
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary" 
                      value={car.model} 
                      onChange={e => setCar({...car, model: e.target.value})}
                    />
                  </div>
                </div>

                {/* Car Year, Price, Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Model Year</label>
                    <input 
                      type="number" 
                      placeholder="2025" 
                      required 
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary" 
                      value={car.year} 
                      onChange={e => setCar({...car, year: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Daily Price ({currency})</label>
                    <input 
                      type="number" 
                      placeholder="100" 
                      required 
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary" 
                      value={car.pricePerDay} 
                      onChange={e => setCar({...car, pricePerDay: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      onChange={e => setCar({...car, category: e.target.value})} 
                      value={car.category} 
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                      required
                    >
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Transmission</label>
                    <select 
                      onChange={e => setCar({...car, transmission: e.target.value})} 
                      value={car.transmission} 
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select a transmission</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="Semi-Automatic">Semi-Automatic</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <select 
                      onChange={e => setCar({...car, fuel_type: e.target.value})} 
                      value={car.fuel_type} 
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                      required
                    >
                      <option value="">Select a fuel type</option>
                      <option value="Gas">Gas</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                    <input 
                      type="number" 
                      placeholder="4" 
                      required 
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary" 
                      value={car.seating_capacity} 
                      onChange={e => setCar({...car, seating_capacity: e.target.value})}
                    />
                  </div>
                </div>

                {/* Car Location & Address */}
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-2">Pickup Location & Address</label>

                  {/* State and City Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">State *</label>
                      <select
                        onChange={e => {
                          const selectedState = e.target.value;
                          setCar({
                            ...car,
                            address: {...car.address, state: selectedState, city: ''},
                            location: ''
                          });
                        }}
                        value={car.address.state}
                        className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                        required
                      >
                        <option value="">Select state first</option>
                        {statesList.map((state, index) => (
                          <option key={index} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">Main Pickup City *</label>
                      <select
                        onChange={e => {
                          const selectedCity = e.target.value;
                          setCar({...car, location: selectedCity, address: {...car.address, city: selectedCity}});
                        }}
                        value={car.location}
                        className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary"
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
                    </div>
                  </div>

                  {/* Detailed Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">Street Address</label>
                      <input
                        type="text"
                        placeholder="e.g. 123 Main Street, Area Name"
                        className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                        value={car.address.street}
                        onChange={e => setCar({...car, address: {...car.address, street: e.target.value}})}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 110001"
                        className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                        value={car.address.zipCode}
                        onChange={e => setCar({...car, address: {...car.address, zipCode: e.target.value}})}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col mt-4">
                    <label className="text-sm text-gray-600 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Metro Station, Shopping Mall"
                      className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary"
                      value={car.address.landmark}
                      onChange={e => setCar({...car, address: {...car.address, landmark: e.target.value}})}
                    />
                  </div>
                </div>

                {/* Car Description */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={4} 
                    placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine." 
                    required 
                    className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-primary resize-none" 
                    value={car.description} 
                    onChange={e => setCar({...car, description: e.target.value})}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dull transition-colors disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                  >
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    )}
                    {isLoading ? 'Updating...' : 'Update Car'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditCarModal;
