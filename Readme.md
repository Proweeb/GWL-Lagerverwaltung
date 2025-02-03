# 📦 GW Lagerverwaltung App

## 🚀 Overview

The **GW Lagerverwaltung App** (`GWL`) is a **React Native Expo application** designed for **warehouse management**.

It allows users to:  
✅ **Scan Barcodes/QR Codes** 📷  
✅ **Add & Manage Inventory & Shelves** 🏷️  
✅ **Import & Export Data (Excel)** 📊  
✅ **Track Stock Movements** 🔄  
✅ **Smooth UI with Animations**

## 🛠️ Tech Stack & Libraries

| Feature                    | Library                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **State Management**       | [Zustand](https://github.com/pmndrs/zustand)                                                                                       |
| **Local Storage**          | [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)                                                                 |
| **Barcode/QR Scanning**    | [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera)                                               |
| **Date Formatting**        | [date-fns](https://date-fns.org/)                                                                                                  |
| **Excel Export/Import**    | [xlsx](https://github.com/SheetJS/sheetjs)                                                                                         |
| **File Handling**          | [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/)                                                          |
| **Animations**             | [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)                                             |
| **Sharing (Email Export)** | [expo-mail-composer](https://docs.expo.dev/versions/latest/sdk/mail-composer/)                                                     |
| **Gesture Handling**       | [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)                                      |
| **Testing**                | [Maestro](https://maestro.mobile.dev/) & [React Native Testing Library](https://github.com/callstack/react-native-testing-library) |

---

## 📂 Folder Structure

```sh
📦 GW-Lagerverwaltung # Main Project Folder (GitHub Repository)
├── 📂 GWL # Expo React Native App (Actual Codebase)
│   ├── 📂 src # Source Code
│   │   ├── 📂 layout # Navigation and Screens
│   │   ├── 📂 components # Reusable UI Components
│   │   ├── 📂 store # Zustand Global State Management
│   │   ├── 📂 utils # Helper Functions (File Handling, Date Formatting, etc.)
│   │   ├── 📜 App.js # Main App Entry
│   ├── 📜 app.json # Expo Config
│   ├── 📜 package.json # Dependencies & Scripts
│   ├── 📜 .gitignore # Git Ignore File
├── 📂 Assets # Images and Screenshots of App UI
├── 📂 Docs # Documentation
├── 📂 Other # Important but Unassignable Files (e.g., API Docs, Configs)
├── 📜 README.md # Overview of Repo
```

---

## 🛠️ Installation & Setup

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/YOUR_GITHUB/GW-Lagerverwaltung.git
cd GW-Lagerverwaltung/GWL
```

### 2️⃣ **Install Dependencies**

```sh
    npm install
```

### 3️⃣ **Start the Expo Development Server**

```sh
   npx expo start
```

### 4️⃣ **Run App on a Physical Device**
Set up Android Studio following the React Native Environment Setup Guide.

Enable Developer Mode on your device and connect it via USB 🔌.

Then, run the following command:

```sh
   npx expo run:android
```
