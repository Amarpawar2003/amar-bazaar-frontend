import React from 'react';

interface Props { image: string; title: string; offer: string; }

const DealCard = ({ image, title, offer }: Props) => (
  <div className="group cursor-pointer overflow-hidden rounded-2xl border border-[#e7eaf0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <div className="relative h-44 overflow-hidden bg-[#f5f7fb] sm:h-52">
      <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <span className="absolute left-3 top-3 rounded-full bg-[#ffb400] px-2.5 py-1 text-[10px] font-extrabold text-[#172033]">LIMITED DEAL</span>
    </div>
    <div className="p-4">
      <p className="m-0 text-sm font-extrabold text-[#172033]">{title}</p>
      <p className="m-0 mt-1 text-xs font-bold text-[#18864b]">{offer}</p>
      <button className="mt-3 text-xs font-extrabold text-[#1769ff]">Shop now →</button>
    </div>
  </div>
);

export default DealCard;
