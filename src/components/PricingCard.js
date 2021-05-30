import React from "react";
import { FaCheck } from "react-icons/fa";
import "./pricingCard.css";

export default function PricingCard({ pricingInfo, active }) {
  return (
    <div className={`card ${active ? "active" : ""}`}>
      <div className="card__header">
        <h3 className="card__title">{pricingInfo.title}</h3>
        <h4 className="card__subtitle">{pricingInfo.subtitle}</h4>
      </div>
      <div className="card__body">
        <div className="price">
          <h3 className="dollar">${pricingInfo.dollarAmount}</h3>
          <h3 className="cents">{pricingInfo.centsAmount}</h3>
          <h3 className="time">/mo</h3>
        </div>
      </div>
    </div>
  );
}
