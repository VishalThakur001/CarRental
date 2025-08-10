import React, { useEffect, useState } from 'react'
import { assets} from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import ConfirmationModal from '../../components/ConfirmationModal'
import EditCarModal from '../../components/EditCarModal'
import toast from 'react-hot-toast'

const ManageCars = () => {

  const {isOwner, axios, currency} = useAppContext()

  const [cars, setCars] = useState([])
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', carId: '', carName: '' })
  const [editModal, setEditModal] = useState({ isOpen: false, carData: null })
  const [isLoading, setIsLoading] = useState(false)

  const fetchOwnerCars = async ()=>{
    try {
      const {data} = await axios.get('/api/owner/cars')
      if(data.success){
        setCars(data.cars)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error loading cars:', error)
      if (error.response?.status === 401) {
        toast.error('Please log in to view your cars.')
      } else if (error.message.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection and refresh the page.')
      } else {
        toast.error('Failed to load your cars. Please refresh the page or contact support if the problem persists.')
      }
    }
  }

  const handleToggleAvailability = (car) => {
    setConfirmModal({
      isOpen: true,
      type: 'visibility',
      carId: car._id,
      carName: `${car.brand} ${car.model}`,
      isCurrentlyAvailable: car.isAvaliable
    })
  }

  const toggleAvailability = async (carId)=>{
    try {
      setIsLoading(true)
      const {data} = await axios.post('/api/owner/toggle-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
        setConfirmModal({ isOpen: false, type: '', carId: '', carName: '' })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error updating car availability:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.status === 401) {
        toast.error('Please log in to update car availability.')
      } else if (error.message.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection.')
      } else {
        toast.error('Failed to update car availability. Please try again or contact support if the problem persists.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCar = (car) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      carId: car._id,
      carName: `${car.brand} ${car.model}`
    })
  }

  const deleteCar = async (carId)=>{
    try {
      setIsLoading(true)
      const {data} = await axios.post('/api/owner/delete-car', {carId})
      if(data.success){
        toast.success(data.message)
        fetchOwnerCars()
        setConfirmModal({ isOpen: false, type: '', carId: '', carName: '' })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error deleting car:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.status === 401) {
        toast.error('Please log in to delete cars.')
      } else if (error.response?.status === 403) {
        toast.error('You can only delete your own cars.')
      } else if (error.message.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection.')
      } else {
        toast.error('Failed to delete car. Please try again or contact support if the problem persists.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCar = (car) => {
    setEditModal({ isOpen: true, carData: car })
  }

  const handleCarUpdated = () => {
    fetchOwnerCars()
    setEditModal({ isOpen: false, carData: null })
  }

  useEffect(()=>{
    isOwner && fetchOwnerCars()
  },[isOwner])

  return (
    <div className='px-4 pt-6 sm:pt-8 lg:pt-10 md:px-6 lg:px-10 w-full'>
      
      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform."/>

      <div className='max-w-6xl w-full rounded-lg overflow-hidden border border-borderColor mt-6 bg-white shadow-sm'>

        <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm text-gray-600 min-w-[600px]'>
          <thead className='text-gray-500 bg-gray-50'>
            <tr>
              <th className="p-3 sm:p-4 font-medium text-xs sm:text-sm">Car</th>
              <th className="p-3 sm:p-4 font-medium text-xs sm:text-sm max-md:hidden">Category</th>
              <th className="p-3 sm:p-4 font-medium text-xs sm:text-sm">Price</th>
              <th className="p-3 sm:p-4 font-medium text-xs sm:text-sm max-md:hidden">Status</th>
              <th className="p-3 sm:p-4 font-medium text-xs sm:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index)=>(
              <tr key={index} className='border-t border-borderColor hover:bg-gray-50 transition-colors'>

                <td className='p-3 sm:p-4'>
                  <div className='flex items-center gap-3'>
                    <img src={car.image} alt="" className="h-10 w-10 sm:h-12 sm:w-12 aspect-square rounded-md object-cover flex-shrink-0"/>
                    <div className='min-w-0 flex-1'>
                      <p className='font-medium text-xs sm:text-sm truncate'>{car.brand} {car.model}</p>
                      <p className='text-xs text-gray-500 hidden sm:block'>{car.seating_capacity} seats • {car.transmission}</p>
                      <p className='text-xs text-gray-400 hidden sm:block truncate'>
                        📍 {car.address?.city ? `${car.address.city}, ${car.address.state}` : car.location}
                      </p>
                    </div>
                  </div>
                </td>

                <td className='p-3 sm:p-4 max-md:hidden text-xs sm:text-sm'>{car.category}</td>
                <td className='p-3 sm:p-4 text-xs sm:text-sm font-medium'>{currency}{car.pricePerDay}/day</td>

                <td className='p-3 sm:p-4 max-md:hidden'>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${car.isAvaliable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {car.isAvaliable ? "Available" : "Unavailable" }
                  </span>
                </td>

                <td className='p-3 sm:p-4'>
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <button
                      onClick={()=> handleEditCar(car)}
                      className='p-2 sm:p-3 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 bg-blue-25'
                      title='Edit car'
                    >
                      <img src={assets.edit_icon} alt="Edit" className='w-5 h-5 sm:w-6 sm:h-6'/>
                    </button>
                    <button
                      onClick={()=> handleToggleAvailability(car)}
                      className='p-2 sm:p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-gray-25'
                      title={car.isAvaliable ? 'Hide car' : 'Show car'}
                    >
                      <img src={car.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="Toggle visibility" className='w-5 h-5 sm:w-6 sm:h-6'/>
                    </button>
                    <button
                      onClick={()=> handleDeleteCar(car)}
                      className='p-2 sm:p-3 hover:bg-red-50 rounded-lg transition-colors border border-red-200 bg-red-25'
                      title='Delete car'
                    >
                      <img src={assets.delete_icon} alt="Delete" className='w-5 h-5 sm:w-6 sm:h-6'/>
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        </div>

      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'delete'}
        onClose={() => setConfirmModal({ isOpen: false, type: '', carId: '', carName: '' })}
        onConfirm={() => deleteCar(confirmModal.carId)}
        title="Delete Car?"
        message={`Are you sure you want to delete "${confirmModal.carName}"? This action cannot be undone and will permanently remove the car from your listings.`}
        confirmText="Delete Car"
        cancelText="Cancel"
        type="danger"
        isLoading={isLoading}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'visibility'}
        onClose={() => setConfirmModal({ isOpen: false, type: '', carId: '', carName: '' })}
        onConfirm={() => toggleAvailability(confirmModal.carId)}
        title={`${confirmModal.isCurrentlyAvailable ? 'Hide' : 'Show'} Car?`}
        message={`Are you sure you want to ${confirmModal.isCurrentlyAvailable ? 'hide' : 'show'} "${confirmModal.carName}"? This will ${confirmModal.isCurrentlyAvailable ? 'make it unavailable for bookings' : 'make it available for bookings'}.`}
        confirmText={confirmModal.isCurrentlyAvailable ? 'Hide Car' : 'Show Car'}
        cancelText="Cancel"
        type="warning"
        isLoading={isLoading}
      />

      {/* Edit Car Modal */}
      <EditCarModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, carData: null })}
        carData={editModal.carData}
        onCarUpdated={handleCarUpdated}
      />

    </div>
  )
}

export default ManageCars
