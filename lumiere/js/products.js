/* ==========================================================
   Lumière — product data
   Each product's main image lives at images/products/<id>.jpg
   Extra gallery images (optional): <id>-2.jpg, <id>-3.jpg
   ========================================================== */
window.LUM = {
  cats: {
    all:         { title: 'All products',    tagline: 'Everything Lumière, in one place.' },
    beauty:      { title: 'Beauty',          tagline: 'Skincare and makeup picked for everyday routines.' },
    skincare:    { title: 'Skincare',        tagline: 'Healthy skin, happy you.' },
    makeup:      { title: 'Makeup',          tagline: 'Colour, coverage and finish you can rely on.' },
    fashion:     { title: 'Fashion',         tagline: 'Pieces that move from morning to evening.' },
    electronics: { title: 'Electronics',     tagline: 'Useful tech with a softer look.' },
    home:        { title: 'Home & Living',   tagline: 'Small details that make a room feel finished.' },
    accessories: { title: 'Accessories',     tagline: 'Bags and finishing touches.' },
    offers:      { title: 'Offers',          tagline: 'Current discounts across every category.' },
    wishlist:    { title: 'Your wishlist',   tagline: 'Products you saved for later.' }
  },

  products: [
    { id: 1,  brand: 'CeraVe',        title: 'Foaming Facial Cleanser',           cat: 'skincare', sub: 'Face Care', price: 14.99, old: 16.99, rating: 4.8, reviews: 245, best: true },
    { id: 2,  brand: 'The Ordinary',  title: 'Niacinamide 10% + Zinc 1%',         cat: 'skincare', sub: 'Face Care', price: 8.90,  rating: 4.7, reviews: 189 },
    { id: 3,  brand: 'La Roche-Posay',title: 'Effaclar Duo',                      cat: 'skincare', sub: 'Face Care', price: 18.50, rating: 4.6, reviews: 142 },
    { id: 4,  brand: 'Neutrogena',    title: 'Hydro Boost Water Gel',             cat: 'skincare', sub: 'Face Care', price: 16.00, rating: 4.7, reviews: 98 },
    { id: 5,  brand: 'Clinique',      title: 'Moisture Surge',                    cat: 'skincare', sub: 'Face Care', price: 32.00, rating: 4.6, reviews: 76 },
    { id: 6,  brand: 'The Ordinary',  title: 'Hyaluronic Acid 2% + B5',           cat: 'skincare', sub: 'Face Care', price: 9.50,  rating: 4.8, reviews: 203 },
    { id: 7,  brand: 'COSRX',         title: 'Advanced Snail 96 Mucin',           cat: 'skincare', sub: 'Face Care', price: 15.00, old: 17.20, rating: 4.7, reviews: 121 },
    { id: 8,  brand: "Paula's Choice",title: 'Skin Perfecting 2% BHA',            cat: 'skincare', sub: 'Face Care', price: 28.00, rating: 4.8, reviews: 89 },
    { id: 9,  brand: 'Bioderma',      title: 'Sensibio H2O Micellar Water',       cat: 'skincare', sub: 'Face Care', price: 12.50, rating: 4.9, reviews: 156 },
    { id: 10, brand: 'Vichy',         title: 'Mineral 89 Booster',                cat: 'skincare', sub: 'Face Care', price: 22.00, rating: 4.6, reviews: 110, isNew: true },
    { id: 11, brand: 'Caudalie',      title: 'Vinoperfect Brightening Serum',     cat: 'skincare', sub: 'Face Care', price: 49.00, rating: 4.5, reviews: 87 },
    { id: 12, brand: "Kiehl's",       title: 'Ultra Facial Cream',                cat: 'skincare', sub: 'Face Care', price: 26.00, old: 32.50, rating: 4.7, reviews: 134, best: true },
    { id: 13, brand: 'Eucerin',       title: 'Daily Hydration Body Lotion',       cat: 'skincare', sub: 'Body Care', price: 13.00, rating: 4.5, reviews: 64 },
    { id: 14, brand: 'Nivea',         title: 'Soft Moisturising Cream',           cat: 'skincare', sub: 'Body Care', price: 9.00,  rating: 4.4, reviews: 71 },
    { id: 15, brand: 'Olaplex',       title: 'No.3 Hair Perfector',               cat: 'skincare', sub: 'Hair Care', price: 30.00, rating: 4.7, reviews: 98 },
    { id: 16, brand: 'Moroccanoil',   title: 'Treatment Hair Oil',                cat: 'skincare', sub: 'Hair Care', price: 34.00, rating: 4.8, reviews: 212 },
    { id: 17, brand: 'Glow Recipe',   title: 'Watermelon Moisturizer',            cat: 'skincare', sub: 'Face Care', price: 28.00, rating: 4.7, reviews: 134, best: true, badge: 'Best seller' },

    { id: 18, brand: 'Maybelline',    title: 'Matte Lipstick',                    cat: 'makeup',   sub: 'Lips',  price: 12.50, old: 15.60, rating: 4.5, reviews: 88, best: true },
    { id: 19, brand: 'Fenty Beauty',  title: "Pro Filt'r Soft Matte Foundation",  cat: 'makeup',   sub: 'Face',  price: 40.00, rating: 4.7, reviews: 98, best: true },
    { id: 20, brand: 'Rare Beauty',   title: 'Soft Pinch Liquid Blush',           cat: 'makeup',   sub: 'Cheeks',price: 23.00, rating: 4.8, reviews: 176, isNew: true },

    { id: 21, brand: 'Nike',          title: 'Air Force 1 Sneakers',              cat: 'fashion',  sub: 'Shoes', price: 110.00, rating: 4.8, reviews: 203, best: true },
    { id: 22, brand: 'Zara',          title: 'Wool Blend Belted Coat',            cat: 'fashion',  sub: 'Outerwear', price: 129.00, old: 159.00, rating: 4.4, reviews: 57, best: true },

    { id: 23, brand: 'Charles & Keith', title: 'Structured Shoulder Bag',         cat: 'accessories', sub: 'Bags', price: 49.00, rating: 4.6, reviews: 89, best: true },

    { id: 24, brand: 'Apple',         title: 'Watch Series 9',                    cat: 'electronics', sub: 'Wearables', price: 299.00, rating: 4.8, reviews: 312, best: true, isNew: true },
    { id: 25, brand: 'Sony',          title: 'WH-1000XM5 Headphones',             cat: 'electronics', sub: 'Audio', price: 349.00, old: 399.00, rating: 4.8, reviews: 421, best: true },

    { id: 26, brand: 'Maison Lumière',title: 'Scented Soy Candle',                cat: 'home',     sub: 'Candles', price: 24.00, rating: 4.7, reviews: 63 },
    { id: 27, brand: 'Casa Rose',     title: 'Linen Cushion Cover Set',           cat: 'home',     sub: 'Textiles', price: 38.00, old: 46.00, rating: 4.5, reviews: 41 }
  ]
};
