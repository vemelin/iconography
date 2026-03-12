import fs from "fs";
import path from "path";

export default function handler(_, res) {
  const dir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(dir)) return res.json([]);
  res.json(fs.readdirSync(dir));
}