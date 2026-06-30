const express = require('express');
const cors = require('cors');
const hadithRoutes = require('./routes/hadithRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// مڈل وئیرز (Middlewares)
app.use(cors()); // کراس اوریجن ریسورس شیئرنگ کی اجازت دینے کے لیے
app.use(express.json()); // JSON ڈیٹا پارس کرنے کے لیے

// روٹس کی میپنگ (Routes Mapping)
app.use('/api', hadithRoutes);

// ڈیفالٹ روٹ (ہوم پیج)
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Selected Hadith Multilingual API",
        version: "1.0.0",
        endpoints: {
            all_chapters: "/api/chapters",
            single_chapter: "/api/chapters/:id",
            all_hadiths_with_filters: "/api/hadiths?page=1&limit=5&search=ایمان",
            single_hadith: "/api/hadiths/:id"
        }
    });
});

// گلوبل ایرر ہینڈلر (Global Error Handler)
app.use((req, res) => {
    res.status(404).json({ success: false, message: "API endpoint not found" });
});

// سرور کو لائیو کرنا
app.listen(PORT, () => {
    console.log(`🚀 Server is running smoothly on http://localhost:${PORT}`);
});