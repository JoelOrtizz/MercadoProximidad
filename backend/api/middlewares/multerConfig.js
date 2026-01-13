import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta en la raíz backend
    },
    filename: function (req, file, cb) {
        // Genera: fecha-nombreOriginal.jpg
        cb(null, Date.now() + '-' + file.originalname);
    }
});

export const upload = multer({ storage: storage });