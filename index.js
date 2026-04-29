const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");

const PORT = process.env.PORT || 9000;
const corsOrigins = process.env.CORS_ORIGINS
   ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
   : null;
const corsOptions = corsOrigins?.length
   ? { origin: corsOrigins }
   : { origin: true };

// sets port

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(helmet());
app.use(cors(corsOptions));

// Routes
const videoRoutes = require("./routes/videos-routes.js");
app.use("/videos", videoRoutes);

app.use((_req, res) => {
   return res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
   console.error(err);
   return res.status(err.status || 500).json({
      message: err.status ? err.message : "Internal server error",
   });
});

// listen
app.listen(PORT, (err) => {
   if (err) {
      console.error(err);
      return;
   }
   console.log(`server is running on port ${PORT}`);
});
