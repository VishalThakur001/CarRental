import logo from "./logo.svg";
import gmail_logo from "./gmail_logo.svg";
import facebook_logo from "./facebook_logo.svg";
import instagram_logo from "./instagram_logo.svg";
import twitter_logo from "./twitter_logo.svg";
import menu_icon from "./menu_icon.svg";
import search_icon from "./search_icon.svg"
import close_icon from "./close_icon.svg"
import users_icon from "./users_icon.svg"
import car_icon from "./car_icon.svg"
import location_icon from "./location_icon.svg"
import fuel_icon from "./fuel_icon.svg"
import addIcon from "./addIcon.svg"
import carIcon from "./carIcon.svg"
import carIconColored from "./carIconColored.svg"
import dashboardIcon from "./dashboardIcon.svg"
import dashboardIconColored from "./dashboardIconColored.svg"
import addIconColored from "./addIconColored.svg"
import listIcon from "./listIcon.svg"
import listIconColored from "./listIconColored.svg"
import cautionIconColored from "./cautionIconColored.svg"
import arrow_icon from "./arrow_icon.svg"
import star_icon from "./star_icon.svg"
import check_icon from "./check_icon.svg"
import tick_icon from "./tick_icon.svg"
import delete_icon from "./delete_icon.svg"
import eye_icon from "./eye_icon.svg"
import eye_close_icon from "./eye_close_icon.svg"
import filter_icon from "./filter_icon.svg"
import edit_icon from "./edit_icon.svg"
import calendar_icon_colored from "./calendar_icon_colored.svg"
import location_icon_colored from "./location_icon_colored.svg"
import testimonial_image_1 from "./testimonial_image_1.png"
import testimonial_image_2 from "./testimonial_image_2.png"
import main_car from "./main_car.png"
import banner_car_image from "./banner_car_image.png"
import user_profile from "./user_profile.png"
import upload_icon from "./upload_icon.svg"
import car_image1 from "./car_image1.png"
import car_image2 from "./car_image2.png"
import car_image3 from "./car_image3.png"
import car_image4 from "./car_image4.png"

