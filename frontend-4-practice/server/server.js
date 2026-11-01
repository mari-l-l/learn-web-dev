import { database } from "./database.js";

export default function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith("/api/")) {
          return next();
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const path = urlObj.pathname;

        if (path === "/api/booking/today") {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(database.today));
          return;
        }

        if (path === "/api/slots") {
          const day = parseInt(urlObj.searchParams.get("day"));
          const month = parseInt(urlObj.searchParams.get("month"));
          const year = parseInt(urlObj.searchParams.get("year"));

          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid date parameters" }));
            return;
          }

          const slotsData = day % 2 === 0 ? database.slots.even : database.slots.odd;

          setTimeout(() => {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({ date: { day, month, year }, slots: slotsData }));
          }, 1000);
          return;
        }

        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Not found" }));
      });
    },
  };
}