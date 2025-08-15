import toast from 'react-hot-toast';

/**
 * Handles API errors and displays user-friendly messages
 * @param {Error} error - The error object from API call
 * @param {string} defaultMessage - Default message to show if no specific error is identified
 * @param {Object} options - Additional options for error handling
 * @param {boolean} options.logError - Whether to log the error to console (default: true)
 */
export const handleApiError = (error, defaultMessage = 'An unexpected error occurred. Please try again.', options = {}) => {
  const { logError = true } = options;
  
  if (logError) {
    console.error('API Error:', error);
  }

  // If server provided a specific error message, use it
  if (error.response?.data?.message) {
    toast.error(error.response.data.message);
    return;
  }

  // Handle specific HTTP status codes
  switch (error.response?.status) {
    case 400:
      toast.error('Invalid request. Please check your input and try again.');
      break;
    case 401:
      toast.error('Please log in to continue.');
      break;
    case 403:
      toast.error('You do not have permission to perform this action.');
      break;
    case 404:
      toast.error('The requested resource was not found.');
      break;
    case 413:
      toast.error('File size is too large. Please upload a smaller file.');
      break;
    case 429:
      toast.error('Too many requests. Please wait a moment and try again.');
      break;
    case 500:
      toast.error('Server error. Please try again later or contact support.');
      break;
    case 503:
      toast.error('Service temporarily unavailable. Please try again later.');
      break;
    default:
      // Handle network errors and other cases
      if (error.message?.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else {
        toast.error(defaultMessage);
      }
  }
};

/**
 * Validates form fields and shows user-friendly error messages
 * @param {Object} formData - The form data to validate
 * @param {Array} requiredFields - Array of required field objects with name and label
 * @returns {boolean} - True if validation passes, false otherwise
 */
export const validateFormFields = (formData, requiredFields) => {
  for (const field of requiredFields) {
    const value = formData[field.name];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      toast.error(`${field.label} is required`);
      return false;
    }
  }
  return true;
};

/**
 * Validates image file with user-friendly error messages
 * @param {File} file - The image file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSize - Maximum file size in bytes (default: 5MB)
 * @param {Array} options.allowedTypes - Allowed MIME types
 * @returns {boolean} - True if validation passes, false otherwise
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  } = options;

  if (!file) {
    toast.error('Please select an image file');
    return false;
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    toast.error(`Image size must be less than ${maxSizeMB}MB`);
    return false;
  }

  // Get file extension
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

  // Check both MIME type and file extension for better validation
  const isValidMimeType = allowedTypes.includes(file.type);
  const isValidExtension = allowedExtensions.includes(fileExtension);

  if (!isValidMimeType && !isValidExtension) {
    toast.error(`Please upload a valid image file (JPEG, PNG, or WebP). Detected type: ${file.type}, extension: ${fileExtension}`);
    return false;
  }

  // If MIME type is missing but extension is valid, proceed with warning
  if (!isValidMimeType && isValidExtension) {
    console.log('Warning: MIME type not detected correctly, but file extension is valid');
  }

  return true;
};

/**
 * Validates numeric fields with user-friendly error messages
 * @param {Object} data - Object containing numeric fields to validate
 * @param {Array} numericFields - Array of field objects with name, label, min, max
 * @returns {boolean} - True if validation passes, false otherwise
 */
export const validateNumericFields = (data, numericFields) => {
  for (const field of numericFields) {
    const value = data[field.name];
    
    if (value !== undefined && value !== '') {
      const numValue = Number(value);
      
      if (isNaN(numValue)) {
        toast.error(`${field.label} must be a valid number`);
        return false;
      }
      
      if (field.min !== undefined && numValue < field.min) {
        toast.error(`${field.label} must be at least ${field.min}`);
        return false;
      }
      
      if (field.max !== undefined && numValue > field.max) {
        toast.error(`${field.label} must be at most ${field.max}`);
        return false;
      }
    }
  }
  return true;
};
