export const categories = [
  'AC Repair',
  'Beauty',
  'Appliance',
  'Painting',
  'Cleaning',
  'Plumbing',
  'Electronics',
  'Shifting',
  "Men's Salon"
];

export const services = [

  { id: 1, title: 'Home Cleaning', category: 'Cleaning', price: 50, discount: '10% OFF', icon: 'spray-bottle' },
  { id: 2, title: 'Carpet Cleaning', category: 'Cleaning', price: 30, discount: '10% OFF', icon: 'spray-bottle' },
  { id: 3, title: 'Bathroom Cleaning', category: 'Cleaning', price: 25, icon: 'spray-bottle' },

  { id: 4, title: 'AC General Service', category: 'AC Repair', price: 40, discount: '15% OFF', icon: 'air-conditioner' },
  { id: 5, title: 'AC Gas Filling', category: 'AC Repair', price: 60, icon: 'air-conditioner' },
  { id: 6, title: 'AC Installation', category: 'AC Repair', price: 80, icon: 'air-conditioner' },

  { id: 7, title: 'Bridal Makeup', category: 'Beauty', price: 150, discount: '20% OFF', icon: 'face-woman' },
  { id: 8, title: 'Facial & Cleanup', category: 'Beauty', price: 45, icon: 'face-woman' },
  { id: 9, title: 'Manicure & Pedicure', category: 'Beauty', price: 35, icon: 'face-woman' },

  { id: 10, title: 'Washing Machine Repair', category: 'Appliance', price: 45, icon: 'washing-machine' },
  { id: 11, title: 'Refrigerator Repair', category: 'Appliance', price: 55, discount: '10% OFF', icon: 'fridge-outline' },
  { id: 12, title: 'Microwave Repair', category: 'Appliance', price: 30, icon: 'microwave' },

  { id: 13, title: 'Full Home Painting', category: 'Painting', price: 500, discount: '5% OFF', icon: 'roller' },
  { id: 14, title: 'Single Room Painting', category: 'Painting', price: 120, icon: 'roller' },
  { id: 15, title: 'Texture Painting', category: 'Painting', price: 200, icon: 'roller' },

  { id: 16, title: 'Tap & Shower Repair', category: 'Plumbing', price: 20, icon: 'pipe-wrench' },
  { id: 17, title: 'Water Tank Cleaning', category: 'Plumbing', price: 60, discount: '10% OFF', icon: 'pipe-wrench' },
  { id: 18, title: 'Drainage Pipe Blockage', category: 'Plumbing', price: 40, icon: 'pipe-wrench' },

  { id: 19, title: 'TV Repair', category: 'Electronics', price: 45, icon: 'television' },
  { id: 20, title: 'Laptop Repair', category: 'Electronics', price: 60, discount: '15% OFF', icon: 'laptop' },
  { id: 21, title: 'CCTV Installation', category: 'Electronics', price: 100, icon: 'cctv' },

  { id: 22, title: '1 BHK Shifting', category: 'Shifting', price: 150, icon: 'truck' },
  { id: 23, title: '2 BHK Shifting', category: 'Shifting', price: 250, discount: '5% OFF', icon: 'truck' },
  { id: 24, title: 'Vehicle Transportation', category: 'Shifting', price: 200, icon: 'car' },

  { id: 25, title: 'Haircut & Beard', category: "Men's Salon", price: 25, icon: 'hair-dryer' },
  { id: 26, title: 'Hair Color', category: "Men's Salon", price: 35, discount: '10% OFF', icon: 'hair-dryer' },
  { id: 27, title: 'Head Massage', category: "Men's Salon", price: 20, icon: 'hair-dryer' },
];

export const offers = [
  { id: 1, title: 'AC Service', discount: 'Get 25%', code: 'SUMMER25', category: 'AC Repair' },
  { id: 2, title: 'Plumbing Check', discount: 'Flat 15%', code: 'PLUMB15', category: 'Plumbing' },
  { id: 3, title: 'Full Home Cleaning', discount: 'Flat 20%', code: 'CLEAN20', category: 'Cleaning' },
];

export const dummyData = {
  categories,
  services,
  offers,
};