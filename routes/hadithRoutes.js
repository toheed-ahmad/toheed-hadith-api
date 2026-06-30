const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Hadith JSON فائل کا پاتھ لوڈ کرنا
const filePath = path.join(__dirname, '../data/hadith.json');
let hadithData = { title: "", language: "", chapters: [] };

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    hadithData = JSON.parse(rawData);
} catch (error) {
    console.error("Error reading hadith.json file:", error.message);
}

// 1. تمام چیپٹرز کی لسٹ حاصل کرنے کا اینڈپوائنٹ (بغیر احادیث کے ڈیٹا کے - لائٹ ویٹ رسپانس)
router.get('/chapters', (req, res) => {
    try {
        const chaptersList = hadithData.chapters.map(ch => ({
            id: ch.id,
            category: ch.category,
            chapter_id: ch.chapter_id,
            title: ch.title
        }));
        
        res.json({
            success: true,
            total_chapters: chaptersList.length,
            chapters: chaptersList
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// 2. کسی مخصوص چیپٹر کی تمام احادیث حاصل کرنا
router.get('/chapters/:id', (req, res) => {
    const chapterId = parseInt(req.params.id);
    const chapter = hadithData.chapters.find(ch => ch.id === chapterId);

    if (!chapter) {
        return res.status(404).json({ success: false, message: "Chapter not found" });
    }

    res.json({ success: true, chapter });
});

// 3. تمام احادیث کی لسٹ حاصل کرنا (بہترین سرچ، فلٹر اور پیجینیشن کے ساتھ)
router.get('/hadiths', (req, res) => {
    try {
        let allHadiths = [];
        
        // تمام چیپٹرز سے احادیث کو ایک فلیٹ ارے میں جمع کرنا
        hadithData.chapters.forEach(ch => {
            ch.hadiths.forEach(h => {
                allHadiths.push({
                    ...h,
                    chapter_title: ch.title
                });
            });
        });

        // --- فیچر 1: سرچ کوئیری (Search Query) ---
        // سرچ کو عربی، اردو، ہندی اور انگریزی ٹیکسٹ میں تلاش کرنے کے لیے متحرک بنایا گیا ہے
        const search = req.query.search ? req.query.search.toLowerCase().trim() : null;
        if (search) {
            allHadiths = allHadiths.filter(h => 
                (h.text.ar && h.text.ar.includes(search)) ||
                (h.text.ur && h.text.ur.toLowerCase().includes(search)) ||
                (h.text.hi && h.text.hi.toLowerCase().includes(search)) ||
                (h.text.en && h.text.en.toLowerCase().includes(search)) ||
                (h.title.ur && h.title.ur.toLowerCase().includes(search)) ||
                (h.title.en && h.title.en.toLowerCase().includes(search)) ||
                (h.reference.book && h.reference.book.toLowerCase().includes(search))
            );
        }

        // --- فیچر 2: کتاب کے نام سے فلٹر کرنا (e.g., ?book=صحيح البخاري) ---
        const book = req.query.book ? req.query.book.trim() : null;
        if (book) {
            allHadiths = allHadiths.filter(h => h.reference.book === book);
        }

        // --- فیچر 3: پیجینیشن (Pagination) ---
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedHadiths = allHadiths.slice(startIndex, endIndex);

        res.json({
            success: true,
            meta: {
                total_results: allHadiths.length,
                current_page: page,
                limit: limit,
                total_pages: Math.ceil(allHadiths.length / limit)
            },
            hadiths: paginatedHadiths
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// 4. آئی ڈی کے ذریعے مخصوص حدیث حاصل کرنا (e.g., /api/hadiths/5)
router.get('/hadiths/:id', (req, res) => {
    const hadithId = parseInt(req.params.id);
    let foundHadith = null;

    for (const ch of hadithData.chapters) {
        const match = ch.hadiths.find(h => h.id === hadithId);
        if (match) {
            foundHadith = { ...match, chapter_title: ch.title };
            break;
        }
    }

    if (!foundHadith) {
        return res.status(404).json({ success: false, message: "Hadith not found" });
    }

    res.json({ success: true, hadith: foundHadith });
});

module.exports = router;