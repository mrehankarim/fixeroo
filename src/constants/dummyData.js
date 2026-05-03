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
  { id: 1, title: 'Home Cleaning', category: 'Cleaning', price: 50, discount: '10% OFF', icon: 'spray-bottle', rating: 4.8, reviews: 87 },
  { id: 2, title: 'Carpet Cleaning', category: 'Cleaning', price: 30, discount: '10% OFF', icon: 'spray-bottle', rating: 4.7, reviews: 64 },
  { id: 3, title: 'Bathroom Cleaning', category: 'Cleaning', price: 25, icon: 'spray-bottle', rating: 4.6, reviews: 52 },

  { id: 4, title: 'AC General Service', category: 'AC Repair', price: 40, discount: '15% OFF', icon: 'air-conditioner', rating: 4.8, reviews: 112 },
  { id: 5, title: 'AC Gas Filling', category: 'AC Repair', price: 60, icon: 'air-conditioner', rating: 4.9, reviews: 98 },
  { id: 6, title: 'AC Installation', category: 'AC Repair', price: 80, icon: 'air-conditioner', rating: 4.7, reviews: 76 },

  { id: 7, title: 'Bridal Makeup', category: 'Beauty', price: 150, discount: '20% OFF', icon: 'face-woman', rating: 4.9, reviews: 134 },
  { id: 8, title: 'Facial & Cleanup', category: 'Beauty', price: 45, icon: 'face-woman', rating: 4.7, reviews: 89 },
  { id: 9, title: 'Manicure & Pedicure', category: 'Beauty', price: 35, icon: 'face-woman', rating: 4.6, reviews: 71 },

  { id: 10, title: 'Washing Machine Repair', category: 'Appliance', price: 45, icon: 'washing-machine', rating: 4.5, reviews: 58 },
  { id: 11, title: 'Refrigerator Repair', category: 'Appliance', price: 55, discount: '10% OFF', icon: 'fridge-outline', rating: 4.8, reviews: 93 },
  { id: 12, title: 'Microwave Repair', category: 'Appliance', price: 30, icon: 'microwave', rating: 4.4, reviews: 45 },

  { id: 13, title: 'Full Home Painting', category: 'Painting', price: 500, discount: '5% OFF', icon: 'roller', rating: 4.8, reviews: 67 },
  { id: 14, title: 'Single Room Painting', category: 'Painting', price: 120, icon: 'roller', rating: 4.6, reviews: 43 },
  { id: 15, title: 'Texture Painting', category: 'Painting', price: 200, icon: 'roller', rating: 4.7, reviews: 55 },

  { id: 16, title: 'Tap & Shower Repair', category: 'Plumbing', price: 20, icon: 'pipe-wrench', rating: 4.5, reviews: 38 },
  { id: 17, title: 'Water Tank Cleaning', category: 'Plumbing', price: 60, discount: '10% OFF', icon: 'pipe-wrench', rating: 4.7, reviews: 82 },
  { id: 18, title: 'Drainage Pipe Blockage', category: 'Plumbing', price: 40, icon: 'pipe-wrench', rating: 4.6, reviews: 61 },

  { id: 19, title: 'TV Repair', category: 'Electronics', price: 45, icon: 'television', rating: 4.6, reviews: 74 },
  { id: 20, title: 'Laptop Repair', category: 'Electronics', price: 60, discount: '15% OFF', icon: 'laptop', rating: 4.8, reviews: 103 },
  { id: 21, title: 'CCTV Installation', category: 'Electronics', price: 100, icon: 'cctv', rating: 4.9, reviews: 119 },

  { id: 22, title: '1 BHK Shifting', category: 'Shifting', price: 150, icon: 'truck', rating: 4.5, reviews: 47 },
  { id: 23, title: '2 BHK Shifting', category: 'Shifting', price: 250, discount: '5% OFF', icon: 'truck', rating: 4.7, reviews: 62 },
  { id: 24, title: 'Vehicle Transportation', category: 'Shifting', price: 200, icon: 'car', rating: 4.6, reviews: 39 },

  { id: 25, title: 'Haircut & Beard', category: "Men's Salon", price: 25, icon: 'hair-dryer', rating: 4.8, reviews: 156 },
  { id: 26, title: 'Hair Color', category: "Men's Salon", price: 35, discount: '10% OFF', icon: 'hair-dryer', rating: 4.7, reviews: 88 },
  { id: 27, title: 'Head Massage', category: "Men's Salon", price: 20, icon: 'hair-dryer', rating: 4.9, reviews: 211 },
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