export const cityList = [
  // Major Metropolitan Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',

  // State Capitals & Major Cities - North India
  'Jaipur', 'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly',
  'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Ghaziabad', 'Faridabad',
  'Gurgaon', 'Panipat', 'Ambala', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Yamunanagar',
  'Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali',
  'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Abohar', 'Malerkotla', 'Khanna',
  'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Firozpur',

  // Rajasthan
  'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Bharatpur',
  'Pali', 'Barmer', 'Sikar', 'Tonk', 'Kishangarh', 'Beawar', 'Hanumangarh',

  // Uttar Pradesh
  'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Allahabad', 'Bareilly', 'Aligarh',
  'Moradabad', 'Saharanpur', 'Gorakhpur', 'Firozabad', 'Jhansi', 'Muzaffarnagar',
  'Mathura', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Mau', 'Hapur', 'Etawah',
  'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli',
  'Orai', 'Sitapur', 'Bahraich', 'Modinagar', 'Unnao', 'Jaunpur', 'Lakhimpur',
  'Hathras', 'Banda', 'Pilibhit', 'Barabanki', 'Khurja', 'Gonda', 'Mainpuri',
  'Lalitpur', 'Etah', 'Deoria', 'Ujhani', 'Ghazipur', 'Sultanpur', 'Azamgarh',
  'Bijnor', 'Sahaswan', 'Basti', 'Chandausi', 'Akbarpur', 'Ballia', 'Tanda',
  'Greater Noida', 'Shikohabad', 'Shamli', 'Awagarh', 'Kasganj',

  // Madhya Pradesh
  'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna',
  'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind',
  'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh', 'Mandsaur',
  'Khargone', 'Neemuch', 'Pithampur', 'Narmadapuram', 'Itarsi', 'Sehore',
  'Morena', 'Betul', 'Seoni', 'Datia', 'Nagda', 'Dindori',

  // Gujarat
  'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar',
  'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar', 'Bharuch', 'Mehsana',
  'Bhuj', 'Porbandar', 'Palanpur', 'Valsad', 'Vapi', 'Gondal', 'Veraval', 'Godhra',
  'Patan', 'Kalol', 'Dahod', 'Botad', 'Amreli', 'Deesa', 'Jetpur',

  // Maharashtra
  'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Thane', 'Vasai-Virar', 'Amravati',
  'Navi Mumbai', 'Kolhapur', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur',
  'Parbhani', 'Ichalkaranji', 'Jalgaon', 'Bhusawal', 'Panvel', 'Badlapur', 'Beed',
  'Gondia', 'Satara', 'Barshi', 'Yavatmal', 'Achalpur', 'Osmanabad', 'Nandurbar',
  'Wardha', 'Udgir', 'Hinganghat',

  // West Bengal
  'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'English Bazar',
  'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian',
  'Ranaghat', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur',
  'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Chakdaha', 'Darjeeling',
  'Alipurduar', 'Purulia', 'Jangipur', 'Bolpur', 'Bangaon', 'Cooch Behar',

  // South India - Tamil Nadu
  'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode',
  'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi',
  'Karur', 'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumarakonam',
  'Pudukkottai', 'Ambur', 'Nagapattinam', 'Rajapalayam', 'Puduchcherry',
  'Neyveli', 'Tiruvannamalai', 'Pollachi', 'Ramanathapuram', 'Udumalaipettai',
  'Gobichettipalayam', 'Thiruvallur', 'Vaniyambadi', 'Theni', 'Villupuram',
  'Gingee', 'Aruppukkottai', 'Mettupalayam', 'Lalgudi', 'Sankarankovil',
  'Tenkasi', 'Palani', 'Virudhachalam', 'Paramakudi', 'Arcot', 'Bodi',
  'Palladam', 'Sivaganga', 'Tindivanam', 'Virudhunagar', 'Karaikudi', 'Tiruvethipuram',

  // Karnataka
  'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere',
  'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet',
  'Hassan', 'Gadag-Betigeri', 'Udupi', 'Bhadravati', 'Chitradurga', 'Kolar',
  'Mandya', 'Chikmagalur', 'Gangavati', 'Bagalkot', 'Ranebennuru', 'Robertsonpet',
  'Karwar', 'Dandeli', 'Sirsi', 'Puttur', 'Bhatkal',

  // Andhra Pradesh & Telangana
  'Vijayawada', 'Visakhapatnam', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry',
  'Tirupati', 'Kakinada', 'Eluru', 'Anantapur', 'Chittoor', 'Machilipatnam',
  'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar', 'Medak',
  'Miryalaguda', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet', 'Jagtial',
  'Mancherial', 'Gadwal', 'Wanaparthy', 'Narayanpet', 'Sangareddy', 'Medchal',
  'Vikarabad', 'Rajam', 'Bobbili', 'Narasaraopet', 'Giddalur', 'Jammalamadugu',
  'Peddapuram', 'Repalle', 'Srikalahasti', 'Venkatagiri', 'Rayachoti',
  'Jaggaiahpet', 'Tuni', 'Amalapuram', 'Bhimavaram', 'Chirala', 'Addanki',
  'Narasapur', 'Kavali', 'Palacole', 'Kandukur', 'Sullurpeta', 'Tanuku',
  'Rayagada', 'Mandapeta', 'Jammu', 'Srinagar',

  // Kerala
  'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad',
  'Alappuzha', 'Malappuram', 'Kannur', 'Kasaragod', 'Kottayam', 'Pathanamthitta',
  'Idukki', 'Ernakulam', 'Wayanad', 'Manjeri', 'Thalassery', 'Ponnani',
  'Vatakara', 'Kanhangad', 'Payyanur', 'Koyilandy', 'Parappanangadi',
  'Kalamassery', 'Neyyattinkara', 'Kayamkulam', 'Nedumangad', 'Attingal',
  'Thrippunithura', 'Kodungallur', 'Pandalam', 'Thodupuzha', 'Aluva',
  'Cherthala', 'Changanassery', 'Muvattupuzha', 'Kothamangalam', 'Chalakudy',
  'Perinthalmanna', 'Paravoor', 'Pathanapuram', 'Peringathur', 'Ramavarma',
  'Angamaly', 'Perumbavoor', 'Ettumanoor', 'Mavelikkara', 'Karunagappally',
  'Eloor', 'Chavakkad', 'Kattappana', 'Mananthavady', 'Sulthan Bathery',
  'Vinodayathra', 'Guruvayoor', 'Beypore', 'Velur', 'Ottappalam', 'Tirur',
  'Kottakkal', 'Panoor', 'Nilambur', 'Mannarkkad', 'Edava', 'Shoranur',
  'Tanur', 'Kondotty', 'Tirurangadi', 'Feroke', 'Sankaramangalam', 'Kodakara',
  'Pattambi', 'Ramanattukara', 'Mannarakkat', 'Vadakara', 'Quilandi',
  'Mavoor', 'Balussery', 'Thaliparamba', 'Wayanad', 'Adoor', 'Ranni',
  'Kumily', 'Mundakayam', 'Kattakada', 'Varkala', 'Kazhakootam', 'Balaramapuram',
  'Nemom', 'Aroor', 'North Paravur', 'Vypin', 'Cherai', 'Kumbakonam',

  // Odisha
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri',
  'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Barbil',
  'Khordha', 'Rayagada', 'Koraput', 'Kendrapara', 'Jagatsinghpur', 'Paradip',
  'Bhawanipatna', 'Dhenkanal', 'Keonjhar', 'Sunabeda', 'Rajgangpur', 'Talcher',
  'Nabarangpur', 'Jatni', 'Chhatrapur', 'Berhampur', 'Mayurbhanj', 'Angul',
  'Bolangir', 'Subarnapur', 'Titlagarh', 'Malkangiri', 'Nuapada', 'Kalahandi',
  'Ganjam', 'Nayagarh', 'Gajapati', 'Kandhamal', 'Baudh', 'Deogarh',

  // Jharkhand
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh',
  'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda',

  // Chhattisgarh
  'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur',
  'Raigarh', 'Ambikapur', 'Mahasamund', 'Dhamtari', 'Chirmiri',

  // Bihar
  'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif',
  'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Saharsa',
  'Sasaram', 'Hajipur', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha',
  'Buxar', 'Kishanganj', 'Sitamarhi', 'Jamalpur', 'Jehanabad', 'Aurangabad',

  // Assam
  'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur',
  'Dhubri', 'North Lakhimpur', 'Karimganj', 'Sivasagar', 'Goalpara', 'Barpeta',
  'Diphu', 'Mangaldoi', 'Hailakandi', 'Morigaon', 'Hojai', 'Lanka', 'Lumding',
  'Mankachar', 'Nalbari', 'Rangia', 'Margherita', 'Kokrajhar', 'Hajo',
  'Marigaon', 'Bilasipara', 'Sarupathar', 'Lala', 'Abhayapuri', 'Jonai',
  'Algapur', 'Gauripur', 'Golaghat', 'Haflong', 'Howly', 'Lakhipur',
  'Lalmanirhat', 'Makum', 'Mariani', 'Mazbat', 'Nazira', 'Numaligarh',
  'Raha', 'Sibsagar', 'Sonari', 'Udalguri',

  // Northeast States
  'Imphal', 'Aizawl', 'Agartala', 'Itanagar', 'Kohima', 'Shillong', 'Gangtok',
  'Churachandpur', 'Bishnupur', 'Thoubal', 'Ukhrul', 'Senapati', 'Tamenglong',
  'Chandel', 'Jiribam', 'Kangpokpi', 'Kakching', 'Tengnoupal', 'Kamjong',
  'Noney', 'Pherzawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai',
  'Saitual', 'Khawzawl', 'Hnahthial', 'Udaipur', 'Kailashahar', 'Dharmanagar',
  'Ambassa', 'Belonia', 'Khowai', 'Teliamura', 'Sabroom', 'Sonamura',
  'Amarpur', 'Kumarghat', 'Ranirbazar', 'Melaghar', 'Jirania', 'Mohanpur',
  'Kamalpur', 'Bishramganj', 'Boxanagar', 'Panisagar', 'Pecharthal',
  'Longtharai Valley', 'Seppa', 'Yupia', 'Naharlagun', 'Pasighat', 'Along',
  'Bomdila', 'Ziro', 'Tawang', 'Khonsa', 'Tezu', 'Roing', 'Anini',
  'Yingkiong', 'Mechuka', 'Tato', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha',
  'Zunheboto', 'Phek', 'Kiphire', 'Longleng', 'Peren', 'Mon', 'Noklak',
  'Chumukedima', 'Dimapur', 'Tura', 'Jowai', 'Nongpoh', 'Baghmara', 'Williamnagar',
  'Resubelpara', 'Ampati', 'Dadengiri', 'Mendipathar', 'Khliehriat', 'Amlarem',
  'Mairang', 'Nongstoin', 'Mawkyrwat', 'Ranikor', 'Mawsynram', 'Cherrapunji',
  'Namchi', 'Geyzing', 'Mangan', 'Rangpo', 'Singtam', 'Jorethang', 'Nayabazar',
  'Gyalshing', 'Yuksom', 'Lachung', 'Lachen', 'Pelling', 'Ravangla',
  'Kalimpong', 'Pakyong',

  // Himachal Pradesh
  'Shimla', 'Mandi', 'Solan', 'Dharamshala', 'Kullu', 'Hamirpur', 'Una', 'Bilaspur',
  'Chamba', 'Kangra', 'Kinnaur', 'Lahaul and Spiti', 'Sirmaur', 'Palampur',
  'Nahan', 'Sundernagar', 'Dalhousie', 'Manali', 'Kasauli', 'Nalagarh',
  'Parwanoo', 'Baddi', 'Baijnath', 'Jogindernagar', 'Nurpur', 'Sujanpur',
  'Tira Sujanpur', 'Amb', 'Haroli', 'Nadaun', 'Barsar', 'Ghumarwin',
  'Baldwara', 'Sandhol', 'Sadar', 'Karsog', 'Joginder Nagar', 'Thunag',
  'Chachiot', 'Nachan', 'Kataula', 'Jhakri', 'Arki', 'Nankhari', 'Rajgarh',
  'Ramshahr', 'Rohru', 'Chopal', 'Jubbal', 'Kotkhai', 'Theog', 'Narkanda',
  'Kumarhatti', 'Dagshai', 'Subathu', 'Kandaghat', 'Chail', 'Kufri',
  'Tattapani', 'Seobagh', 'Pooh', 'Kalpa', 'Reckong Peo', 'Nichar',
  'Sangla', 'Chitkul', 'Spello', 'Keylong', 'Udaipur', 'Trilokinath',
  'Sissu', 'Koksar', 'Darcha', 'Pattan', 'Gemur', 'Tandi', 'Jahlman',
  'Khoksar', 'Losar', 'Kaza', 'Tabo', 'Dhankar', 'Mud', 'Pin Valley',
  'Langza', 'Komic', 'Hikkim', 'Kibber', 'Rangrik', 'Mane', 'Shichling',
  'Lari', 'Demul', 'Lhalung', 'Sagnam', 'Gulling', 'Hurling', 'Chicham',
  'Telangi', 'Bhaga', 'Chandra Tal', 'Suraj Tal', 'Baralacha La', 'Rohtang Pass',
  'Kunzum Pass', 'Pin Valley National Park',

  // Uttarakhand
  'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh',
  'Kotdwara', 'Ramnagar', 'Pithoragarh', 'Jaspur', 'Khatima', 'Manglaur',
  'Nainital', 'Almora', 'Mussoorie', 'Tehri', 'Pauri', 'Srinagar', 'Chamoli',
  'Bageshwar', 'Champawat', 'Rudraprayag', 'Uttarkashi',

  // Jammu and Kashmir & Ladakh
  'Jammu', 'Srinagar', 'Leh', 'Kargil', 'Anantnag', 'Baramulla', 'Sopore',
  'Kupwara', 'Bandipora', 'Ganderbal', 'Budgam', 'Pulwama', 'Shopian',
  'Kulgam', 'Kathua', 'Samba', 'Udhampur', 'Reasi', 'Rajouri', 'Poonch',
  'Doda', 'Kishtwar', 'Ramban',

  // Union Territories
  'Port Blair', 'Kavaratti', 'Daman', 'Diu', 'Silvassa', 'Dadra', 'Nagar Haveli'
]

