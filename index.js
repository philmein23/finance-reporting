// Require the framework and instantiate it
const fastify = require("fastify")({
  logger: true,
});
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config();

fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "/client_side/public"),
});
fastify.register(require("fastify-redis"), { host: "localhost" });

const API_KEY = process.env.FINANCE_API_KEY;
const DOMAIN_URI = "https://financialmodelingprep.com/api/v3/";

function get_options(statement_type) {
  return {
    schema: {
      querystring: {
        period: { type: "string" },
      },
    },
    handler: async (request, reply) => {
      let symbol = request.params.symbol.toUpperCase();
      let period = "annual";
      let key = `${statement_type}-${symbol}`;
      let url = `${DOMAIN_URI}/${statement_type}/${symbol}?period=${period}&apikey=${API_KEY}`;

      const { redis } = fastify;

      if (request.query.period) {
        period = request.query.period;
      }

      let does_exist = await redis.exists(key);
      if (does_exist) {
        console.log(`KEY FOUND IN CACHE ${statement_type} ${symbol}`);
        let data = await redis.get(key);
        return JSON.parse(data); // dserialize data before returning it
      }

      try {
        let result = await fetch(url);
        let data = await result.json();
        console.log("KEY NOT FOUND IN CACHE...ADDING TO CACHE NOW");

        await redis.set(key, JSON.stringify(data)); // serialize data before caching it

        return data;
      } catch (err) {
        console.error(error);
      }
    },
  };
}

function get_historical_prices_options() {
  return {
    handler: async (request, reply) => {
      const { redis } = fastify;
      const EXPIRATION = 86400; // represents 24 hours in seconds;

      let symbol = request.params.symbol.toUpperCase();
      let time_variance = request.params.time_variance;
      let key = `historical-chart-${symbol}-${time_variance}`;
      let url = `${DOMAIN_URI}/historical-chart/${time_variance}/${symbol}?apikey=${API_KEY}`;

      let does_exist = await redis.exists(key);
      if (does_exist) {
        console.log(
          `KEY FOUND IN CACHE historical-chart-${symbol}-${time_variance}`
        );
        let data = await redis.get(key);

        let time_to_live = await redis.ttl(key);
        console.log(`TTL: ${time_to_live}`);

        return JSON.parse(data); // dserialize data before returning it
      }

      try {
        let result = await fetch(url);
        let data = await result.json();
        console.log("KEY NOT FOUND IN CACHE...ADDING TO CACHE NOW");

        await redis.set(key, JSON.stringify(data)); // serialize data before caching it

        let bool = await redis.expire(key, EXPIRATION);
        console.log(`EXPIRED: ${bool}`);

        return data;
      } catch (err) {
        console.error(error);
      }
    },
  };
}

fastify.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

// income statements
fastify.get("/income-statement/:symbol", get_options("income-statement"));
fastify.get(
  "/balance-sheet-statement/:symbol",
  get_options("balance-sheet-statement")
);

fastify.get("/cash-flow-statement/:symbol", get_options("cash-flow-statement"));
fastify.get("/enterprise-values/:symbol", get_options("enterprise-values"));
fastify.get("/key-metrics/:symbol", get_options("key-metrics"));
fastify.get("/financial-growth/:symbol", get_options("financial-growth"));
fastify.get(
  "/historical-chart/:time_variance/:symbol",
  get_historical_prices_options()
);

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
