import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// ES Modules میں __dirname سیٹ کرنے کے لیے
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ڈیٹا فولڈر کا راستہ
const DATA_DIR = path.join(__dirname, '../data');

/**
 * GET /api/meta
 * میٹا ڈیٹا (modules کی لسٹ) حاصل کرنے کے لیے
 */
router.get('/meta', async (req, res) => {
  try {
    const metaPath = path.join(DATA_DIR, 'meta', 'meta.json');
    const data = await fs.readFile(metaPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to load meta data. Ensure data/meta/meta.json exists." });
  }
});

/**
 * GET /api/hadiths/:lang/:module
 * مثال: /api/hadiths/ur/iman
 */
router.get('/hadiths/:lang/:module', async (req, res) => {
  const { lang, module } = req.params;

  // سیکیورٹی کے لیے ان پٹ کو صاف کرنا تاکہ کوئی ڈائریکٹری ٹریورسل نہ کر سکے
  const cleanLang = lang.replace(/[^a-z]/g, '');
  const cleanModule = module.replace(/[^a-z0-9_-]/g, '');

  const filePath = path.join(DATA_DIR, cleanLang, `${cleanModule}.json`);

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ 
        error: `Data not found for language '${cleanLang}' and module '${cleanModule}'` 
      });
    }
    res.status(500).json({ error: "Internal server error while reading data file." });
  }
});

export default router;