export const assets = {
    logo,
    gmail_logo,
    facebook_logo,
    instagram_logo,
    twitter_logo,
    menu_icon,
    search_icon,
    close_icon,
    users_icon,
    edit_icon,
    car_icon,
    location_icon,
    fuel_icon,
    addIcon,
    carIcon,
    carIconColored,
    dashboardIcon,
    dashboardIconColored,
    addIconColored,
    listIcon,
    listIconColored,
    cautionIconColored,
    calendar_icon_colored,
    location_icon_colored,
    arrow_icon,
    star_icon,
    check_icon,
    tick_icon,
    delete_icon,
    eye_icon,
    eye_close_icon,
    filter_icon,
    testimonial_image_1,
    testimonial_image_2,
    main_car,
    banner_car_image,
    car_image1,
    upload_icon,
    user_profile,
    car_image2,
    car_image3,
    car_image4
}

export const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "My Bookings", path: "/my-bookings" },
]

export const ownerMenuLinks = [
    { name: "Dashboard", path: "/owner", icon: dashboardIcon, coloredIcon: dashboardIconColored },
    { name: "Add car", path: "/owner/add-car", icon: addIcon, coloredIcon: addIconColored },
    { name: "Manage Cars", path: "/owner/manage-cars", icon: carIcon, coloredIcon: carIconColored },
    { name: "Manage Bookings", path: "/owner/manage-bookings", icon: listIcon, coloredIcon: listIconColored },
    { name: "Manage Reviews", path: "/owner/manage-reviews", icon: star_icon, coloredIcon: star_icon },
]

