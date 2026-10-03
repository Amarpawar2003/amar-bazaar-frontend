import React from "react";
import DealCard from "./DealCard";

const deals = [
  ["/images/black-analog-watch.jpg", "Smart Watches", "Up to 40% off"],
  ["/images/android-smartphone-blue.jpg", "Smartphones", "Special prices"],
  ["/images/black-running-shoes-02.jpg", "Sneakers", "Min. 30% off"],
  ["/images/100-years-tshirt.jpg", "T-Shirts", "From ₹399"],
  ["/images/acer-laptop.jpg", "Electronics", "Big savings"],
];

const Deal = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    {deals.map(([image, title, offer]) => (
      <DealCard
        key={title}
        image={image}
        title={title}
        offer={offer}
      />
    ))}
  </div>
);

export default Deal;