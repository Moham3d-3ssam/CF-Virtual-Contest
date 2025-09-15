# 🔍 Codeforces Custom Virtual Contest

A browser extension that allows you to create and manage custom virtual contests from Codeforces problems with progress tracking and performance insights.

---

## ✨ Features

### 📊 Contest Generation & Analytics
- **Customizable Contest Creation**: Set the contest duration (up to 3 hours, 59 minutes) and choose the number of problems (from 1 to 10).
- **Flexible Contest Types**:
    - **General**: Creates a contest with problems across various topics. The topic tags list is hidden when this type is selected.
    - **Topic-based**: Generates problems from a single, specific topic you select.
    - **Mixed**: Creates a contest with problems that match one or more of your selected topics.
- **Difficulty Filtering**: Choose from predefined difficulty ranges:
    - **Easy**: 800–1200 rating
    - **Medium**: 1300–1600 rating
    - **Hard**: 1700–2000 rating
    - **Very Hard**: 2100+ rating
    - Or select **General** for a broad range of difficulties (800+ rating).
- **Contest Timer with Alerts**: The countdown timer turns red with a heartbeat animation when less than 15 minutes remain in the contest, to alert you that time is running out.
- **Real-time Progress Tracking**: Automatically fetches your latest submissions from the Codeforces API to update contest status in real time.
- **Post-Contest Summary**: A dedicated results page provides a summary of your performance, including the number of solved problems and success rate.
- **Persistent Settings**: Your preferences for polling interval (defaulting to 60 seconds), adaptive difficulty, and avoiding duplicate problems are saved and can be managed in the options page.

<img width="447" height="471" alt="01" src="https://github.com/user-attachments/assets/be52418f-9438-493b-a40e-1ee111989432" />
<img width="466" height="752" alt="02" src="https://github.com/user-attachments/assets/dc2ac054-f179-4e87-8fc2-e8b1d06a0ebc" />
<img width="447" height="592" alt="03" src="https://github.com/user-attachments/assets/1480b6dc-6840-447e-ac04-0928cfd9ed12" />
<img width="445" height="442" alt="04" src="https://github.com/user-attachments/assets/2ff263b6-251e-44be-a138-13515363bc30" />

---

## 🚀 Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1.  **Download the Extension**
    * Download or clone all extension files (including `manifest.json`, `background.js`, `popup.html`, `popup.css`, `popup.js`, `options.html`, and the `icons` folder) into a single directory.

2.  **Open Chrome/Edge Extension Management**
    * Open your Chrome or Edge browser.
    * Navigate to `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge).
    * Enable "Developer mode" by toggling the switch in the top-right corner.

3.  **Load the Extension**
    * Click "Load unpacked".
    * Select the folder containing the extension files.
    * The extension should now appear in your extensions list.

4.  **Verify Installation**
    * A new icon will be visible in your browser's toolbar, with the name "CF Virtual Contest". Clicking it will open the contest popup.

### Method 2: Create Extension Package

*This method is for creating a distributable ZIP file.*
* Create a ZIP file containing all extension files and folders.
* Then, load the ZIP file through Chrome's extension management page.

---

## 🤝 Contributing

To contribute to this extension:
* Fork the repository.
* Make your changes.
* Test thoroughly.
* Submit a pull request.

---

## 🙋‍♂️ Support

If you encounter any issues:
* Check the troubleshooting section in the developer console (F12) for errors.
* Try reloading the extension temporarily.
* Ensure you have the latest version.

---

**Made with ❤️ for the Codeforces community**

*This extension helps competitive programmers track their progress and identify areas for improvement.*
