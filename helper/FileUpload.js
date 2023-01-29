const multer = require("multer");

const Mime_Type = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      const ext = Mime_Type[file.mimetype];
      cb(null, Date.now() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = Mime_Type[file.mimetype];
    const error = isValid ? null : new Error("invalid mimetype");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
