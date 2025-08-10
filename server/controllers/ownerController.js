import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";


// API to Change Role of User
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Car

export const addCar = async (req, res)=>{
    try {
        const {_id} = req.user;

        // Validate car data exists
        if (!req.body.carData) {
            return res.json({success: false, message: "Car details are missing. Please fill all required fields."})
        }

        let car;
        try {
            car = JSON.parse(req.body.carData);
        } catch (parseError) {
            return res.json({success: false, message: "Invalid car data format. Please refresh the page and try again."})
        }

        // Validate image file
        const imageFile = req.file;
        if (!imageFile) {
            return res.json({success: false, message: "Car image is required. Please upload an image of your car."})
        }

        // Validate file size (5MB limit)
        if (imageFile.size > 5 * 1024 * 1024) {
            return res.json({success: false, message: "Image size is too large. Please upload an image smaller than 5MB."})
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(imageFile.mimetype)) {
            return res.json({success: false, message: "Invalid image format. Please upload JPEG, PNG, or WebP images only."})
        }

        // Validate required car fields
        const requiredFields = ['brand', 'model', 'year', 'pricePerDay', 'category', 'transmission', 'fuel_type', 'seating_capacity', 'location', 'description'];
        const missingFields = requiredFields.filter(field => !car[field] || car[field].toString().trim() === '');

        if (missingFields.length > 0) {
            const fieldNames = {
                'brand': 'Car Brand',
                'model': 'Car Model',
                'year': 'Model Year',
                'pricePerDay': 'Daily Price',
                'category': 'Car Category',
                'transmission': 'Transmission Type',
                'fuel_type': 'Fuel Type',
                'seating_capacity': 'Seating Capacity',
                'location': 'Pickup Location',
                'description': 'Car Description'
            };
            const missingFieldNames = missingFields.map(field => fieldNames[field] || field).join(', ');
            return res.json({success: false, message: `Please fill in these required fields: ${missingFieldNames}`})
        }

        // Validate address if provided
        if (car.address && (!car.address.state || !car.location)) {
            return res.json({success: false, message: "Please select both state and city for pickup location."})
        }

        // Validate numeric fields
        if (car.year && (isNaN(car.year) || car.year < 1900 || car.year > new Date().getFullYear() + 1)) {
            return res.json({success: false, message: "Please enter a valid model year between 1900 and next year."})
        }

        if (car.pricePerDay && (isNaN(car.pricePerDay) || car.pricePerDay <= 0)) {
            return res.json({success: false, message: "Daily price must be a valid number greater than 0."})
        }

        if (car.seating_capacity && (isNaN(car.seating_capacity) || car.seating_capacity < 1 || car.seating_capacity > 50)) {
            return res.json({success: false, message: "Seating capacity must be a number between 1 and 50."})
        }

        // Upload Image to ImageKit
        let fileBuffer, response, optimizedImageUrl;
        try {
            fileBuffer = fs.readFileSync(imageFile.path);
            response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: '/cars'
            });

            // optimization through imagekit URL transformation
            optimizedImageUrl = imagekit.url({
                path : response.filePath,
                transformation : [
                    {width: '1280'}, // Width resizing
                    {quality: 'auto'}, // Auto compression
                    { format: 'webp' }  // Convert to modern format
                ]
            });
        } catch (uploadError) {
            console.log('Image upload error:', uploadError.message);
            return res.json({success: false, message: "Failed to upload car image. Please try again with a different image."})
        }

        // Create car in database
        try {
            const image = optimizedImageUrl;
            await Car.create({...car, owner: _id, image})
            res.json({success: true, message: "Car added successfully! You can now manage it from your dashboard."})
        } catch (dbError) {
            console.log('Database error:', dbError.message);
            if (dbError.name === 'ValidationError') {
                const errors = Object.values(dbError.errors).map(err => err.message).join(', ');
                return res.json({success: false, message: `Validation failed: ${errors}`})
            }
            return res.json({success: false, message: "Failed to save car details. Please check your information and try again."})
        }

    } catch (error) {
        console.log('Unexpected error:', error.message);
        res.json({success: false, message: "An unexpected error occurred. Please try again or contact support if the problem persists."})
    }
}

// API to List Owner Cars
export const getOwnerCars = async (req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id })
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvaliable = !car.isAvaliable;
        await car.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to edit a car
