# Illustrator Insert Page Numbers Script

This Adobe Illustrator script automatically inserts page numbers across multiple artboards.  
It provides flexible options for formatting, placement, and numbering style.

Thanks for CarlosCanto (https://community.adobe.com/t5/illustrator-discussions/introducing-insert-page-numbers-v-2/td-p/4185670). I am able to modify it to simplifies my personal needs.

## ✨ Features
- This script will create a new modifiable new layer.
- Select a range of artboards (start & end).
- Override the starting number (`Start From` option).
- Choose number format (`1, 2, 3...` or `01, 02, 03...`).
- Set margins in **inches, mm, points, or pixels** (default: mm).
- Adjust text size and alignment (Left, Center, Right).
- Different placement for **odd and even pages** (top/bottom, left/center/right).
- Live preview of footer text with placeholders.
- Placeholders supported:
  - `*page*` → current page number
  - `*pages*` → total pages in range
  - `*fname*` → full file path
  - `*file*` → filename only
- Option to overwrite existing page numbers.

## 🚀 Installation
1. Download the script file:
2. Copy it to your Illustrator scripts folder:
- **Windows:**  
  `C:\Program Files\Adobe\Adobe Illustrator <version>\Presets\en_US\Scripts\`
- **Mac:**  
  `/Applications/Adobe Illustrator <version>/Presets/en_US/Scripts/`
3. Restart Illustrator.
4. Or alternatively, you can drag the script to your current active Illustrator window.

## ▶️ Usage
1. Open your Illustrator document with multiple artboards.
2. Go to **File > Scripts > Insert Page Numbers**.
3. Configure options in the dialog:
- Choose artboard range
- Set starting number and format
- Adjust margins, text size, and alignment
- Configure odd/even placement
4. Click **OK** – page numbers will be added to a new layer named **Page Numbers**.

## 📌 Notes
- Page numbers are placed in a dedicated layer: **Page Numbers**.
- If **Overwrite existing** is enabled, all previous numbers in that layer will be removed.
- Supports both print and digital layouts.

## 📝 License
MIT License. Free to use and modify.

---

💡 Contributions welcome! Feel free to fork, open issues, or submit PRs.
