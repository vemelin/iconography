import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const file = req.query.file;
  const filepath = path.join(process.cwd(), "uploads", file);

  if (!fs.existsSync(filepath)) return res.status(404).json({ error: "Not found" });
  fs.unlinkSync(filepath);
  res.json({ status: "deleted" });
}