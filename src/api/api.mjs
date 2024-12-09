import express from "express";

const API_NAME = "to-do-it";
const API_VERSION = "0.0.1";

const API_BASE = {
  name: API_NAME,
  version: API_VERSION,
};
Object.freeze(API_BASE);

const LOG_LEVEL = Object.freeze({
  userAgent: true,
  headers: true,
  body: true,
});

export function setup(app) {
  // Add automatic JSON parser
  app.use(express.json());

  // Set API Headers
  app.use((req, res, next) => {
    res.set({
      "Content-Type": "application/json; charset=utf-8",
    });
    next();
  });

  app.use((req, res, next) => {
        const date = (new Date()).toISOString();
        console.log(date);
        console.log(req.url);
        if (LOG_LEVEL.headers) {
            console.log("-- HTTP Headers:");
            console.dir(req.headers);
          }
          
          if (LOG_LEVEL.body && req.body) {
            console.log("-- HTTP Body:");
            console.dir(req.body);
          }
          
          if (LOG_LEVEL.userAgent) {
            console.log("-- User Agent String:");
            console.dir(req.get("User-Agent"));
          }
          
          next();
          
  });
  app.get("/api", (req, res) => {
    res.json({
      api: Object.assign({
        verb: "GET",
        route: "/api",
      }, API_BASE),
      data: {
        message: `API ${API_NAME} version ${API_VERSION}.`,
      },
    });
  });
  
};
export default {
    setup,
};

