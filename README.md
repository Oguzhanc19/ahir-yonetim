<div align="center">
  <h1>🏢 Ahir Yönetim PWA</h1>
  <p><i>Firebase-Powered Comprehensive Farm & Livestock Management System<br>Firebase Destekli Kapsamlı Çiftlik ve Hayvancılık Yönetim Sistemi</i></p>

  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
  ![PWA](https://img.shields.io/badge/PWA-Supported-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
</div>

<br>

## 🇬🇧 English

**Ahir Yönetim** ("Kapaklı Mert Besi") is a robust, full-fledged farm and livestock management system built as a **Progressive Web App (PWA)**. Designed using Vanilla JavaScript and Firebase Realtime Database, it completely digitizes traditional farming operations without the overhead of heavy frontend frameworks.

### 🧠 Code Architecture & Logic
- **State Management**: The application handles a complex state (`appData`) natively. It syncs real-time with **Firebase Realtime Database** and falls back to `localStorage` to ensure zero data loss during offline periods.
- **Modular Data Tracking**: The system tracks multiple distinct entities:
  - `animals` (Livestock inventory)
  - `sales` & `kurbanlikCikti` (Financial tracking and specific event sales)
  - `feedPurchases` & `feedRations` (Inventory management for animal feed)
  - `vetExpenses`, `vaccines`, `pregnancies` (Comprehensive health & breeding tracking)
- **PWA Capabilities**: Service workers (`sw.js`) cache static assets (`index.html`, `style.css`), allowing the application to be installed on mobile devices and function completely offline.

### ✨ Features
- 🔄 Real-time database synchronization via Firebase.
- 📱 Desktop & Mobile installable (PWA).
- 💰 Advanced financial tracking (Veterinary expenses, shepherd salaries, feed costs).
- 🏥 Breeding & Health schedule (Pregnancy tracking, vaccine calendars).

---

## 🇹🇷 Türkçe

**Ahir Yönetim** ("Kapaklı Mert Besi"), geleneksel hayvancılık ve çiftlik operasyonlarını tamamen dijitalleştiren, **Progresif Web Uygulaması (PWA)** standartlarında geliştirilmiş kapsamlı bir yönetim sistemidir. Ağır framework'ler yerine tamamen Vanilla JavaScript ve Firebase kullanılarak yüksek performans hedeflenmiştir.

### 🧠 Kod Mimarisi ve Mantığı
- **Durum (State) Yönetimi**: Uygulama karmaşık veri yapısını (`appData`) yerel olarak işler. **Firebase Realtime Database** ile anlık senkronizasyon yaparken, internet bağlantısı koptuğunda veri kaybını önlemek için otomatik olarak `localStorage` yedeğine (fallback) geçer.
- **Modüler Veri Takibi**: Sistem birçok farklı varlığı birbiriyle ilişkili olarak takip eder:
  - `animals` (Hayvan envanteri ve küpe no takibi)
  - `sales` & `kurbanlikCikti` (Finansal satışlar ve Kurban Bayramı'na özel satış modülleri)
  - `feedPurchases` & `feedRations` (Yem stoğu ve hayvanlara verilen rasyonların takibi)
  - `vetExpenses`, `vaccines`, `pregnancies` (Detaylı sağlık, aşı takvimi ve gebelik süreçleri)
- **PWA Özellikleri**: `sw.js` (Service Worker) dosyası sayesinde uygulama çevrimdışı çalışabilir, telefona veya bilgisayara bir mobil uygulama gibi yüklenebilir.

### ✨ Özellikler
- 🔄 Firebase ile anlık ve eşzamanlı veritabanı senkronizasyonu.
- 📱 Çevrimdışı çalışabilme ve cihazlara yüklenebilme (PWA).
- 💰 İleri düzey finansal takip (Veteriner giderleri, çoban maaşları, yem maliyetleri).
- 🏥 Üreme ve Sağlık takvimi (Aşı günleri, gebelik ultrason tarihleri).
