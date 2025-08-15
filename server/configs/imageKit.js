import ImageKit from "imagekit";

let imagekit = null;

try {
    if (process.env.IMAGEKIT_PUBLIC_KEY &&
        process.env.IMAGEKIT_PRIVATE_KEY &&
        process.env.IMAGEKIT_URL_ENDPOINT &&
        process.env.IMAGEKIT_PUBLIC_KEY !== 'placeholder') {

        imagekit = new ImageKit({
            publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
        });
    } else {
        console.log("ImageKit configuration not found - image upload features will be disabled");
    }
} catch (error) {
    console.log("ImageKit initialization failed:", error.message);
}

export default imagekit;
