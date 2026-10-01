<div align="center">

# 🧹 Vanisher: Auto Delete Browser History

**A modern, lightweight, and privacy-first Chrome extension that automatically cleans your browsing footprints on a schedule or on demand.**

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success?style=flat-square&logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Awadul-181717?style=flat-square&logo=github)](https://github.com/Awadul/Vanisher-Extension)
[![Patreon](https://img.shields.io/badge/Support-Awadul%20Labs-FF424D?style=flat-square&logo=patreon)](https://www.patreon.com/awadullabs)

---

</div>

## 📖 Overview

**Vanisher** is designed for users who value digital hygiene and absolute privacy. Unlike conventional cleanup tools that run heavy background processes or bundle intrusive trackers, Vanisher runs **100% offline and locally on your device**. 

Configuring your browser's cleanup schedule has never been simpler: set it once, and Vanisher quietly takes care of the rest using Chrome's native background service workers.

---

## ✨ Features

- 🕒 **Flexible Scheduled Cleaning**
  - **Quick Presets:** 15 Minutes, 1 Hour, 1 Day, or 1 Week.
  - **Precision Custom Schedule:** Pick custom durations spanning minutes (1–60), hours (1–24), days (1–7), weeks (1–4), or months (1–12).
- 🧹 **Granular Data Selection**  
  Select exactly what data types to delete:
  - 🌐 Browsing History
  - 📥 Download Records
  - ⚡ Cache & Cached Files
  - 🍪 Cookies
  - 💾 Local Storage
  - 🔑 Saved Passwords
  - 📝 Autofill Form Data
- ⚡ **Instant "Clear Now"**  
  Purge your selected browsing data immediately at any moment with a single click.
- 🎨 **Adaptive Dark & Light Theme**  
  Features a glassmorphic user interface with an instant **Sun/Moon theme toggle** and automatic operating system color scheme detection.
- 🔒 **Zero Telemetry & 100% Private**  
  No analytics, no telemetry, no remote servers, and zero remote code. Your data never leaves your computer.
- ⚡ **Manifest V3 Compliant**  
  Built strictly adhering to Google Chrome's latest security, memory, and performance standards.

---

## 🛠️ Architecture & Tech Stack

Vanisher is built using standard web technologies and native Chrome extension APIs:

- **Frontend UI (`popup.html` & `popup.js`):** Responsive layout with glassmorphic cards, custom CSS toggles, dynamic unit-clamped schedule selectors, and theme persistence.
- **Background Service Worker (`background.js`):** Runs on Chrome's event-driven MV3 service worker model, listening to `chrome.alarms` to execute cleanup routines without consuming idle system resources.
- **Native Browser APIs:**
  - `chrome.browsingData`: Securely purges browsing items within the chosen timeframe.
  - `chrome.alarms`: Handles scheduled periodic cleanup events reliably.
  - `chrome.storage.local`: Preserves user preferences and toggle states offline.
  - `chrome.tabs`: Opens support and feedback pages upon user request.

---

## 📦 Project Structure

```text
Auto-Job-Filling-Extension/
├── background.js       # Manifest V3 service worker (alarms & cleanup logic)
├── popup.html          # Extension popup UI (dark/light themes, controls)
├── popup.js            # State management, event handlers & unit validation
├── manifest.json       # Extension configuration, permissions & metadata
├── PRIVACY.md          # Full privacy policy & data transparency declaration
├── README.md           # Project documentation and developer guide
└── images/             # Extension icons (16px, 32px, 48px, 128px)
```

---

## 🚀 Installation & Development

### Method 1: Load as an Unpacked Extension (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Awadul/Vanisher-Extension.git
   ```
2. Open Google Chrome and navigate to:
   ```text
   chrome://extensions/
   ```
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the project root folder (`Vanisher-Extension`).
6. Pin **Vanisher** to your Chrome toolbar and click the icon to begin!

---

## 🔐 Permissions & Privacy

Vanisher requests only the absolute minimum permissions required to perform its duties:

| Permission | Purpose |
| :--- | :--- |
| `browsingData` | Allows erasing local browser history, cache, cookies, and other selected records. |
| `alarms` | Triggers periodic background alarms to automate cleanup without keeping the browser awake continuously. |
| `storage` | Saves your chosen options and schedule locally in your browser storage. |

For detailed information, please read our [Privacy Policy](PRIVACY.md).

---

## 🤝 Support & Feedback

If you find Vanisher useful, consider supporting continued open-source development:

- ☕ **Support on Patreon:** [Awadul Labs](https://www.patreon.com/awadullabs)
- 🐛 **Report a Bug:** [GitHub Issues](https://github.com/Awadul/Vanisher-Extension/issues)
- 💡 **Request a Feature:** [Submit Feature Request](https://github.com/Awadul/Vanisher-Extension/issues)

---

## 👨‍💻 Author

**Muhammad Awais Abdullah**
- **GitHub:** [@Awadul](https://github.com/Awadul)
- **Email:** [awaisabdullahm@gmail.com](mailto:awaisabdullahm@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free and open source for everyone.