export const editCar = async (req, res) => {
    try {
        const {_id} = req.user;

        // Validate car data exists
        if (!req.body.carData) {
            return res.json({success: false, message: "Car details are missing. Please fill all required fields."})
        }

        if (!req.body.carId) {
            return res.json({success: false, message: "Car ID is required to update the car."})
        }

        let car;
        try {
            car = JSON.parse(req.body.carData);
        } catch (parseError) {
            return res.json({success: false, message: "Invalid car data format. Please refresh the page and try again."})
        }

        // Find the car and check ownership
        const existingCar = await Car.findById(req.body.carId);
        if (!existingCar) {
            return res.json({success: false, message: "Car not found."})
        }

        if (existingCar.owner.toString() !== _id.toString()) {
            return res.json({success: false, message: "You can only edit your own cars."})
        }

        // Validate required car fields
        const requiredFields = ['brand', 'model', 'year', 'pricePerDay', 'category', 'transmission', 'fuel_type', 'seating_capacity', 'location', 'description'];
        const missingFields = requiredFields.filter(field => !car[field] || car[field].toString().trim() === '');

        if (missingFields.length > 0) {
            const fieldNames = {
                'brand': 'Car Brand',
                'model': 'Car Model',
                'year': 'Model Year',
                'pricePerDay': 'Daily Price',
                'category': 'Car Category',
                'transmission': 'Transmission Type',
                'fuel_type': 'Fuel Type',
                'seating_capacity': 'Seating Capacity',
                'location': 'Pickup Location',
                'description': 'Car Description'
            };
            const missingFieldNames = missingFields.map(field => fieldNames[field] || field).join(', ');
            return res.json({success: false, message: `Please fill in these required fields: ${missingFieldNames}`})
        }

        // Validate address if provided
        if (car.address && (!car.address.state || !car.location)) {
            return res.json({success: false, message: "Please select both state and city for pickup location."})
        }

        // Validate numeric fields
        if (car.year && (isNaN(car.year) || car.year < 1900 || car.year > new Date().getFullYear() + 1)) {
            return res.json({success: false, message: "Please enter a valid model year between 1900 and next year."})
        }

        if (car.pricePerDay && (isNaN(car.pricePerDay) || car.pricePerDay <= 0)) {
            return res.json({success: false, message: "Daily price must be a valid number greater than 0."})
        }

        if (car.seating_capacity && (isNaN(car.seating_capacity) || car.seating_capacity < 1 || car.seating_capacity > 50)) {
            return res.json({success: false, message: "Seating capacity must be a number between 1 and 50."})
        }

        // Handle image upload if new image is provided
        let updatedImage = existingCar.image; // Keep existing image by default
        const imageFile = req.file;

        if (imageFile) {
            // Validate file size (5MB limit)
            if (imageFile.size > 5 * 1024 * 1024) {
                return res.json({success: false, message: "Image size is too large. Please upload an image smaller than 5MB."})
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(imageFile.mimetype)) {
                return res.json({success: false, message: "Invalid image format. Please upload JPEG, PNG, or WebP images only."})
            }

            try {
                // Upload new image to ImageKit
                const fileBuffer = fs.readFileSync(imageFile.path);
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: imageFile.originalname,
                    folder: '/cars'
                });

                // Optimization through imagekit URL transformation
                updatedImage = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        {width: '1280'}, // Width resizing
                        {quality: 'auto'}, // Auto compression
                        { format: 'webp' }  // Convert to modern format
                    ]
                });
            } catch (uploadError) {
                console.log('Image upload error:', uploadError.message);
                return res.json({success: false, message: "Failed to upload car image. Please try again with a different image."})
            }
        }

        // Update car in database
        try {
            await Car.findByIdAndUpdate(req.body.carId, {
                ...car,
                image: updatedImage,
                owner: _id // Ensure owner doesn't change
            });

            res.json({success: true, message: "Car updated successfully!"})
        } catch (dbError) {
            console.log('Database error:', dbError.message);
            if (dbError.name === 'ValidationError') {
                const errors = Object.values(dbError.errors).map(err => err.message).join(', ');
                return res.json({success: false, message: `Validation failed: ${errors}`})
            }
            return res.json({success: false, message: "Failed to update car details. Please check your information and try again."})
        }

    } catch (error) {
        console.log('Unexpected error:', error.message);
        res.json({success: false, message: "An unexpected error occurred. Please try again or contact support if the problem persists."})
    }
}

// Api to delete a car
export const deleteCar = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.owner = null;
        car.isAvaliable = false;

        await car.save()

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({owner: _id, status: "pending" })
        const completedBookings = await Booking.find({owner: _id, status: "confirmed" })

        // Calculate monthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image

export const updateUserImage = async (req, res)=>{
    try {
        const { _id } = req.user;

        const imageFile = req.file;

        if (!imageFile) {
            return res.json({success: false, message: "Please select an image to upload."})
        }

        // Validate file size (5MB limit)
        if (imageFile.size > 5 * 1024 * 1024) {
            return res.json({success: false, message: "Image size is too large. Please upload an image smaller than 5MB."})
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(imageFile.mimetype)) {
            return res.json({success: false, message: "Invalid image format. Please upload JPEG, PNG, or WebP images only."})
        }

        try {
            // Upload Image to ImageKit
            const fileBuffer = fs.readFileSync(imageFile.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imageFile.originalname,
                folder: '/users'
            })

            // optimization through imagekit URL transformation
            var optimizedImageUrl = imagekit.url({
                path : response.filePath,
                transformation : [
                    {width: '400'}, // Width resizing
                    {quality: 'auto'}, // Auto compression
                    { format: 'webp' }  // Convert to modern format
                ]
            });

            const image = optimizedImageUrl;

            await User.findByIdAndUpdate(_id, {image});
            res.json({success: true, message: "Profile image updated successfully!" })
        } catch (uploadError) {
            console.log('Image upload error:', uploadError.message);
            res.json({success: false, message: "Failed to upload image. Please try again with a different image."})
        }

    } catch (error) {
        console.log('Unexpected error:', error.message);
        res.json({success: false, message: "An unexpected error occurred. Please try again."})
    }
}
