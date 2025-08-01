const multer = require('multer');
const path = require('path');

// إعداد مكان حفظ الصور واسم الملف
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // مجلد لحفظ الصور
  },
  filename: function (req, file, cb) {
    
    let dateNow=Date.now();
    // console.log(dateNow);
    
    const uniqueSuffix = dateNow + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // اسم فريد لكل صورة
  }
});

// فلتر لقبول الصور فقط
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
