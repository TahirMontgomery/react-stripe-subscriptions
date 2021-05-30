import React, { useState, useEffect } from "react";
import PricingCard from "./PricingCard";
import { pricingDetails } from "../data/pricingDetails.js";
import "./pricing.css";
import { useStripe } from "@stripe/react-stripe-js";
export default function Pricing() {
  const [pricingList, setPricingList] = useState([]);
  const [activePricing, setActivePricing] = useState(null);
  const stripe = useStripe();

  const getProducts = async () => {
    const response = await fetch("http://stripe.tahirm.co/api/get-products", {
      method: "GET",
    });
    const { products } = await response.json();
    setPricingList(products);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const createCheckoutSession = function (priceId) {
    return fetch("http://stripe.tahirm.co/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: priceId,
      }),
    }).then(function (result) {
      return result.json();
    });
  };

  const checkout = async function () {
    const response = await createCheckoutSession(activePricing.priceId);
    if (response.error) {
      console.log(response.error);
      return;
    }
    // console.log(response);
    await stripe.redirectToCheckout({
      sessionId: response.sessionId,
    });
  };

  return (
    <div>
      <div className="pricing">
        {pricingList.map((price) => (
          <div
            className="card__wrapper"
            key={price.id}
            onClick={() => setActivePricing(price)}
          >
            <PricingCard pricingInfo={price} active={price == activePricing} />
          </div>
        ))}
      </div>
      <div className="button-wrapper">
        <button
          disabled={!activePricing || !stripe}
          onClick={checkout}
          className="btn"
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
}