export const dummyUserData = {
  "_id": "6847f7cab3d8daecdb517095",
  "name": "GreatStack",
  "email": "admin@example.com",
  "role": "owner",
  "image": user_profile,
}

export const dummyCarData = [
    {
        "_id": "67ff5bc069c03d4e45f30b77",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "BMW",
        "model": "X5",
        "image": car_image1,
        "year": 2006,
        "category": "SUV",
        "seating_capacity": 4,
        "fuel_type": "Hybrid",
        "transmission": "Semi-Automatic",
        "pricePerDay": 300,
        "location": "Mumbai",
        "description": "The BMW X5 is a mid-size luxury SUV produced by BMW. The X5 made its debut in 1999 as the first SUV ever produced by BMW.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:26:56.215Z",
    },
    {
        "_id": "67ff6b758f1b3684286a2a65",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Toyota",
        "model": "Corolla",
        "image": car_image2,
        "year": 2021,
        "category": "Sedan",
        "seating_capacity": 4,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "pricePerDay": 130,
        "location": "Delhi",
        "description": "The Toyota Corolla is a mid-size luxury sedan produced by Toyota. The Corolla made its debut in 2008 as the first sedan ever produced by Toyota.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:33:57.993Z",
    },
    {
        "_id": "67ff6b9f8f1b3684286a2a68",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Jeep ",
        "model": "Wrangler",
        "image": car_image3,
        "year": 2023,
        "category": "SUV",
        "seating_capacity": 4,
        "fuel_type": "Hybrid",
        "transmission": "Automatic",
        "pricePerDay": 200,
        "location": "Bangalore",
        "description": "The Jeep Wrangler is a mid-size luxury SUV produced by Jeep. The Wrangler made its debut in 2003 as the first SUV ever produced by Jeep.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:34:39.592Z",
    },
    {
        "_id": "68009c93a3f5fc6338ea7e34",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Ford",
        "model": "Neo 6",
        "image": car_image4,
        "year": 2022,
        "category": "Sedan",
        "seating_capacity": 2,
        "fuel_type": "Diesel",
        "transmission": "Semi-Automatic",
        "pricePerDay": 209,
        "location": "Chennai",
        "description": "This is a mid-size luxury sedan produced by Toyota. The Corolla made its debut in 2008 as the first sedan ever produced by Toyota.",
        "isAvaliable": true,
        "createdAt": "2025-04-17T06:15:47.318Z",
    }
];

