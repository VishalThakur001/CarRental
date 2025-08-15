import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext()

  const [analyticsData, setAnalyticsData] = useState({
    monthlyEarnings: {},
    yearlyEarnings: {},
    revenuePerCar: [],
    mostRentedCars: [],
    occupancyRates: [],
    totalRevenue: 0,
    totalBookings: 0
  })

  const [filters, setFilters] = useState({
    dateRange: 'month', // month, year, custom
    startDate: '',
    endDate: '',
    carType: 'all'
  })

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  })

  const [loading, setLoading] = useState(true)

  // Chart colors
  const chartColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ]

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/owner/analytics', {
        params: filters
      })
      
      if (data.success) {
        setAnalyticsData(data.analyticsData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to load analytics data. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOwner) {
      fetchAnalyticsData()
    }
  }, [isOwner, filters])

  // Sort table data
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortedData = (data, key) => {
    if (!sortConfig.key) return data
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  // Generate chart for monthly earnings
  const renderMonthlyChart = () => {
    const months = Object.keys(analyticsData.monthlyEarnings || {}).sort()
    const maxEarning = Math.max(...Object.values(analyticsData.monthlyEarnings || {})) || 1

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Earnings</h3>
        <div className="flex items-end justify-between h-64 gap-2 px-4">
          {months.length > 0 ? months.map((month, index) => {
            const earning = analyticsData.monthlyEarnings[month]
            const height = Math.max((earning / maxEarning) * 200, 4) // Minimum height of 4px
            const monthName = new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' })

            return (
              <div key={month} className="flex flex-col items-center group relative flex-1">
                <div className="relative w-full max-w-12">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-all duration-200 rounded-t-sm cursor-pointer"
                    style={{ height: `${height}px` }}
                  />
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {currency}{earning.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs mt-3 text-gray-600 font-medium">{monthName}</span>
              </div>
            )
          }) : (
            <div className="w-full h-32 flex flex-col items-center justify-center text-gray-500">
              <div className="w-16 h-16 mb-3 opacity-30">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <p className="text-sm">No earnings data available</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render occupancy rate chart
  const renderOccupancyChart = () => {
    const maxRate = Math.max(...analyticsData.occupancyRates.map(car => car.occupancyRate), 1)

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Car Occupancy Rates</h3>
        <div className="space-y-4">
          {analyticsData.occupancyRates.length > 0 ? analyticsData.occupancyRates.map((car, index) => (
            <div key={car._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={car.image || '/api/placeholder/48/32'}
                  alt={`${car.brand} ${car.model}`}
                  className="w-12 h-8 object-cover rounded border border-gray-200"
                />
                <div className="min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate block">
                    {car.brand} {car.model}
                  </span>
                  <span className="text-xs text-gray-500">
                    {car.bookedDays} of {car.totalDays} days
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      car.occupancyRate >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      car.occupancyRate >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${car.occupancyRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-12 text-gray-700">{car.occupancyRate}%</span>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 opacity-30 text-gray-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <p className="text-sm text-gray-500">No occupancy data available</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render pie chart for most rented cars
  const renderMostRentedChart = () => {
    const total = analyticsData.mostRentedCars.reduce((sum, car) => sum + car.rentals, 0)

    if (total === 0) {
      return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Most Rented Cars</h3>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 opacity-30 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
            <p className="text-sm text-gray-500">No rental data available</p>
          </div>
        </div>
      )
    }

    let currentAngle = 0

    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Most Rented Cars</h3>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 42 42" className="w-32 h-32 transform -rotate-90">
              <circle
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke="#f3f4f6"
                strokeWidth="3"
              />
              {analyticsData.mostRentedCars.map((car, index) => {
                const percentage = (car.rentals / total) * 100
                const strokeDasharray = `${percentage} ${100 - percentage}`
                const strokeDashoffset = -currentAngle
                currentAngle += percentage

                return (
                  <circle
                    key={car._id}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={chartColors[index % chartColors.length]}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300"
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {analyticsData.mostRentedCars.map((car, index) => (
              <div key={car._id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: chartColors[index % chartColors.length] }}
                />
                <span className="text-sm flex-1 font-medium text-gray-800 truncate">
                  {car.brand} {car.model}
                </span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-800">{car.percentage}%</div>
                  <div className="text-xs text-gray-500">{car.rentals} rentals</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='px-4 pt-6 sm:pt-8 lg:pt-10 md:px-6 lg:px-10 flex-1'>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className='px-4 pt-6 sm:pt-8 lg:pt-10 md:px-6 lg:px-10 flex-1'>
      <Title 
        title="Dashboard" 
        subTitle="Track your rental business performance with detailed insights and metrics"
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {filters.dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
            <select
              value={filters.carType}
              onChange={(e) => setFilters(prev => ({ ...prev, carType: e.target.value }))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Cars</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Coupe">Coupe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700">{currency}{analyticsData.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-700">{analyticsData.totalBookings}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <img src={assets.carIconColored} alt="" className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg. Daily Rate</p>
              <p className="text-2xl font-bold text-purple-700">
                {currency}{analyticsData.totalBookings > 0 ? Math.round(analyticsData.totalRevenue / analyticsData.totalBookings).toLocaleString() : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Active Cars</p>
              <p className="text-2xl font-bold text-orange-700">{analyticsData.revenuePerCar.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <img src={assets.dashboardIconColored} alt="" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {renderMonthlyChart()}
        {analyticsData.mostRentedCars.length > 0 && renderMostRentedChart()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        {analyticsData.occupancyRates.length > 0 && renderOccupancyChart()}
      </div>

      {/* Revenue per Car Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-semibold text-gray-800">Revenue per Car</h3>
          <p className="text-sm text-gray-600">Detailed breakdown of earnings by vehicle</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Car Details
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort('totalRevenue')}
                >
                  <div className="flex items-center gap-1">
                    Revenue
                    {sortConfig.key === 'totalRevenue' && (
                      <span className="text-blue-500">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort('totalBookings')}
                >
                  <div className="flex items-center gap-1">
                    Bookings
                    {sortConfig.key === 'totalBookings' && (
                      <span className="text-blue-500">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort('averageRate')}
                >
                  <div className="flex items-center gap-1">
                    Avg. Rate
                    {sortConfig.key === 'averageRate' && (
                      <span className="text-blue-500">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {getSortedData(analyticsData.revenuePerCar, sortConfig.key).map((car, index) => (
                <tr key={car._id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={car.image || '/api/placeholder/48/32'}
                        alt={`${car.brand} ${car.model}`}
                        className="w-12 h-8 object-cover rounded border border-gray-200 mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {car.brand} {car.model}
                        </div>
                        <div className="text-sm text-gray-500">{car.year} • {car.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {currency}{car.totalRevenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{car.totalBookings}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {currency}{car.averageRate.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      car.isAvailable
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {car.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {analyticsData.revenuePerCar.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 opacity-30 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No revenue data available for the selected period</p>
            <p className="text-gray-400 text-xs mt-1">Start renting out your cars to see analytics here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
