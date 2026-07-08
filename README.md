# Toheed Hadith API (`یاد الٰہی`)

A clean, light-weight, and dynamic multilingual Hadith API built with Node.js and Express. It serves Hadith data across multiple languages including Arabic, English, Hindi, and Urdu.

## 📂 Project Structure

```text
toheed-hadith-api/
├── data/
│   ├── ar/ (Arabic)
│   │   ├── iman.json
│   │   ├── salah.json
│   │   └── akhlaq.json
│   ├── en/ (English)
│   │   ├── ...
│   ├── hi/ (Hindi)
│   │   ├── ...
│   ├── ur/ (Urdu)
│   │   └── ...
│   └── meta/
│       └── meta.json
├── routes/
│   └── hadith.js
├── package.json
├── README.md
└── server.js