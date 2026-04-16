import fs from 'fs';

let content = fs.readFileSync('src/assets/frontend_assets/assets.js', 'utf-8');

// Replace `price: x` with `price_half_kg: x, price_one_kg: y`
content = content.replace(/price:\s*(\d+)/g, (match, p1) => {
    let half = parseInt(p1);
    let full = half * 2;
    // special cases based on desc
    if (half === 350) full = 650;
    if (half === 320) full = 620;
    if (half === 340) full = 640;
    return `price_half_kg: ${half}, price_one_kg: ${full}`;
});

// Add placeholders for the user's new cakes
const newCakes = `
    { _id: "18", name: "Computer Theme Cake", image: food_1, price_half_kg: 400, price_one_kg: 800, description: "Unique IT Theme Cake", category: "Theme Cake" },
    { _id: "19", name: "Chocolate Oreo Cake", image: food_14, price_half_kg: 350, price_one_kg: 650, description: "Delicious Oreo Cake", category: "Birthday Cake" },
    { _id: "20", name: "Pineapple Glaze Cake", image: food_1, price_half_kg: 320, price_one_kg: 600, description: "Fresh Pineapple Cake", category: "Birthday Cake" },
    { _id: "21", name: "Pink Rose Fondant Cake", image: food_2, price_half_kg: 450, price_one_kg: 900, description: "Beautiful Rose Cake", category: "Theme Cake" },
    { _id: "22", name: "Dark Chocolate Cake", image: food_7, price_half_kg: 350, price_one_kg: 650, description: "Rich Dark Chocolate", category: "Birthday Cake" }
`;

content = content.replace(/\{ _id: "17".*\}\n\]/, (match) => {
    return match.replace('\n]', ',\n' + newCakes + '\n]');
});

fs.writeFileSync('src/assets/frontend_assets/assets.js', content);
console.log('Fixed assets.js');
