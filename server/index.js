const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const STRIPE_SECRET_KEY = "<YOUR_SECRET_KEY>";

const stripe = require("stripe")(STRIPE_SECRET_KEY);

function getDollarAmount(amountInPennies) {
  return Math.floor(amountInPennies / 100);
}

function getCentsAmount(amountInPennies) {
  return amountInPennies - Math.floor(amountInPennies / 100) * 100;
}

app.get("/api", (req, res) => {
  res.send("Hello World");
});

app.get("/api/get-products", async (req, res) => {
  try {
    const products = await stripe.products.list();
    const prices = await stripe.prices.list();
    const productList = products.data.map((product) => {
      let productPriceInfo = prices.data.find(
        (price) => price.product == product.id
      );
      return {
        id: product.id,
        priceId: productPriceInfo.id,
        title: product.name,
        subtitle: product.description,
        dollarAmount: getDollarAmount(productPriceInfo.unit_amount),
        centsAmount: getCentsAmount(productPriceInfo.unit_amount),
      };
    });
    res.send({ products: productList.reverse() });
  } catch (e) {
    res.status(400);
    res.send({
      error: {
        message: e.message,
      },
    });
  }
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: "http://<YOUR_URL>/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://<YOUR_URL>/",
    });

    console.log(session);
    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(3001, () => {
  console.log("Server now listening on port 3001");
});
