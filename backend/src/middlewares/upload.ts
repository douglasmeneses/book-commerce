import Multer from "multer";

const storage = Multer.memoryStorage();

const upload = Multer({ storage });

export default upload;
