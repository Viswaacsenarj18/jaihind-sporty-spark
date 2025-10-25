import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "admin123"; // your plain password
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashed);
}

generateHash();