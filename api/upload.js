import multer from "multer";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("file")(req, res, err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ status: "OK" });
    });
  } else res.status(405).end();
}