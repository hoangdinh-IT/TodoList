const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todoapp";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const PORT = process.env.PORT || "5005";

export { MONGO_URI, JWT_SECRET, PORT }