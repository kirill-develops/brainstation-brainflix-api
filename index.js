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

// listen
app.listen(PORT, (err) => {
   if (err) {
      console.error(err);
      return;
   }
   console.log(`server is running on port ${PORT}`);
});
