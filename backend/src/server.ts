import app from "./app";
import { connectDB } from "./config/database.config";
import { createServer } from "http";
const PORT = process.env.PORT || 5001;
(async () => {
  await connectDB();
  const server = createServer(app);
  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
})();
