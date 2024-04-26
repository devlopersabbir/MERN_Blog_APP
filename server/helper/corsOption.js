import { allowedOrigins } from "./allowedOrigins.js";

export const corsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin) {
      callback(null, true);
    } else {
      console.log("origin: ", requestOrigin);
      if (allowedOrigins.indexOf(requestOrigin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
