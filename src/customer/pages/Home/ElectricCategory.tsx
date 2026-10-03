import React from "react";
import ElectricCategoryCard from "./ElectricCategory/ElectricCategoryCard";

const items = [
  ["/images/iphone-blue.jpg", "Mobiles"],
  ["/images/android-smartphone-black.jpg", "Electronics"],
  ["/images/smartwatch-collection.jpg", "Watches"],
  ["/images/100-years-tshirt.jpg", "Men's Wear"],
  ["/images/sadi3.jpg", "Women's Wear"],
  ["/images/black-running-shoes-02.jpg", "Footwear"],
  ["/images/sony-smart-tv.jpg", "Entertainment"],
];

const ElectricCategory = () => (
  <div className="ab-card flex gap-3 overflow-x-auto p-3 sm:grid sm:grid-cols-4 lg:grid-cols-7">
    {items.map(([image, title]) => <ElectricCategoryCard key={title} image={image} title={title} />)}
  </div>
);

export default ElectricCategory;