export const dummyMyBookingsData = [
    {
        "_id": "68482bcc98eb9722b7751f70",
        "car": dummyCarData[0],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "6847f7cab3d8daecdb517095",
        "pickupDate": "2025-06-13T00:00:00.000Z",
        "returnDate": "2025-06-14T00:00:00.000Z",
        "status": "confirmed",
        "price": 440,
        "createdAt": "2025-06-10T12:57:48.244Z",
    },
    {
        "_id": "68482bb598eb9722b7751f60",
        "car": dummyCarData[1],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "pickupDate": "2025-06-12T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "pending",
        "price": 130,
        "createdAt": "2025-06-10T12:57:25.613Z",
    },
    {
        "_id": "684800fa0fb481c5cfd92e56",
        "car": dummyCarData[2],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "pickupDate": "2025-06-11T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "pending",
        "price": 600,
        "createdAt": "2025-06-10T09:55:06.379Z",
    },
    {
        "_id": "6847fe790fb481c5cfd92d94",
        "car": dummyCarData[3],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "6847f7cab3d8daecdb517095",
        "pickupDate": "2025-06-11T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "confirmed",
        "price": 440,
        "createdAt": "2025-06-10T09:44:25.410Z",
    }
]

export const dummyDashboardData = {
    "totalCars": 4,
    "totalBookings": 2,
    "pendingBookings": 0,
    "completedBookings": 2,
    "recentBookings": [
        dummyMyBookingsData[0],
        dummyMyBookingsData[1]
    ],
    "monthlyRevenue": 840
}
