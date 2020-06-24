// Require the framework and instantiate it
const fastify = require("fastify")({
  logger: true,
});
const fetch = require("node-fetch");
require("dotenv").config();

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
      let symbol = request.params.symbol;
      let period = "annual";
      const { redis } = fastify;

      if (request.query.period) {
        period = request.query.period;
      }

      let url = `${DOMAIN_URI}/${statement_type}/${symbol}?period=${period}&apikey=${API_KEY}`;
      let result = await fetch(url);
      let data = await result.json();

      return redis.exists(`${statement_type}-${symbol}`).then((does_exist) => {
        if (does_exist) {
          console.log(`KEY FOUND IN CACHE ${statement_type} ${symbol}`);
          return redis
            .get(`${statement_type}-${symbol}`)
            .then((data) => JSON.parse(data));
        }

        console.log("KEY NOT YET STORED IN CACHE");
        return redis
          .set(`${statement_type}-${symbol}`, JSON.stringify(data))
          .then((status) => {
            console.log(`STATUS: ${status}`);

            return data;
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },
  };
}

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

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
