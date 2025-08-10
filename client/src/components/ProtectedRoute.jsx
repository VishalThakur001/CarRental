import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { user, isOwner, showLoginWithRedirect, token } = useAppContext()

  useEffect(() => {
    // If no token, show login immediately
    if (!token) {
      toast.error('Please login to access this page')
      showLoginWithRedirect()
      return
    }

    // If token exists but no user data loaded yet, wait
    if (token && !user) {
      return
    }

    // If user is required but not logged in
    if (!user) {
      toast.error('Please login to access this page')
      showLoginWithRedirect()
      return
    }

    // If owner access is required but user is not an owner
    if (requireOwner && !isOwner) {
      toast.error('Owner access required for this page')
      showLoginWithRedirect()
      return
    }
  }, [user, isOwner, showLoginWithRedirect, token, requireOwner])

  // Show loading while token exists but user data is being fetched
  if (token && !user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render children if authentication requirements not met
  if (!user || (requireOwner && !isOwner)) {
    return null
  }

  // Render children if all authentication checks pass
  return children
}

export default ProtectedRoute
