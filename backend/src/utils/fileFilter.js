import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let ext = path.extname(file.originalname);
    if (!ext) {
      const mime = file.mimetype;
      if (mime === "image/jpeg") ext = ".jpg";
      else if (mime === "image/png") ext = ".png";
      else if (mime === "image/webp") ext = ".webp";
      else if (mime === "image/gif") ext = ".gif";
      else ext = ".jpg";
    }
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploadFiler = multer({ storage: storage });

export { uploadFiler };
