import express from "express";
import cors from "cors";
// -------------- ROUTES ---------------

const PORT = process.env.PORT || 8081;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "GET request working" });
});

app.listen(PORT, function () {
  console.log("Server Running");
});

export default app;
