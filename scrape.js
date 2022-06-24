//import packages
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;
const client = require("twilio")(accountSid, authToken);

const url =
  "https://www.amazon.in/Arrow-Mens-Regular-Shirt-AFZSH0015_Lt/dp/B084BH9CTS/ref=sr_1_1_sspa?crid=2FX1AXPDU27FP&keywords=shirts&qid=1656048055&sprefix=shirts%2Caps%2C682&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExRDg0R0ZaN1dUQUlDJmVuY3J5cHRlZElkPUEwMDcyNDA1M0lGUTJYNzcwTlRXNSZlbmNyeXB0ZWRBZElkPUEwMjY0MDEwMk8wSFBGV1dBRlBXNiZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=";

const product = { name: "", price: "", link: "" };

const handle = setInterval(scrape, 20000);

async function scrape() {
  //fetch data
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const item = $("div#dp-container");

  product.name = $(item).find("h1 span#productTitle").text();
  product.link = url;
  product.price = parseInt(
    $(item).find("span .a-price-whole").first().text().replace(/[,.]/g, "")
  );

  console.log(product.name, product.price);

  if (product.price < 900) {
    client.messages
      .create({
        body: `The price for ${product.name} went below ${product.price}. Purchase it at ${product.link}`,
        from: "YOUR TWILIO NUMBER",
        to: "MOBILE NUMBER",
      })
      .then((message) => {
        console.log(message.dateSent);
        clearInterval(handle);
      });
  }
}

scrape();
