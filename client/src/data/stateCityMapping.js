// Complete state-city mapping for India
const rawStateCityMapping = {
  'Andhra Pradesh': [
    'Vijayawada', 'Visakhapatnam', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry',
    'Tirupati', 'Kakinada', 'Eluru', 'Anantapur', 'Chittoor', 'Machilipatnam',
    'Rajam', 'Bobbili', 'Narasaraopet', 'Giddalur', 'Jammalamadugu',
    'Peddapuram', 'Repalle', 'Srikalahasti', 'Venkatagiri', 'Rayachoti',
    'Jaggaiahpet', 'Tuni', 'Amalapuram', 'Bhimavaram', 'Chirala', 'Addanki',
    'Narasapur', 'Kavali', 'Palacole', 'Kandukur', 'Sullurpeta', 'Tanuku',
    'Mandapeta'
  ],
  'Arunachal Pradesh': [
    'Itanagar', 'Seppa', 'Yupia', 'Naharlagun', 'Pasighat', 'Along',
    'Bomdila', 'Ziro', 'Tawang', 'Khonsa', 'Tezu', 'Roing', 'Anini',
    'Yingkiong', 'Mechuka', 'Tato'
  ],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur',
    'Dhubri', 'North Lakhimpur', 'Karimganj', 'Sivasagar', 'Goalpara', 'Barpeta',
    'Diphu', 'Mangaldoi', 'Hailakandi', 'Morigaon', 'Hojai', 'Lanka', 'Lumding',
    'Mankachar', 'Nalbari', 'Rangia', 'Margherita', 'Kokrajhar', 'Hajo',
    'Marigaon', 'Bilasipara', 'Sarupathar', 'Lala', 'Abhayapuri', 'Jonai',
    'Algapur', 'Gauripur', 'Golaghat', 'Haflong', 'Howly', 'Lakhipur',
    'Lalmanirhat', 'Makum', 'Mariani', 'Mazbat', 'Nazira', 'Numaligarh',
    'Raha', 'Sibsagar', 'Sonari', 'Udalguri'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif',
    'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Saharsa',
    'Sasaram', 'Hajipur', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha',
    'Buxar', 'Kishanganj', 'Sitamarhi', 'Jamalpur', 'Jehanabad', 'Aurangabad'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur',
    'Raigarh', 'Ambikapur', 'Mahasamund', 'Dhamtari', 'Chirmiri'
  ],
  'Goa': [
    'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim',
    'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar',
    'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar', 'Bharuch', 'Mehsana',
    'Bhuj', 'Porbandar', 'Palanpur', 'Valsad', 'Vapi', 'Gondal', 'Veraval', 'Godhra',
    'Patan', 'Kalol', 'Dahod', 'Botad', 'Amreli', 'Deesa', 'Jetpur'
  ],
  'Haryana': [
    'Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Yamunanagar'
  ],
  'Himachal Pradesh': [
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
    'Kunzum Pass', 'Pin Valley National Park'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh',
    'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda'
  ],
  'Karnataka': [
    'Bangalore', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere',
    'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet',
    'Hassan', 'Gadag-Betigeri', 'Udupi', 'Bhadravati', 'Chitradurga', 'Kolar',
    'Mandya', 'Chikmagalur', 'Gangavati', 'Bagalkot', 'Ranebennuru', 'Robertsonpet',
    'Karwar', 'Dandeli', 'Sirsi', 'Puttur', 'Bhatkal'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad',
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
    'Nemom', 'Aroor', 'North Paravur', 'Vypin', 'Cherai', 'Kumbakonam'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna',
    'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind',
    'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh', 'Mandsaur',
    'Khargone', 'Neemuch', 'Pithampur', 'Narmadapuram', 'Itarsi', 'Sehore',
    'Morena', 'Betul', 'Seoni', 'Datia', 'Nagda', 'Dindori'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Thane', 'Vasai-Virar', 'Amravati',
    'Navi Mumbai', 'Kolhapur', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur',
    'Parbhani', 'Ichalkaranji', 'Jalgaon', 'Bhusawal', 'Panvel', 'Badlapur', 'Beed',
    'Gondia', 'Satara', 'Barshi', 'Yavatmal', 'Achalpur', 'Osmanabad', 'Nandurbar',
    'Wardha', 'Udgir', 'Hinganghat'
  ],
  'Manipur': [
    'Imphal', 'Churachandpur', 'Bishnupur', 'Thoubal', 'Ukhrul', 'Senapati', 'Tamenglong',
    'Chandel', 'Jiribam', 'Kangpokpi', 'Kakching', 'Tengnoupal', 'Kamjong',
    'Noney', 'Pherzawl'
  ],
  'Meghalaya': [
    'Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Baghmara', 'Williamnagar',
    'Resubelpara', 'Ampati', 'Dadengiri', 'Mendipathar', 'Khliehriat', 'Amlarem',
    'Mairang', 'Nongstoin', 'Mawkyrwat', 'Ranikor', 'Mawsynram', 'Cherrapunji'
  ],
  'Mizoram': [
    'Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai',
    'Saitual', 'Khawzawl', 'Hnahthial'
  ],
  'Nagaland': [
    'Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha',
    'Zunheboto', 'Phek', 'Kiphire', 'Longleng', 'Peren', 'Mon', 'Noklak',
    'Chumukedima'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri',
    'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Barbil',
    'Khordha', 'Rayagada', 'Koraput', 'Kendrapara', 'Jagatsinghpur', 'Paradip',
    'Bhawanipatna', 'Dhenkanal', 'Keonjhar', 'Sunabeda', 'Rajgangpur', 'Talcher',
    'Nabarangpur', 'Jatni', 'Chhatrapur', 'Berhampur', 'Mayurbhanj', 'Angul',
    'Bolangir', 'Subarnapur', 'Titlagarh', 'Malkangiri', 'Nuapada', 'Kalahandi',
    'Ganjam', 'Nayagarh', 'Gajapati', 'Kandhamal', 'Baudh', 'Deogarh'
  ],
  'Punjab': [
    'Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali',
    'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Abohar', 'Malerkotla', 'Khanna',
    'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Firozpur'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Bharatpur',
    'Pali', 'Barmer', 'Sikar', 'Tonk', 'Kishangarh', 'Beawar', 'Hanumangarh'
  ],
  'Sikkim': [
    'Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Rangpo', 'Singtam', 'Jorethang', 'Nayabazar',
    'Gyalshing', 'Yuksom', 'Lachung', 'Lachen', 'Pelling', 'Ravangla',
    'Kalimpong', 'Pakyong'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode',
    'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi',
    'Karur', 'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Kumarakonam',
    'Pudukkottai', 'Ambur', 'Nagapattinam', 'Rajapalayam', 'Puduchcherry',
    'Neyveli', 'Tiruvannamalai', 'Pollachi', 'Ramanathapuram', 'Udumalaipettai',
    'Gobichettipalayam', 'Thiruvallur', 'Vaniyambadi', 'Theni', 'Villupuram',
    'Gingee', 'Aruppukkottai', 'Mettupalayam', 'Lalgudi', 'Sankarankovil',
    'Tenkasi', 'Palani', 'Virudhachalam', 'Paramakudi', 'Arcot', 'Bodi',
    'Palladam', 'Sivaganga', 'Tindivanam', 'Virudhunagar', 'Karaikudi', 'Tiruvethipuram'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar', 'Medak',
    'Miryalaguda', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet', 'Jagtial',
    'Mancherial', 'Gadwal', 'Wanaparthy', 'Narayanpet', 'Sangareddy', 'Medchal',
    'Vikarabad'
  ],
  'Tripura': [
    'Agartala', 'Udaipur', 'Kailashahar', 'Dharmanagar',
    'Ambassa', 'Belonia', 'Khowai', 'Teliamura', 'Sabroom', 'Sonamura',
    'Amarpur', 'Kumarghat', 'Ranirbazar', 'Melaghar', 'Jirania', 'Mohanpur',
    'Kamalpur', 'Bishramganj', 'Boxanagar', 'Panisagar', 'Pecharthal',
    'Longtharai Valley'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Allahabad', 'Bareilly',
    'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Firozabad', 'Jhansi', 'Muzaffarnagar',
    'Mathura', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Mau', 'Hapur', 'Etawah',
    'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli',
    'Orai', 'Sitapur', 'Bahraich', 'Modinagar', 'Unnao', 'Jaunpur', 'Lakhimpur',
    'Hathras', 'Banda', 'Pilibhit', 'Barabanki', 'Khurja', 'Gonda', 'Mainpuri',
    'Lalitpur', 'Etah', 'Deoria', 'Ujhani', 'Ghazipur', 'Sultanpur', 'Azamgarh',
    'Bijnor', 'Sahaswan', 'Basti', 'Chandausi', 'Akbarpur', 'Ballia', 'Tanda',
    'Greater Noida', 'Shikohabad', 'Shamli', 'Awagarh', 'Kasganj'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh',
    'Kotdwara', 'Ramnagar', 'Pithoragarh', 'Jaspur', 'Khatima', 'Manglaur',
    'Nainital', 'Almora', 'Mussoorie', 'Tehri', 'Pauri', 'Srinagar', 'Chamoli',
    'Bageshwar', 'Champawat', 'Rudraprayag', 'Uttarkashi'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'English Bazar',
    'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian',
    'Ranaghat', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur',
    'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Chakdaha', 'Darjeeling',
    'Alipurduar', 'Purulia', 'Jangipur', 'Bolpur', 'Bangaon', 'Cooch Behar'
  ],
  'Delhi': [
    'New Delhi', 'Delhi', 'Faridabad', 'Ghaziabad', 'Noida', 'Greater Noida'
  ],
  'Jammu and Kashmir': [
    'Jammu', 'Srinagar', 'Anantnag', 'Baramulla', 'Sopore',
    'Kupwara', 'Bandipora', 'Ganderbal', 'Budgam', 'Pulwama', 'Shopian',
    'Kulgam', 'Kathua', 'Samba', 'Udhampur', 'Reasi', 'Rajouri', 'Poonch',
    'Doda', 'Kishtwar', 'Ramban'
  ],
  'Ladakh': [
    'Leh', 'Kargil'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Puducherry': [
    'Puducherry', 'Karaikal', 'Mahe', 'Yanam'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Daman', 'Diu', 'Silvassa', 'Dadra', 'Nagar Haveli'
  ],
  'Andaman and Nicobar Islands': [
    'Port Blair'
  ],
  'Lakshadweep': [
    'Kavaratti'
  ]
};

// Sort all cities alphabetically
export const stateCityMapping = Object.keys(rawStateCityMapping).reduce((acc, state) => {
  acc[state] = rawStateCityMapping[state].sort();
  return acc;
}, {});

// Indian states list
export const statesList = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Chandigarh', 'Puducherry', 'Dadra and Nagar Haveli and Daman and Diu',
  'Andaman and Nicobar Islands', 'Lakshadweep'
];
