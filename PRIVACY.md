# Privacy Policy for Vanisher: Auto Delete Browser History

**Last Updated:** September 28, 2026

**Vanisher: Auto Delete Browser History** ("Vanisher", "the Extension") is developed by **Muhammad Awais Abdullah** ("Awadul"). We believe in absolute digital privacy. This Privacy Policy outlines our strict commitment to zero data collection.

---

### 1. Zero Data Collection
Vanisher **does not collect, track, store, transmit, or sell** any of your personal information, browsing history, form inputs, credentials, or diagnostic data.

### 2. Local-Only Execution
All functions and operations performed by Vanisher take place **entirely and exclusively on your local device**:
- Cleanup operations (erasing cache, cookies, browsing history, download logs, form data, passwords, and local storage) are executed locally via Google Chrome's native `chrome.browsingData` API.
- Your preferences (such as selected schedules and toggle states) are stored locally on your device via Chrome's `chrome.storage.local` API and are never transmitted to any external server.
- The extension contains **zero remote code, zero external scripts, zero analytics, and zero advertising trackers**.

### 3. Permissions Explanation
Vanisher requests only the minimum permissions necessary to perform its advertised single purpose:
- **`browsingData`**: Allows the extension to purge local browsing records (history, cache, cookies, etc.) based on your chosen settings and schedule. The extension cannot and does not read, inspect, or export your browsing content.
- **`alarms`**: Allows Chrome's internal alarm manager to wake the background service worker on your defined schedule to execute automated cleanups.
- **`storage`**: Saves your chosen settings (such as time intervals and which data categories to delete) locally inside your browser.

### 4. Third-Party Services
Vanisher does not integrate with any third-party APIs, analytics platforms, or external servers. No data is ever shared with third parties.

### 5. Open Source Transparency
Vanisher is an open-source project. You can inspect the entire source code at any time on GitHub:
https://github.com/Awadul/Vanisher-Extension

### 6. Contact
If you have any questions or feedback regarding this Privacy Policy, please open an issue on GitHub or contact:
- **Developer:** Muhammad Awais Abdullah (Awadul)
- **Email:** awaisabdullahm@gmail.com
- **Repository:** https://github.com/Awadul/Vanisher-Extension
