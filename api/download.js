import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const file = req.query.file;
  const filepath = path.join(process.cwd(), "uploads", file);

  if (!fs.existsSync(filepath)) return res.status(404).end("Not found");
  res.sendFile(filepath);
}