import multer from "multer";

import fs from "fs";

console.log("--- Multer middleware file is loading ---"); 

const uploadDir = "./public/temp";

if (!fs.existsSync(uploadDir)) {
  console.log(`Creating directory: ${uploadDir}`); 
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer destination function called."); 
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });