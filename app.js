// ==========================================
// ALİ AHIR - AHIR YÖNETİM SİSTEMİ
// Tam Uygulama Mantığı (app.js)
// ==========================================

// ==========================================
// STATE MANAGEMENT & FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCIA3E8IRO61O9rBiJjQCuW4k5N8HdBJfI",
  authDomain: "aliahir.firebaseapp.com",
  databaseURL: "https://aliahir-default-rtdb.firebaseio.com",
  projectId: "aliahir",
  storageBucket: "aliahir.firebasestorage.app",
  messagingSenderId: "248719577025",
  appId: "1:248719577025:web:4be5fd6614fd166d026940"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

let appData = {};
let isFirstLoad = true;

function loadData() {
  db.ref('ahirData').on('value', function(snapshot) {
    var data = snapshot.val();
    if (data) {
      appData = data;
      // Eksik alanları varsayılan veriden tamamla
      if (!appData.animals) appData.animals = [];
      if (!appData.sales) appData.sales = [];
      if (!appData.feedPurchases) appData.feedPurchases = [];
      if (!appData.vetExpenses) appData.vetExpenses = [];
      if (!appData.kurbanlikCikti) appData.kurbanlikCikti = [];
      if (!appData.todos) appData.todos = [];
      if (!appData.users) {
        appData.users = JSON.parse(JSON.stringify(DEFAULT_DATA.users));
      }
      if (!appData.shepherds) appData.shepherds = [];
      if (!appData.shepherdExpenses) appData.shepherdExpenses = [];
      if (!appData.vaccines) appData.vaccines = [];
      if (!appData.pregnancies) appData.pregnancies = [];

      // Local storage backup
      localStorage.setItem('ahirYonetimData', JSON.stringify(appData));

      // Re-render UI
      renderAnimalTable();
      renderCustomerTable();
      renderSalesTable();
      renderFeedTable();
      renderVetTable();
      renderAdminTable();
      renderCobanList();
      renderCobanGiderList();
      renderVaccineList();
      renderPregnancyList();
      updateReport();

      if (isFirstLoad) {
        initializeApp();
      }
      isFirstLoad = false;
      // Firebase boşsa localstorage'dan veya varsayılandan al
      const saved = localStorage.getItem('ahirYonetimData');
      if (saved) {
        appData = JSON.parse(saved);
      } else {
        appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
      
      // İlk yükleme rutini (UI render ve yedekleme kontrolü)
      renderAnimalTable();
      renderCustomerTable();
      renderSalesTable();
      renderFeedTable();
      renderVetTable();
      renderAdminTable();
      renderCobanList();
      renderCobanGiderList();
      renderVaccineList();
      renderPregnancyList();
      updateReport();

      if (isFirstLoad) {
        initializeApp();
      }
      isFirstLoad = false;
      saveData(); // Push to Firebase
    }
  });
}

function saveData() {
  const role = localStorage.getItem('ahirUserRole');
  if (role === 'guest') {
    showToast('Misafir hesaplar değişiklik yapamaz!', 'error');
    return;
  }

  try {
    db.ref('ahirData').set(appData);
    localStorage.setItem('ahirYonetimData', JSON.stringify(appData));
  } catch (err) {
    console.error('Veri kaydedilirken hata:', err);
    showToast('Bulut sunucuya bağlanılamadı! Sadece cihaza kaydedildi.', 'error');
  }
}

// ==========================================
// NAVIGATION (replaces all SayfayaGit_* macros)
// ==========================================
function navigateTo(sectionId, updateHistory) {
  if (updateHistory !== false) {
    history.pushState({ sectionId: sectionId }, '', '#' + sectionId);
  }

  // Tüm bölümleri gizle, hedefi göster
  document.querySelectorAll('.section').forEach(function(s) {
    s.classList.remove('active');
  });
  var targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Navigasyonu güncelle
  document.querySelectorAll('.nav-item').forEach(function(n) {
    n.classList.remove('active');
  });
  var navItem = document.querySelector('.nav-item[data-section="' + sectionId + '"]');
  if (navItem) {
    navItem.classList.add('active');
  }

  // Mobil sidebar kapat
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.querySelector('.overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');

  // Bölüm verilerini yenile
  refreshSection(sectionId);

  // Mobil başlık güncelle
  var title = navItem ? (navItem.querySelector('.nav-text')?.textContent || '') : '';
  var mobileTitle = document.querySelector('.mobile-title');
  if (mobileTitle && title) {
    mobileTitle.textContent = title;
  }
}

// Initial history state and popstate listener for back button handling
window.addEventListener('load', function() {
  history.replaceState({ sectionId: 'section-dashboard' }, '', '#section-dashboard');
});

window.addEventListener('popstate', function(event) {
  var sidebar = document.querySelector('.sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    var overlay = document.querySelector('.overlay');
    if (overlay) overlay.classList.remove('active');
  }

  var editModal = document.getElementById('edit-modal');
  if (editModal && editModal.classList.contains('show')) {
    closeEditModal(true);
  }

  if (event.state && event.state.sectionId) {
    navigateTo(event.state.sectionId, false);
  } else if (!event.state || (!event.state.modal && !event.state.sidebar)) {
    navigateTo('section-dashboard', false);
  }
});

function toggleSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.querySelector('.overlay');
  if (sidebar && !sidebar.classList.contains('open')) {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    history.pushState({ sidebar: true }, '', location.hash);
  } else {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    if (history.state && history.state.sidebar) {
      history.back();
    }
  }
}

function refreshSection(sectionId) {
  switch (sectionId) {
    case 'section-dashboard':
      updateDashboard();
      break;
    case 'section-hayvan-listesi':
      renderAnimalTable();
      break;
    case 'section-kurbanlik-satisi':
      renderSalesTable();
      break;
    case 'section-yem-veri':
      renderFeedTable();
      break;
    case 'section-veteriner-veri':
      renderVetTable();
      break;
    case 'section-kurbanlik-cikti':
      renderKurbanlikCiktiTable();
      break;
    case 'section-coban':
      renderCobanList();
      renderCobanGiderList();
      break;
    case 'section-rapor':
      updateReport();
      break;
    case 'section-musteri-listesi':
      renderCustomerTable();
      break;
    case 'section-admin':
      renderAdminTable();
      break;
    default:
      break;
  }
}

function logout() {
  if(confirm("Sistemden çıkış yapmak istediğinize emin misiniz?")) {
    localStorage.removeItem('ahirSessionActive');
    localStorage.removeItem('ahirCurrentUser');
    window.location.reload();
  }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type) {
  if (!type) type = 'success';
  var container = document.getElementById('toast-container');
  if (!container) return;

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  var icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  var icon = icons[type] || 'ℹ️';

  toast.innerHTML = '<span>' + icon + '</span><span>' + message + '</span>';
  container.appendChild(toast);

  setTimeout(function() {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(function() {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// ==========================================
// HAYVAN EKLE (replaces HayvanEkle VBA macro)
// ==========================================
function addAnimal() {
  var kupeNo = (document.getElementById('he-kupe')?.value || '').trim();
  var irk = document.getElementById('he-irk')?.value || '';
  var padok = document.getElementById('he-padok')?.value || '';
  var cinsiyet = document.getElementById('he-cinsiyet')?.value || '';
  var alisTarihi = document.getElementById('he-tarih')?.value || '';
  var dogumTarihi = document.getElementById('he-dogum')?.value || '';
  var kilo = parseFloat(document.getElementById('he-kilo')?.value) || 0;
  var alisFiyati = parseFloat(document.getElementById('he-fiyat')?.value) || 0;
  var durum = document.getElementById('he-durum')?.value || '';
  var aciklama = document.getElementById('he-aciklama')?.value || '';
  
  var fotoSrc = document.getElementById('he-foto-preview')?.src || '';
  var fotoData = (fotoSrc.startsWith('data:image') && document.getElementById('he-foto-preview').style.display !== 'none') ? fotoSrc : null;

  // Doğrulama
  if (!kupeNo) {
    showToast('Lütfen Küpe Numarası giriniz!', 'error');
    return;
  }

  if (!irk) {
    showToast('Lütfen ırk seçiniz!', 'error');
    return;
  }

  if (!padok) {
    showToast('Lütfen padok seçiniz!', 'error');
    return;
  }

  if (!cinsiyet) {
    showToast('Lütfen cinsiyet seçiniz!', 'error');
    return;
  }

  // Mükerrer kontrolü (duplicate check from VBA)
  var duplicate = appData.animals.find(function(a) {
    return a.kupeNo === kupeNo;
  });
  if (duplicate) {
    showToast('Bu küpe numarası (' + kupeNo + ') zaten kayıtlı!', 'error');
    return;
  }

  appData.animals.push({
    kupeNo: kupeNo,
    irk: irk,
    padok: padok,
    cinsiyet: cinsiyet,
    alisTarihi: alisTarihi,
    dogumTarihi: dogumTarihi,
    kilo: kilo,
    durum: durum,
    satisDurumu: 'STOKTA',
    alisFiyati: alisFiyati,
    aciklama: aciklama,
    foto: fotoData
  });

  saveData();
  showToast(kupeNo + ' numaralı hayvan başarıyla eklendi.');

  // Formu temizle
  document.getElementById('he-kupe').value = '';
  document.getElementById('he-irk').value = 'SİMENTAL';
  document.getElementById('he-padok').value = 'PADOK 1';
  document.getElementById('he-cinsiyet').value = 'ERKEK';
  document.getElementById('he-alis-tarihi').value = getTodayStr();
  document.getElementById('he-dogum-tarihi').value = '';
  document.getElementById('he-kilo').value = '';
  document.getElementById('he-alis-fiyati').value = '';
  document.getElementById('he-durum').value = 'BESİ';
  document.getElementById('he-aciklama').value = '';
  
  if (document.getElementById('he-foto')) document.getElementById('he-foto').value = '';
  if (document.getElementById('he-foto-preview')) {
    document.getElementById('he-foto-preview').src = '';
    document.getElementById('he-foto-preview').style.display = 'none';
  }
  if (document.getElementById('he-foto-remove')) {
    document.getElementById('he-foto-remove').style.display = 'none';
  }

  var form = document.getElementById('form-hayvan-ekle');
  if (form) form.reset();

  // Bugünün tarihini tekrar ayarla
  var heTarih = document.getElementById('he-tarih');
  if (heTarih) heTarih.value = getTodayStr();
}

// ==========================================
// SATIŞ YAP (replaces SatisYap VBA macro)
// ==========================================
function makeSale() {
  var musteriAdi = (document.getElementById('se-musteri')?.value || '').trim();
  var musteriTel = (document.getElementById('se-telefon')?.value || '').trim();
  var kupeNo = (document.getElementById('se-kupe')?.value || '').trim();
  var tahminiKilo = parseFloat(document.getElementById('se-kilo')?.value) || 0;
  var satisFiyati = parseFloat(document.getElementById('se-fiyat')?.value) || 0;
  var alinanToplam = parseFloat(document.getElementById('se-alinan')?.value) || 0;
  var hisseAdedi = parseInt(document.getElementById('se-hisse')?.value) || 0;

  // Doğrulama
  if (!kupeNo) {
    showToast('Lütfen Küpe No giriniz!', 'error');
    return;
  }

  if (!musteriAdi) {
    showToast('Lütfen Müşteri Adı giriniz!', 'error');
    return;
  }

  if (satisFiyati <= 0) {
    showToast('Lütfen geçerli bir Satış Fiyatı giriniz!', 'error');
    return;
  }

  var animal = appData.animals.find(function(a) {
    return a.kupeNo === kupeNo;
  });

  if (!animal) {
    showToast('Küpe No bulunamadı! Lütfen geçerli bir küpe numarası giriniz.', 'error');
    return;
  }

  if (animal.satisDurumu === 'SATILDI') {
    showToast('Bu hayvan zaten satılmış!', 'error');
    return;
  }

  // Maliyet hesaplamaları (from VBA SatisYap)
  var toplamHayvan = appData.animals.length;
  var birimYemGideri = 0;
  var birimVetGideri = 0;

  if (toplamHayvan > 0) {
    var toplamYem = appData.feedPurchases.reduce(function(sum, f) {
      return sum + (f.odenenFiyat || 0);
    }, 0);
    var toplamVet = appData.vetExpenses.reduce(function(sum, v) {
      return sum + (v.toplamFiyat || 0);
    }, 0);
    birimYemGideri = toplamYem / toplamHayvan;
    birimVetGideri = toplamVet / toplamHayvan;
  }

  var satisTuru = hisseAdedi > 0 ? (hisseAdedi + ' Hisse') : 'TAM SATIŞ';
  var toplamMaliyet = (animal.alisFiyati || 0) + birimYemGideri + birimVetGideri;
  var kalan = satisFiyati > 0 && animal.alisFiyati > 0 ? satisFiyati - animal.alisFiyati : 0;
  var karYuzdesi = satisFiyati > 0 && animal.alisFiyati > 0 ? (satisFiyati - animal.alisFiyati) / satisFiyati : 0;

  // Satış kaydı ekle
  appData.sales.push({
    kupeNo: kupeNo,
    musteriAdi: musteriAdi,
    musteriTel: musteriTel,
    irk: animal.irk,
    padok: animal.padok,
    cinsiyet: animal.cinsiyet,
    satisTuru: satisTuru,
    tahminiKilo: tahminiKilo,
    alisFiyati: animal.alisFiyati,
    vetGideri: birimVetGideri,
    yemGideri: birimYemGideri,
    satisFiyati: satisFiyati,
    alinanToplam: alinanToplam,
    kalan: kalan,
    karYuzdesi: karYuzdesi
  });

  // Hayvan durumunu güncelle
  if (hisseAdedi > 0) {
    animal.satisDurumu = 'Hisseli Satış';
  } else {
    animal.satisDurumu = 'SATILDI';
  }

  saveData();
  showToast('Satış ve tüm maliyetler başarıyla aktarıldı.');

  // Formu temizle
  var form = document.getElementById('form-satis-ekle');
  if (form) form.reset();
}

// ==========================================
// YEM ALIM KAYDET (replaces YemAlimKaydet VBA)
// ==========================================
function addFeedPurchase() {
  var yemMarkasi = (document.getElementById('ye-marka')?.value || '').trim();
  var yemTuru = (document.getElementById('ye-tur')?.value || '').trim();
  var birimFiyati = parseFloat(document.getElementById('ye-birim')?.value) || 0;
  var adeti = parseFloat(document.getElementById('ye-adet')?.value) || 0;
  var alimTarihi = document.getElementById('ye-tarih')?.value || '';

  // Doğrulama
  if (!yemMarkasi) {
    showToast('Lütfen Yem Markası giriniz!', 'error');
    return;
  }

  if (birimFiyati <= 0) {
    showToast('Lütfen geçerli bir Birim Fiyatı giriniz!', 'error');
    return;
  }

  if (adeti <= 0) {
    showToast('Lütfen geçerli bir Adet giriniz!', 'error');
    return;
  }

  var toplamFiyat = birimFiyati * adeti;

  appData.feedPurchases.push({
    yemMarkasi: yemMarkasi,
    yemTuru: yemTuru,
    alimTarihi: alimTarihi,
    birimFiyati: birimFiyati,
    adeti: adeti,
    odenenFiyat: toplamFiyat,
    toplamFiyat: toplamFiyat
  });

  saveData();
  showToast(yemMarkasi + ' kaydı başarıyla eklendi.');

  // Formu temizle
  var form = document.getElementById('form-yem-ekle');
  if (form) form.reset();

  // Bugünün tarihini tekrar ayarla
  var yeTarih = document.getElementById('ye-tarih');
  if (yeTarih) yeTarih.value = getTodayStr();

  updateYemToplam();
  distributeCosts(); // Otomatik maliyet dağıtımı (VBA OtomatikMaliyetDagit)
}

// ==========================================
// VETERİNER GİDERİ EKLE (replaces VeterinerGideriEkle VBA)
// ==========================================
function addVetExpense() {
  var veterinerAdi = (document.getElementById('ve-ad')?.value || '').trim();
  var alinanIlac = (document.getElementById('ve-ilac')?.value || '').trim();
  var adeti = parseFloat(document.getElementById('ve-adet')?.value) || 0;
  var birimFiyati = parseFloat(document.getElementById('ve-birim')?.value) || 0;
  var veterinerHizmeti = parseFloat(document.getElementById('ve-hizmet')?.value) || 0;

  // Doğrulama
  if (!alinanIlac) {
    showToast('Lütfen İlaç Adı giriniz!', 'error');
    return;
  }

  if (birimFiyati <= 0) {
    showToast('Lütfen geçerli bir Birim Fiyatı giriniz!', 'error');
    return;
  }

  // Toplam = (Adet * BirimFiyat) + VeterinerHizmeti (B5*B6+B7 formula)
  var toplamFiyat = (adeti * birimFiyati) + veterinerHizmeti;

  appData.vetExpenses.push({
    veterinerAdi: veterinerAdi,
    alinanIlac: alinanIlac,
    adeti: adeti,
    birimFiyati: birimFiyati,
    veterinerHizmeti: veterinerHizmeti,
    toplamFiyat: toplamFiyat
  });

  saveData();
  showToast('Veteriner gideri başarıyla kaydedildi.');

  // Formu temizle
  var form = document.getElementById('form-vet-ekle');
  if (form) form.reset();

  updateVetToplam();
  distributeCosts(); // Otomatik maliyet dağıtımı
}

// ==========================================
// COST DISTRIBUTION (replaces YemMaliyetiniDagit & OtomatikMaliyetDagit VBA)
// ==========================================
function distributeCosts() {
  var toplamHayvan = appData.animals.length;
  if (toplamHayvan <= 0) return;

  var toplamYem = appData.feedPurchases.reduce(function(sum, f) {
    return sum + (f.odenenFiyat || 0);
  }, 0);

  var toplamVet = appData.vetExpenses.reduce(function(sum, v) {
    return sum + (v.toplamFiyat || 0);
  }, 0);

  var birimYemGideri = toplamYem / toplamHayvan;
  var birimVetGideri = toplamVet / toplamHayvan;

  // Tüm satış kayıtlarını hayvan başı maliyetlerle güncelle
  appData.sales.forEach(function(sale) {
    sale.yemGideri = parseFloat(birimYemGideri.toFixed(2));
    sale.vetGideri = parseFloat(birimVetGideri.toFixed(2));
  });

  saveData();
}

// ==========================================
// SEARCH FUNCTIONS (replaces Worksheet_Change events)
// ==========================================
function searchAnimal() {
  var kupeNo = (document.getElementById('ha-kupe')?.value || '').trim();
  var resultDiv = document.getElementById('ha-result');
  if (!resultDiv) return;

  if (!kupeNo) {
    resultDiv.classList.add('hidden');
    return;
  }

  var animal = appData.animals.find(function(a) {
    return a.kupeNo === kupeNo;
  });

  resultDiv.classList.remove('hidden');

  if (animal) {
    var salesHtml = getSalesHtml(kupeNo);
    var fotoHtml = animal.foto ? '<div style="text-align:center; margin-bottom:15px;"><img src="' + animal.foto + '" style="max-width:200px; max-height:200px; border-radius:8px; object-fit:cover; box-shadow:0 2px 8px rgba(0,0,0,0.2);"></div>' : '';
    resultDiv.innerHTML =
      '<div class="card">' +
        '<div class="card-header">🐄 Hayvan Bilgileri - ' + escapeHtml(animal.kupeNo) + '</div>' +
        fotoHtml +
        '<div class="result-grid">' +
          '<div class="result-item"><span class="result-label">Irk</span><span class="result-value">' + escapeHtml(animal.irk) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Cinsiyet</span><span class="result-value">' + escapeHtml(animal.cinsiyet) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Alış Tarihi</span><span class="result-value">' + formatDate(animal.alisTarihi) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Doğum Tarihi</span><span class="result-value">' + (formatDate(animal.dogumTarihi) || '-') + '</span></div>' +
          '<div class="result-item"><span class="result-label">Durum</span><span class="result-value">' + (animal.durum || '-') + '</span></div>' +
          '<div class="result-item"><span class="result-label">Padok</span><span class="result-value">' + escapeHtml(animal.padok) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Kilo</span><span class="result-value">' + animal.kilo + ' kg</span></div>' +
          '<div class="result-item"><span class="result-label">Alış Fiyatı</span><span class="result-value">' + formatMoney(animal.alisFiyati) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Satış Durumu</span><span class="result-value">' + getBadge(animal.satisDurumu) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Açıklama</span><span class="result-value">' + (escapeHtml(animal.aciklama) || '-') + '</span></div>' +
        '</div>' +
        salesHtml +
      '</div>';
  } else {
    resultDiv.innerHTML = '<div class="card"><p class="text-danger">❌ Küpe numarası bulunamadı!</p></div>';
  }
}

function getSalesHtml(kupeNo) {
  var sales = appData.sales.filter(function(s) { return s.kupeNo === kupeNo; });
  var kCikti = (appData.kurbanlikCikti || []).filter(function(k) { return k.kupeNo === kupeNo; });

  if (sales.length === 0 && kCikti.length === 0) return '';

  var isHisseli = sales.some(function(s) { return s.satisTuru && s.satisTuru.includes('Hisse'); }) || kCikti.length > 0;
  
  if (sales.length > 1 || isHisseli) {
    var html = '<div class="mt-3"><h3 class="card-header" style="font-size:1em; margin-bottom:8px;">Hissedar Listesi</h3>';
    html += '<div style="overflow-x:auto;"><table class="data-table" style="font-size: 0.85em;">';
    html += '<thead><tr><th>Müşteri</th><th>Pay</th><th>Satış F.</th><th>Alınan</th><th>Kalan</th></tr></thead><tbody>';
    
    kCikti.forEach(function(k) {
      var sFiyat = parseFloat(k.satisFiyati) || 0;
      var aUcret = parseFloat(k.alinanUcret) || 0;
      var kalan = sFiyat - aUcret;
      html += '<tr>';
      html += '<td data-label="Müşteri">' + escapeHtml(k.musteriAdi) + '</td>';
      html += '<td data-label="Pay">1</td>';
      html += '<td data-label="Satış F.">' + formatMoney(sFiyat) + '</td>';
      html += '<td data-label="Alınan">' + formatMoney(aUcret) + '</td>';
      html += '<td data-label="Kalan">' + formatMoney(kalan) + '</td>';
      html += '</tr>';
    });

    sales.forEach(function(s) {
      var sFiyat = parseFloat(s.satisFiyati) || 0;
      var aUcret = parseFloat(s.alinanToplam) || 0;
      var kalan = sFiyat - aUcret;
      html += '<tr>';
      html += '<td data-label="Müşteri">' + escapeHtml(s.musteriAdi) + '</td>';
      html += '<td data-label="Pay">' + escapeHtml(s.satisTuru) + '</td>';
      html += '<td data-label="Satış F.">' + formatMoney(sFiyat) + '</td>';
      html += '<td data-label="Alınan">' + formatMoney(aUcret) + '</td>';
      html += '<td data-label="Kalan">' + formatMoney(kalan) + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div></div>';
    return html;
  } else {
    var s = sales[0] || kCikti[0];
    var sFiyat = parseFloat(s.satisFiyati) || 0;
    var aUcret = parseFloat(s.alinanToplam || s.alinanUcret) || 0;
    
    var html = '<div class="mt-3"><h3 class="card-header" style="font-size:1em; margin-bottom:8px;">Satış Detayı</h3>';
    html += '<div class="result-grid">';
    html += '<div class="result-item"><span class="result-label">Müşteri</span><span class="result-value">' + escapeHtml(s.musteriAdi) + '</span></div>';
    html += '<div class="result-item"><span class="result-label">Satış Fiyatı</span><span class="result-value">' + formatMoney(sFiyat) + '</span></div>';
    html += '<div class="result-item"><span class="result-label">Alınan Ücret</span><span class="result-value">' + formatMoney(aUcret) + '</span></div>';
    html += '</div></div>';
    return html;
  }
}

function searchKurbanlik() {
  var kupeNo = (document.getElementById('ka-kupe')?.value || '').trim();
  var resultDiv = document.getElementById('ka-result');
  if (!resultDiv) return;

  if (!kupeNo) {
    resultDiv.classList.add('hidden');
    return;
  }

  var sale = appData.sales.find(function(s) {
    return s.kupeNo === kupeNo;
  });
  var animal = appData.animals.find(function(a) {
    return a.kupeNo === kupeNo;
  });

  resultDiv.classList.remove('hidden');

  if (animal || sale) {
    var data = animal || sale;
    var salesHtml = getSalesHtml(kupeNo);
    var fotoHtml = (animal && animal.foto) ? '<div style="text-align:center; margin-bottom:15px;"><img src="' + animal.foto + '" style="max-width:200px; max-height:200px; border-radius:8px; object-fit:cover; box-shadow:0 2px 8px rgba(0,0,0,0.2);"></div>' : '';

    resultDiv.innerHTML =
      '<div class="card">' +
        '<div class="card-header">🔎 Kurbanlık Bilgileri - ' + escapeHtml(kupeNo) + '</div>' +
        fotoHtml +
        '<div class="result-grid">' +
          '<div class="result-item"><span class="result-label">Küpe No</span><span class="result-value">' + escapeHtml(kupeNo) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Cinsiyet</span><span class="result-value">' + escapeHtml(data.cinsiyet || '-') + '</span></div>' +
          '<div class="result-item"><span class="result-label">Irk</span><span class="result-value">' + escapeHtml(data.irk || '-') + '</span></div>' +
          '<div class="result-item"><span class="result-label">Satış Durumu</span><span class="result-value">' + (animal ? getBadge(animal.satisDurumu) : '-') + '</span></div>' +
          '<div class="result-item"><span class="result-label">Padok</span><span class="result-value">' + escapeHtml(data.padok || '-') + '</span></div>' +
          '<div class="result-item"><span class="result-label">Kilo</span><span class="result-value">' + ((animal ? animal.kilo : 0) || '-') + ' kg</span></div>' +
        '</div>' +
        salesHtml +
      '</div>';
  } else {
    resultDiv.innerHTML = '<div class="card"><p class="text-danger">❌ Kurbanlık bulunamadı!</p></div>';
  }
}

function searchCustomer() {
  var musteriAdi = (document.getElementById('ma-musteri')?.value || '').trim().toUpperCase();
  var resultDiv = document.getElementById('ma-result');
  if (!resultDiv) return;

  if (!musteriAdi) {
    resultDiv.classList.add('hidden');
    return;
  }

  // Hem satış hem kurbanlık çıktı kayıtlarından ara
  var salesMatches = appData.sales.filter(function(s) {
    return s.musteriAdi.toUpperCase().includes(musteriAdi);
  });

  var ciktiMatches = appData.kurbanlikCikti.filter(function(k) {
    return k.musteriAdi.toUpperCase().includes(musteriAdi);
  });

  resultDiv.classList.remove('hidden');

  var html = '';

  if (salesMatches.length > 0) {
    html += salesMatches.map(function(s) {
      return '<div class="card">' +
        '<div class="card-header">👤 ' + escapeHtml(s.musteriAdi) + ' - Küpe: ' + escapeHtml(s.kupeNo) + '</div>' +
        '<div class="result-grid">' +
          '<div class="result-item"><span class="result-label">Irk</span><span class="result-value">' + escapeHtml(s.irk) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Cinsiyet</span><span class="result-value">' + escapeHtml(s.cinsiyet) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Satış Türü</span><span class="result-value">' + escapeHtml(s.satisTuru) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Satış Fiyatı</span><span class="result-value">' + formatMoney(s.satisFiyati) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Alınan Toplam</span><span class="result-value">' + formatMoney(s.alinanToplam) + '</span></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  if (ciktiMatches.length > 0) {
    html += ciktiMatches.map(function(k) {
      return '<div class="card">' +
        '<div class="card-header">🐄 ' + escapeHtml(k.musteriAdi) + ' - Küpe: ' + escapeHtml(k.kupeNo) + ' (Hisseli)</div>' +
        '<div class="result-grid">' +
          '<div class="result-item"><span class="result-label">Irk</span><span class="result-value">' + escapeHtml(k.irk) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Padok</span><span class="result-value">' + escapeHtml(k.padokNo) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Satış Fiyatı</span><span class="result-value">' + formatMoney(k.satisFiyati) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Alınan Ücret</span><span class="result-value">' + formatMoney(k.alinanUcret) + '</span></div>' +
          '<div class="result-item"><span class="result-label">Kalan Ücret</span><span class="result-value">' + formatMoney(k.kalanUcret) + '</span></div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  if (!html) {
    html = '<div class="card"><p class="text-danger">❌ Müşteri bulunamadı!</p></div>';
  }

  resultDiv.innerHTML = html;
}

// ==========================================
// TABLE RENDERING
// ==========================================
function renderAnimalTable() {
  var tbody = document.querySelector('#table-hayvan-listesi tbody');
  if (!tbody) return;

  var filter = (document.getElementById('filter-hayvan-listesi')?.value || '').toLowerCase();

  var filtered = appData.animals.filter(function(a) {
    if (!filter) return true;
    return Object.values(a).some(function(v) {
      return String(v).toLowerCase().includes(filter);
    });
  });

  // Özet Bilgiler
  var toplamKilo = filtered.reduce(function(sum, a) { return sum + (parseFloat(a.kilo) || 0); }, 0);
  var toplamMaliyet = filtered.reduce(function(sum, a) { return sum + (parseFloat(a.alisFiyati) || 0); }, 0);

  var elToplam = document.getElementById('hl-toplam-hayvan');
  if (elToplam) elToplam.textContent = filtered.length;
  var elKilo = document.getElementById('hl-toplam-kilo');
  if (elKilo) elKilo.textContent = toplamKilo.toLocaleString('tr-TR') + ' kg';
  var elMaliyet = document.getElementById('hl-toplam-maliyet');
  if (elMaliyet) elMaliyet.textContent = formatMoney(toplamMaliyet);

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" style="text-align:center; padding: 2rem; color: #6b7280;">Kayıt bulunamadı</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map(function(a, i) {
    var realIndex = appData.animals.indexOf(a);
    return '<tr>' +
      '<td data-label="Seç"><input type="checkbox" class="row-checkbox" value="' + realIndex + '"></td>' +
      '<td data-label="Küpe No">' + escapeHtml(a.kupeNo) + '</td>' +
      '<td data-label="Irk">' + escapeHtml(a.irk) + '</td>' +
      '<td data-label="Padok">' + escapeHtml(a.padok) + '</td>' +
      '<td data-label="Cinsiyet">' + escapeHtml(a.cinsiyet) + '</td>' +
      '<td data-label="Alış Tarihi">' + formatDate(a.alisTarihi) + '</td>' +
      '<td data-label="Doğum Tarihi">' + (formatDate(a.dogumTarihi) || '-') + '</td>' +
      '<td data-label="Kilo">' + a.kilo + '</td>' +
      '<td data-label="Durum">' + getBadge(a.durum, 'info') + '</td>' +
      '<td data-label="Satış Durumu">' + getBadge(a.satisDurumu) + '</td>' +
      '<td data-label="Alış Fiyatı">' + formatMoney(a.alisFiyati) + '</td>' +
      '<td data-label="Açıklama">' + (escapeHtml(a.aciklama) || '-') + '</td>' +
      '<td data-label="İşlem">' +
        '<button class="btn btn-sm btn-outline" style="margin-right:4px;" onclick="openEditModal(' + realIndex + ')">✏️</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteAnimal(' + realIndex + ')">Sil</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function renderSalesTable() {
  var tbody = document.querySelector('#table-kurbanlik-satisi tbody');
  if (!tbody) return;

  var toplamSatis = 0;
  var toplamAlinan = 0;
  var toplamKalan = 0;
  var toplamKar = 0;

  if (appData.sales.length > 0) {
    appData.sales.forEach(function(s) {
      toplamSatis += (s.satisFiyati || 0);
      toplamAlinan += (s.alinanToplam || 0);
      toplamKalan += ((s.satisFiyati || 0) - (s.alinanToplam || 0));
      var maliyet = (s.alisFiyati || 0) + (s.vetGideri || 0) + (s.yemGideri || 0);
      toplamKar += ((s.satisFiyati || 0) - maliyet);
    });
  }

  var elSatis = document.getElementById('sg-toplam-satis');
  if (elSatis) elSatis.textContent = formatMoney(toplamSatis);
  var elAlinan = document.getElementById('sg-alinan');
  if (elAlinan) elAlinan.textContent = formatMoney(toplamAlinan);
  var elKalan = document.getElementById('sg-kalan');
  if (elKalan) elKalan.textContent = formatMoney(toplamKalan);
  var elKar = document.getElementById('sg-kar');
  if (elKar) {
    elKar.textContent = formatMoney(toplamKar);
    elKar.style.color = toplamKar >= 0 ? 'var(--color-success)' : 'var(--color-danger)';
  }

  if (appData.sales.length === 0) {
    tbody.innerHTML = '<tr><td colspan="15" style="text-align:center; padding: 2rem; color: #6b7280;">Satış kaydı bulunmamaktadır</td></tr>';
    return;
  }

  tbody.innerHTML = appData.sales.map(function(s, i) {
    // IFERROR(K/G,"") - KG Fiyatı
    var kgFiyati = s.tahminiKilo > 0 ? s.satisFiyati / s.tahminiKilo : 0;
    // IFERROR(IF(K-H=0,"",K-H),"") - Kalan
    var kalan = (s.satisFiyati > 0 && s.alisFiyati > 0) ? (s.satisFiyati - s.alisFiyati) : 0;
    // IFERROR kar yüzdesi
    var karYuzdesi = (s.satisFiyati > 0 && s.alisFiyati > 0) ? ((s.satisFiyati - s.alisFiyati) / s.satisFiyati) : 0;

    return '<tr>' +
      '<td data-label="Seç"><input type="checkbox" class="row-checkbox" value="' + i + '"></td>' +
      '<td data-label="Küpe No">' + escapeHtml(s.kupeNo) + '</td>' +
      '<td data-label="Müşteri Adı">' + escapeHtml(s.musteriAdi) + '</td>' +
      '<td data-label="Irk">' + escapeHtml(s.irk) + '</td>' +
      '<td data-label="Padok">' + escapeHtml(s.padok) + '</td>' +
      '<td data-label="Cinsiyet">' + escapeHtml(s.cinsiyet) + '</td>' +
      '<td data-label="Satış Türü">' + escapeHtml(s.satisTuru) + '</td>' +
      '<td data-label="Tahmini Kilo">' + s.tahminiKilo + '</td>' +
      '<td data-label="Alış Fiyatı">' + formatMoney(s.alisFiyati) + '</td>' +
      '<td data-label="Vet. Gideri">' + formatMoney(s.vetGideri) + '</td>' +
      '<td data-label="Yem Gideri">' + formatMoney(s.yemGideri) + '</td>' +
      '<td data-label="Satış Fiyatı">' + formatMoney(s.satisFiyati) + '</td>' +
      '<td data-label="KG Fiyatı">' + (kgFiyati ? formatMoney(kgFiyati) : '-') + '</td>' +
      '<td data-label="Alınan Toplam">' + formatMoney(s.alinanToplam) + '</td>' +
      '<td data-label="Kalan">' + (kalan ? formatMoney(kalan) : '-') + '</td>' +
      '<td data-label="Kâr %">' + (karYuzdesi ? '%' + (karYuzdesi * 100).toFixed(1) : '-') + '</td>' +
    '</tr>';
  }).join('');
}

function renderFeedTable() {
  var tbody = document.querySelector('#table-yem-veri tbody');
  if (!tbody) return;

  if (appData.feedPurchases.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #6b7280;">Yem alım kaydı bulunmamaktadır</td></tr>';
    return;
  }

  tbody.innerHTML = appData.feedPurchases.map(function(f, i) {
    return '<tr>' +
      '<td data-label="Seç"><input type="checkbox" class="row-checkbox" value="' + i + '"></td>' +
      '<td data-label="Yem Markası">' + escapeHtml(f.yemMarkasi) + '</td>' +
      '<td data-label="Yem Türü">' + escapeHtml(f.yemTuru) + '</td>' +
      '<td data-label="Alım Tarihi">' + formatDate(f.alimTarihi) + '</td>' +
      '<td data-label="Birim Fiyatı">' + formatMoney(f.birimFiyati) + '</td>' +
      '<td data-label="Adeti">' + f.adeti + '</td>' +
      '<td data-label="Ödenen Fiyat">' + formatMoney(f.odenenFiyat) + '</td>' +
      '<td data-label="Toplam Fiyat">' + formatMoney(f.toplamFiyat) + '</td>' +
    '</tr>';
  }).join('');

  // Genel toplam - SUMPRODUCT formülüne eşdeğer
  var total = appData.feedPurchases.reduce(function(sum, f) {
    return sum + (f.odenenFiyat || 0);
  }, 0);
  var totalEl = document.getElementById('yem-genel-toplam');
  if (totalEl) totalEl.textContent = formatMoney(total);
}

function renderVetTable() {
  var tbody = document.querySelector('#table-vet-veri tbody');
  if (!tbody) return;

  if (appData.vetExpenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: #6b7280;">Veteriner gider kaydı bulunmamaktadır</td></tr>';
    return;
  }

  tbody.innerHTML = appData.vetExpenses.map(function(v, i) {
    return '<tr>' +
      '<td data-label="Seç"><input type="checkbox" class="row-checkbox" value="' + i + '"></td>' +
      '<td data-label="Veteriner Adı">' + escapeHtml(v.veterinerAdi) + '</td>' +
      '<td data-label="Alınan İlaç">' + escapeHtml(v.alinanIlac) + '</td>' +
      '<td data-label="Adeti">' + v.adeti + '</td>' +
      '<td data-label="Birim Fiyatı">' + formatMoney(v.birimFiyati) + '</td>' +
      '<td data-label="Vet. Hizmeti">' + formatMoney(v.veterinerHizmeti) + '</td>' +
      '<td data-label="Toplam Fiyat">' + formatMoney(v.toplamFiyat) + '</td>' +
    '</tr>';
  }).join('');

  // Genel toplam
  var total = appData.vetExpenses.reduce(function(sum, v) {
    return sum + (v.toplamFiyat || 0);
  }, 0);
  var totalEl = document.getElementById('vet-genel-toplam');
  if (totalEl) totalEl.textContent = formatMoney(total);
}

function renderKurbanlikCiktiTable() {
  var container = document.getElementById('kurbanlik-cikti-container');
  if (!container) return;

  var hisseSatislar = appData.sales.filter(function(s) {
    return s.satisTuru && s.satisTuru.includes('Hisse');
  });

  if (hisseSatislar.length === 0 && appData.kurbanlikCikti.length === 0) {
    container.innerHTML = '<div class="card" style="grid-column: 1 / -1;"><p class="text-center" style="color: #6b7280;">Kurbanlık hisseli satış kaydı bulunmamaktadır</p></div>';
    return;
  }

  // Gruplama
  var groups = {};
  
  // Önce eski Kurbanlık Çıktı tablosundan gelen verileri ekle (eski versiyon desteği)
  appData.kurbanlikCikti.forEach(function(k) {
    if (!groups[k.kupeNo]) {
      var animalInfo = appData.animals.find(function(a) { return a.kupeNo === k.kupeNo; });
      groups[k.kupeNo] = {
        kupeNo: k.kupeNo,
        irk: k.irk || (animalInfo ? animalInfo.irk : '-'),
        padok: k.padokNo || (animalInfo ? animalInfo.padok : '-'),
        toplamSatisFiyati: 0,
        alinanToplam: 0,
        hissedarlar: []
      };
    }
    groups[k.kupeNo].toplamSatisFiyati += parseFloat(k.satisFiyati) || 0;
    groups[k.kupeNo].alinanToplam += parseFloat(k.alinanUcret) || 0;
    groups[k.kupeNo].hissedarlar.push({
      ad: k.musteriAdi,
      pay: 1, // Kurbanlık Çıktı verisinde hisse adedi belli değilse 1 sayıyoruz
      satisFiyati: parseFloat(k.satisFiyati) || 0,
      alinanUcret: parseFloat(k.alinanUcret) || 0
    });
  });

  // Şimdi Sales tablosundaki Hisseli Satışları ekle
  hisseSatislar.forEach(function(s) {
    if (!groups[s.kupeNo]) {
      groups[s.kupeNo] = {
        kupeNo: s.kupeNo,
        irk: s.irk,
        padok: s.padok,
        toplamSatisFiyati: 0,
        alinanToplam: 0,
        hissedarlar: []
      };
    }
    
    var payAdedi = parseInt(s.satisTuru) || 1; // "3 Hisse" -> 3
    groups[s.kupeNo].toplamSatisFiyati += parseFloat(s.satisFiyati) || 0;
    groups[s.kupeNo].alinanToplam += parseFloat(s.alinanToplam) || 0;
    groups[s.kupeNo].hissedarlar.push({
      ad: s.musteriAdi,
      pay: payAdedi,
      satisFiyati: parseFloat(s.satisFiyati) || 0,
      alinanUcret: parseFloat(s.alinanToplam) || 0
    });
  });

  var html = '';
  Object.values(groups).forEach(function(g) {
    var satilanHisse = g.hissedarlar.reduce(function(sum, h) { return sum + h.pay; }, 0);
    var toplamHisse = 7; // Standart büyükbaş hisse sayısı
    var kalanHisse = Math.max(0, toplamHisse - satilanHisse);
    var kalanAlacak = g.toplamSatisFiyati - g.alinanToplam;

    html += '<div class="card">';
    html += '<div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">';
    html += '<span>🐄 ' + escapeHtml(g.kupeNo) + '</span>';
    html += '<span class="badge badge-warning">' + satilanHisse + '/7 Hisse Satıldı</span>';
    html += '</div>';
    html += '<div style="margin-bottom: 12px; font-size: 0.85em; color: var(--color-text-secondary);">';
    html += '<span>Irk: <b>' + escapeHtml(g.irk) + '</b></span> | <span>Padok: <b>' + escapeHtml(g.padok) + '</b></span> | ';
    html += '<span class="' + (kalanHisse > 0 ? 'text-success' : 'text-danger') + '">Boş Hisse: <b>' + kalanHisse + '</b></span>';
    html += '</div>';

    html += '<div style="overflow-x:auto;"><table class="data-table" style="margin-bottom: 12px; font-size: 0.85em;">';
    html += '<thead><tr><th>Müşteri</th><th>Pay</th><th>Satış F.</th><th>Alınan</th><th>Kalan</th><th>İşlem</th></tr></thead>';
    html += '<tbody>';
    g.hissedarlar.forEach(function(h) {
      var kalan = h.satisFiyati - h.alinanUcret;
      html += '<tr>';
      html += '<td data-label="Müşteri">' + escapeHtml(h.ad) + '</td>';
      html += '<td data-label="Pay">' + h.pay + '</td>';
      html += '<td data-label="Satış F.">' + formatMoney(h.satisFiyati) + '</td>';
      html += '<td data-label="Alınan">' + formatMoney(h.alinanUcret) + '</td>';
      html += '<td data-label="Kalan" class="' + (kalan > 0 ? 'text-danger' : 'text-success') + '">' + formatMoney(kalan) + '</td>';
      html += '<td data-label="İşlem"><button class="btn btn-sm btn-danger" style="padding:4px 8px; font-size:0.8em;" onclick="deleteHisse(\'' + escapeHtml(g.kupeNo) + '\', \'' + escapeHtml(h.ad) + '\')">Sil</button></td>';
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    
    html += '<div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:space-between; font-weight:700; border-top:1px solid var(--color-border); padding-top:12px; font-size:0.9em;">';
    html += '<span>Toplam Satış: ' + formatMoney(g.toplamSatisFiyati) + '</span>';
    html += '<span>Alınan: ' + formatMoney(g.alinanToplam) + '</span>';
    html += '<span class="' + (kalanAlacak > 0 ? 'text-danger' : 'text-success') + '">Kalan: ' + formatMoney(kalanAlacak) + '</span>';
    html += '</div>';
    html += '</div>';
  });

  container.innerHTML = html;
}

// ==========================================
// DASHBOARD & REPORT (replaces RAPOR sheet calculations)
// ==========================================
function updateDashboard() {
  var animals = appData.animals || [];
  var sales = appData.sales || [];
  var feeds = appData.feedPurchases || [];
  var vets = appData.vetExpenses || [];

  // Hayvan istatistikleri
  var aktif = animals.filter(function(a) { return a.satisDurumu === 'STOKTA'; }).length;
  var pasif = animals.filter(function(a) { return a.satisDurumu !== 'STOKTA'; }).length;
  var kurbanlik = animals.filter(function(a) { return a.durum === 'KURBANLIK'; }).length;
  var satilanKurbanlik = animals.filter(function(a) { return a.durum === 'KURBANLIK' && a.satisDurumu === 'SATILDI'; }).length;
  var kalanKurbanlik = animals.filter(function(a) { return a.durum === 'KURBANLIK' && a.satisDurumu === 'STOKTA'; }).length;
  var besi = animals.filter(function(a) { return a.durum === 'BESİ'; }).length;
  var damizlik = animals.filter(function(a) { return a.durum === 'DAMIZLIK'; }).length;

  // Mali istatistikler
  var kCikti = appData.kurbanlikCikti || [];
  var kCiktiSatis = kCikti.reduce(function(s, k) { return s + (parseFloat(k.satisFiyati) || 0); }, 0);
  
  var toplamAlis = animals.reduce(function(s, a) { return s + (a.alisFiyati || 0); }, 0);
  var toplamSatis = sales.reduce(function(s, sale) { return s + (sale.satisFiyati || 0); }, 0) + kCiktiSatis;
  var toplamYem = feeds.reduce(function(s, f) { return s + (f.odenenFiyat || 0); }, 0);
  var toplamVet = vets.reduce(function(s, v) { return s + (v.toplamFiyat || 0); }, 0);
  var toplamCoban = (appData.shepherdExpenses || []).reduce(function(s, c) { return s + (c.tutar || 0); }, 0);

  // Sadece satılan hayvanların alış fiyatlarının toplamı
  var satilanKupelar = sales.map(function(s) { return s.kupeNo; }).concat(kCikti.map(function(k) { return k.kupeNo; }));
  var satilanAlis = animals.filter(function(a) {
    return satilanKupelar.includes(a.kupeNo);
  }).reduce(function(s, a) { return s + (a.alisFiyati || 0); }, 0);

  var karZarar = toplamSatis - satilanAlis - toplamYem - toplamVet - toplamCoban;

  // DOM güncellemeleri
  setText('stat-toplam-hayvan', animals.length);
  setText('stat-aktif', aktif);
  setText('stat-pasif', pasif);
  setText('stat-kurbanlik', kurbanlik);
  setText('stat-satilan-kurbanlik', satilanKurbanlik);
  setText('stat-kalan-kurbanlik', kalanKurbanlik);
  setText('stat-besi', besi);
  setText('stat-damizlik', damizlik);
  setText('stat-toplam-alis', formatMoney(toplamAlis));
  setText('stat-toplam-satis', formatMoney(toplamSatis));
  setText('stat-toplam-yem', formatMoney(toplamYem));
  setText('stat-kar-zarar', formatMoney(karZarar));

  // Kâr/zarar rengini ayarla
  var karEl = document.getElementById('stat-kar-zarar');
  if (karEl) {
    karEl.style.color = karZarar >= 0 ? '#10b981' : '#ef4444';
  }

  // Görevleri ve Uyarıları Güncelle
  if (typeof renderTodos === 'function') renderTodos();
  if (typeof renderAlerts === 'function') renderAlerts();
  if (typeof updateKupeList === 'function') updateKupeList();
}

function updateReport() {
  updateDashboard(); // Rapor aynı istatistikleri kullanır

  var animals = appData.animals || [];
  var sales = appData.sales || [];
  var feeds = appData.feedPurchases || [];
  var vets = appData.vetExpenses || [];
  var kCikti = appData.kurbanlikCikti || [];

  var aktif = animals.filter(function(a) { return a.satisDurumu === 'STOKTA'; }).length;
  var pasif = animals.filter(function(a) { return a.satisDurumu !== 'STOKTA'; }).length;
  var kurbanlik = animals.filter(function(a) { return a.durum === 'KURBANLIK'; }).length;
  var besi = animals.filter(function(a) { return a.durum === 'BESİ'; }).length;
  var damizlik = animals.filter(function(a) { return a.durum === 'DAMIZLIK'; }).length;

  var kCiktiSatis = kCikti.reduce(function(s, k) { return s + (parseFloat(k.satisFiyati) || 0); }, 0);
  var toplamAlis = animals.reduce(function(s, a) { return s + (a.alisFiyati || 0); }, 0);
  var toplamSatis = sales.reduce(function(s, sale) { return s + (sale.satisFiyati || 0); }, 0) + kCiktiSatis;
  var toplamYem = feeds.reduce(function(s, f) { return s + (f.odenenFiyat || 0); }, 0);
  var toplamVet = vets.reduce(function(s, v) { return s + (v.toplamFiyat || 0); }, 0);

  var satilanKupelar = sales.map(function(s) { return s.kupeNo; }).concat(kCikti.map(function(k) { return k.kupeNo; }));
  var toplamCoban = (appData.shepherdExpenses || []).reduce(function(s, c) { return s + (c.tutar || 0); }, 0);

  var satilanKupelar = sales.map(function(s) { return s.kupeNo; }).concat(kCikti.map(function(k) { return k.kupeNo; }));
  var satilanAlis = animals.filter(function(a) {
    return satilanKupelar.includes(a.kupeNo);
  }).reduce(function(s, a) { return s + (a.alisFiyati || 0); }, 0);

  var karZarar = toplamSatis - satilanAlis - toplamYem - toplamVet - toplamCoban;
  var toplamMaliyet = satilanAlis + toplamYem + toplamVet + toplamCoban;

  setText('rapor-toplam-hayvan', animals.length);
  setText('rapor-aktif', aktif);
  setText('rapor-pasif', pasif);
  setText('rapor-kurbanlik', kurbanlik);
  setText('rapor-besi', besi);
  setText('rapor-damizlik', damizlik);
  setText('rapor-toplam-alis', formatMoney(toplamAlis));
  setText('rapor-toplam-satis', formatMoney(toplamSatis));
  setText('rapor-toplam-yem', formatMoney(toplamYem));
  setText('rapor-toplam-vet', formatMoney(toplamVet));
  setText('rapor-toplam-coban', formatMoney(toplamCoban));
  setText('rapor-kar-zarar', formatMoney(karZarar));
  
  var karYuzdesi = 0;
  if (toplamMaliyet > 0) {
    karYuzdesi = (karZarar / toplamMaliyet) * 100;
  }
  setText('rapor-kar-yuzde', '%' + karYuzdesi.toFixed(1));

  var karEl = document.getElementById('rapor-kar-zarar');
  if (karEl) {
    karEl.style.color = karZarar >= 0 ? '#10b981' : '#ef4444';
  }
  var yuzdeEl = document.getElementById('rapor-kar-yuzde');
  if (yuzdeEl) {
    yuzdeEl.style.color = karZarar >= 0 ? '#10b981' : '#ef4444';
  }

  // Sağlık ve Üreme
  var vaccines = appData.vaccines || [];
  var pregnancies = appData.pregnancies || [];
  
  var aktifGebe = pregnancies.filter(function(p) { return p.durum === 'Gebe'; }).length;
  var doguran = pregnancies.filter(function(p) { return p.durum === 'Doğurdu'; }).length;

  setText('rapor-toplam-asi', vaccines.length);
  setText('rapor-aktif-gebe', aktifGebe);
  setText('rapor-doguran', doguran);

  // Ek rapor detayları - Padok bazlı dağılım
  var padokStats = {};
  appData.animals.forEach(function(a) {
    var padokName = a.padok || 'Belirtilmemiş';
    if (!padokStats[padokName]) {
      padokStats[padokName] = { toplam: 0, stokta: 0, satilan: 0 };
    }
    padokStats[padokName].toplam++;
    if (a.satisDurumu === 'STOKTA') {
      padokStats[padokName].stokta++;
    } else {
      padokStats[padokName].satilan++;
    }
  });

  var padokContainer = document.getElementById('rapor-padok-grid');
  if (padokContainer) {
    var padokHtml = '';
    Object.keys(padokStats).sort().forEach(function(padok) {
      var stat = padokStats[padok];
      padokHtml += '<div class="stat-card">' +
        '<div class="stat-icon">🏠</div>' +
        '<div class="stat-value">' + stat.toplam + '</div>' +
        '<div class="stat-label">' + escapeHtml(padok) + '</div>' +
        '<div class="stat-sub" style="font-size:0.75em; color:var(--color-text-secondary); margin-top:4px;">Stokta: ' + stat.stokta + ' | Satılan: ' + stat.satilan + '</div>' +
      '</div>';
    });
    padokContainer.innerHTML = padokHtml || '<p>Kayıt bulunamadı.</p>';
  }

  // Irk bazlı dağılım
  var irkStats = {};
  appData.animals.forEach(function(a) {
    var irkName = a.irk || 'Belirtilmemiş';
    if (!irkStats[irkName]) irkStats[irkName] = 0;
    irkStats[irkName]++;
  });

  var irkContainer = document.getElementById('rapor-irk-grid');
  if (irkContainer) {
    var irkHtml = '';
    Object.keys(irkStats).sort().forEach(function(irk) {
      irkHtml += '<div class="stat-card">' +
        '<div class="stat-icon">🐄</div>' +
        '<div class="stat-value">' + irkStats[irk] + '</div>' +
        '<div class="stat-label">' + escapeHtml(irk) + '</div>' +
      '</div>';
    });
    irkContainer.innerHTML = irkHtml || '<p>Kayıt bulunamadı.</p>';
  }
}

// ==========================================
// DELETE FUNCTIONS
// ==========================================
function deleteAnimal(index) {
  if (index < 0 || index >= appData.animals.length) {
    showToast('Geçersiz kayıt!', 'error');
    return;
  }

  var animal = appData.animals[index];
  var confirmMsg = animal.kupeNo + ' küpe numaralı hayvanı silmek istediğinize emin misiniz?';

  if (confirm(confirmMsg)) {
    appData.animals.splice(index, 1);
    saveData();
    renderAnimalTable();
    showToast(animal.kupeNo + ' numaralı hayvan kaydı silindi.', 'warning');
  }
}

function deleteSale(index) {
  if (index < 0 || index >= appData.sales.length) {
    showToast('Geçersiz kayıt!', 'error');
    return;
  }

  var sale = appData.sales[index];
  var confirmMsg = sale.kupeNo + ' küpe numaralı satış kaydını silmek istediğinize emin misiniz?';

  if (confirm(confirmMsg)) {
    // Hayvanın satış durumunu geri al
    var animal = appData.animals.find(function(a) { return a.kupeNo === sale.kupeNo; });
    if (animal) {
      // Aynı küpe ile başka satış var mı kontrol et
      var otherSales = appData.sales.filter(function(s, i) {
        return s.kupeNo === sale.kupeNo && i !== index;
      });
      if (otherSales.length === 0) {
        animal.satisDurumu = 'STOKTA';
      }
    }

    appData.sales.splice(index, 1);
    saveData();
    renderSalesTable();
    showToast('Satış kaydı silindi.', 'warning');
  }
}

function deleteFeed(index) {
  if (index < 0 || index >= appData.feedPurchases.length) {
    showToast('Geçersiz kayıt!', 'error');
    return;
  }

  if (confirm('Bu yem alım kaydını silmek istediğinize emin misiniz?')) {
    appData.feedPurchases.splice(index, 1);
    saveData();
    renderFeedTable();
    distributeCosts();
    showToast('Yem alım kaydı silindi.', 'warning');
  }
}

function deleteVet(index) {
  if (index < 0 || index >= appData.vetExpenses.length) {
    showToast('Geçersiz kayıt!', 'error');
    return;
  }

  if (confirm('Bu veteriner gider kaydını silmek istediğinize emin misiniz?')) {
    appData.vetExpenses.splice(index, 1);
    saveData();
    renderVetTable();
    distributeCosts();
    showToast('Veteriner gider kaydı silindi.', 'warning');
  }
}

// ==========================================
// HAYVAN DÜZENLEME
// ==========================================
function openEditModal(index) {
  var animal = appData.animals[index];
  if (!animal) return;
  
  document.getElementById('edit-index').value = index;
  document.getElementById('edit-kupe').value = animal.kupeNo || '';
  document.getElementById('edit-irk').value = animal.irk || '';
  document.getElementById('edit-padok').value = animal.padok || '';
  document.getElementById('edit-cinsiyet').value = animal.cinsiyet || '';
  document.getElementById('edit-tarih').value = animal.alisTarihi || '';
  document.getElementById('edit-dogum').value = animal.dogumTarihi || '';
  document.getElementById('edit-kilo').value = animal.kilo || '';
  document.getElementById('edit-fiyat').value = animal.alisFiyati || '';
  document.getElementById('edit-durum').value = animal.durum || '';
  document.getElementById('edit-satis-durumu').value = animal.satisDurumu || 'STOKTA';
  document.getElementById('edit-aciklama').value = animal.aciklama || '';
  
  if (document.getElementById('edit-foto')) document.getElementById('edit-foto').value = '';
  var editPreview = document.getElementById('edit-foto-preview');
  if (editPreview) {
    if (animal.foto) {
      editPreview.src = animal.foto;
      editPreview.style.display = 'block';
      if (document.getElementById('edit-foto-remove')) document.getElementById('edit-foto-remove').style.display = 'block';
    } else {
      editPreview.src = '';
      editPreview.style.display = 'none';
      if (document.getElementById('edit-foto-remove')) document.getElementById('edit-foto-remove').style.display = 'none';
    }
  }

  var modal = document.getElementById('edit-modal');
  if (modal) {
    modal.classList.add('show');
    history.pushState({ modalOpen: 'edit' }, '', window.location.hash);
  }
}

function closeEditModal(fromHistory) {
  var modal = document.getElementById('edit-modal');
  if (modal && modal.classList.contains('show')) {
    modal.classList.remove('show');
    if (fromHistory !== true) {
      history.back();
    }
  }
}

function saveAnimalEdit() {
  var index = document.getElementById('edit-index').value;
  if (index === '' || index < 0 || index >= appData.animals.length) return;
  
  var animal = appData.animals[index];
  
  var kupeNo = document.getElementById('edit-kupe').value.trim();
  if (!kupeNo) {
    showToast('Küpe No boş olamaz!', 'error');
    return;
  }
  
  if (kupeNo !== animal.kupeNo) {
    var duplicate = appData.animals.find(function(a, i) {
      return a.kupeNo === kupeNo && i != index;
    });
    if (duplicate) {
      showToast('Bu küpe numarası zaten kullanılıyor!', 'error');
      return;
    }
  }
  
  animal.kupeNo = kupeNo;
  animal.irk = document.getElementById('edit-irk').value;
  animal.padok = document.getElementById('edit-padok').value;
  animal.cinsiyet = document.getElementById('edit-cinsiyet').value;
  animal.alisTarihi = document.getElementById('edit-tarih').value;
  animal.dogumTarihi = document.getElementById('edit-dogum').value;
  animal.kilo = parseFloat(document.getElementById('edit-kilo').value) || 0;
  animal.alisFiyati = parseFloat(document.getElementById('edit-fiyat').value) || 0;
  animal.durum = document.getElementById('edit-durum').value;
  animal.satisDurumu = document.getElementById('edit-satis-durumu').value;
  animal.aciklama = document.getElementById('edit-aciklama').value;
  
  var fotoSrc = document.getElementById('edit-foto-preview')?.src || '';
  if (fotoSrc.startsWith('data:image')) {
    animal.foto = fotoSrc;
  } else if (!fotoSrc || fotoSrc === '' || document.getElementById('edit-foto-preview').style.display === 'none') {
    animal.foto = null;
  }
  
  saveData();
  renderAnimalTable();
  updateDashboard();
  closeEditModal();
  showToast('Hayvan bilgileri güncellendi.', 'success');
}

// ==========================================
// AUTO-CALCULATE FORM TOTALS
// ==========================================
function updateYemToplam() {
  var birim = parseFloat(document.getElementById('ye-birim')?.value) || 0;
  var adet = parseFloat(document.getElementById('ye-adet')?.value) || 0;
  var toplamEl = document.getElementById('ye-toplam');
  if (toplamEl) toplamEl.textContent = formatMoney(birim * adet);
}

function updateVetToplam() {
  var adet = parseFloat(document.getElementById('ve-adet')?.value) || 0;
  var birim = parseFloat(document.getElementById('ve-birim')?.value) || 0;
  var hizmet = parseFloat(document.getElementById('ve-hizmet')?.value) || 0;
  var toplamEl = document.getElementById('ve-toplam');
  if (toplamEl) toplamEl.textContent = formatMoney((adet * birim) + hizmet);
}

// ==========================================
// DATA EXPORT / IMPORT / RESET
// ==========================================
function exportData() {
  try {
    var dataStr = JSON.stringify(appData, null, 2);
    var blob = new Blob([dataStr], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ahir_yedek_' + getTodayStr() + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Veri yedeği (txt) indirildi.', 'info');
  } catch (err) {
    showToast('Dışa aktarma hatası: ' + err.message, 'error');
  }
}

function importData() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json, .txt';

  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var data = JSON.parse(ev.target.result);

        // Veri yapısı doğrulaması
        if (!data.animals || !Array.isArray(data.animals)) {
          showToast('Geçersiz dosya formatı! animals alanı bulunamadı.', 'error');
          return;
        }
        if (!data.sales || !Array.isArray(data.sales)) {
          showToast('Geçersiz dosya formatı! sales alanı bulunamadı.', 'error');
          return;
        }

        if (confirm('Mevcut veriler üzerine yazılacak. Devam etmek istiyor musunuz?')) {
          // Eksik alanları tamamla
          if (!data.feedPurchases) data.feedPurchases = [];
          if (!data.vetExpenses) data.vetExpenses = [];
          if (!data.kurbanlikCikti) data.kurbanlikCikti = [];

          appData = data;
          saveData();
          navigateTo('section-dashboard');
          showToast('Veri başarıyla yüklendi.');
        }
      } catch (err) {
        showToast('Dosya okunamadı: ' + err.message, 'error');
      }
    };

    reader.onerror = function() {
      showToast('Dosya okunamadı!', 'error');
    };

    reader.readAsText(file);
  };

  input.click();
}

function resetData() {
  if (confirm('⚠️ TÜM VERİLER SİFIRLANACAK!\n\nBu işlem geri alınamaz. Emin misiniz?')) {
    if (confirm('Son kez onaylayın: Tüm hayvan, satış, yem ve veteriner kayıtları silinecek!')) {
      appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData();
      navigateTo('section-dashboard');
      showToast('Veriler fabrika ayarlarına döndürüldü.', 'warning');
    }
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatMoney(amount) {
  if (amount === null || amount === undefined || amount === '') return '-';
  if (isNaN(amount)) return '-';

  try {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (err) {
    // Fallback
    return '₺' + Number(amount).toLocaleString('tr-TR');
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (err) {
    return dateStr;
  }
}

function getTodayStr() {
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function setText(id, value) {
  var el = document.getElementById(id);
  if (el) {
    var valEl = el.querySelector('.stat-value');
    if (valEl) {
      valEl.textContent = value;
    } else {
      el.textContent = value;
    }
  }
}

function getBadge(status, defaultType) {
  var map = {
    'STOKTA': 'success',
    'SATILDI': 'danger',
    'Hisseli Satış': 'warning',
    'ÖLDÜ': 'danger',
    'KURBANLIK': 'info',
    'BESİ': 'warning',
    'DAMIZLIK': 'success'
  };
  var type = map[status] || defaultType || 'info';
  return '<span class="badge badge-' + type + '">' + (status || '-') + '</span>';
}

function escapeHtml(str) {
  if (!str) return '';
  var text = String(str);
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ==========================================
// PWA INSTALL
// ==========================================
var deferredPrompt = null;

window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
  var banner = document.getElementById('pwa-install-banner');
  if (banner) banner.classList.add('show');
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(result) {
      if (result.outcome === 'accepted') {
        showToast('Uygulama yüklendi! 🎉');
      }
      deferredPrompt = null;
      var banner = document.getElementById('pwa-install-banner');
      if (banner) banner.classList.remove('show');
    });
  }
}

// ==========================================
// KULLANICI GİRİŞ (LOGIN)
// ==========================================
function checkLogin() {
  const session = localStorage.getItem('ahirSessionActive');
  if (session === 'true') {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    
    // Guest modu kontrolü
    const role = localStorage.getItem('ahirUserRole');
    if (role === 'guest') {
      document.body.classList.add('guest-mode');
    } else {
      document.body.classList.remove('guest-mode');
    }
    
    return true;
  } else {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
    return false;
  }
}

function attemptLogin() {
  const user = (document.getElementById('login-username').value || '').trim().toLowerCase();
  const pass = (document.getElementById('login-password').value || '').trim();
  const errorEl = document.getElementById('login-error');

  if (!appData || !appData.users) {
      errorEl.textContent = "Sunucuya bağlanıyor, lütfen biraz bekleyip tekrar deneyin...";
      errorEl.style.display = 'block';
      return;
  }

  const validUser = appData.users.find(function(u) { return u.user === user && u.pass === pass; });

  if (validUser) {
    localStorage.setItem('ahirSessionActive', 'true');
    localStorage.setItem('ahirCurrentUser', user);
    localStorage.setItem('ahirUserRole', validUser.role || 'admin'); // Varsayılan admin
    
    if ((validUser.role || 'admin') === 'guest') {
      document.body.classList.add('guest-mode');
    } else {
      document.body.classList.remove('guest-mode');
    }
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    errorEl.style.display = 'none';
    initializeApp(); // Start app after login
  } else {
    errorEl.textContent = "Hatalı kullanıcı adı veya şifre!";
    errorEl.style.display = 'block';
  }
}

function dismissInstallBanner() {
  var banner = document.getElementById('pwa-install-banner');
  if (banner) banner.classList.remove('show');
}

// ==========================================
// SERVICE WORKER REGISTRATION
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      console.log('Service Worker kayıtlı:', registration.scope);
    }).catch(function(err) {
      console.log('Service Worker kaydı başarısız:', err);
    });
  });
}

// ==========================================
// EVENT LISTENERS & INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  // Veriyi arkaplanda yükle ki login ekranında users hazır olsun
  loadData();

  // Login kontrolü (Eğer login değilse popup açılır)
  checkLogin();
});

function initializeApp() {
  // Otomatik yedekleme kontrolü (7 gün)
  if (!appData.lastBackupDate) {
    appData.lastBackupDate = new Date().toISOString();
    saveData();
  } else {
    var lastBackup = new Date(appData.lastBackupDate);
    var now = new Date();
    var diffDays = Math.floor((now - lastBackup) / (1000 * 60 * 60 * 24));
    if (diffDays >= 7) {
      setTimeout(function() {
        if (confirm("⚠️ 1 Haftadır yedekleme yapmadınız!\nVerilerinizin güvenliği için yedekleme dosyasını şimdi indirmek ister misiniz?")) {
          exportData();
          appData.lastBackupDate = new Date().toISOString();
          saveData();
        }
      }, 1500); // Popup delay
    }
  }

  // Dashboard'u güncelle
  updateDashboard();

  // Yem toplam otomatik hesaplama
  var yeBirim = document.getElementById('ye-birim');
  var yeAdet = document.getElementById('ye-adet');
  if (yeBirim) yeBirim.addEventListener('input', updateYemToplam);
  if (yeAdet) yeAdet.addEventListener('input', updateYemToplam);

  // Veteriner toplam otomatik hesaplama
  var veAdet = document.getElementById('ve-adet');
  var veBirim = document.getElementById('ve-birim');
  var veHizmet = document.getElementById('ve-hizmet');
  if (veAdet) veAdet.addEventListener('input', updateVetToplam);
  if (veBirim) veBirim.addEventListener('input', updateVetToplam);
  if (veHizmet) veHizmet.addEventListener('input', updateVetToplam);

  // Varsayılan tarihleri ayarla
  var today = getTodayStr();
  var heTarih = document.getElementById('he-tarih');
  if (heTarih && !heTarih.value) heTarih.value = today;
  var yeTarih = document.getElementById('ye-tarih');
  if (yeTarih && !yeTarih.value) yeTarih.value = today;

  // Hayvan tablosu filtre girişi
  var filterInput = document.getElementById('filter-hayvan-listesi');
  if (filterInput) {
    filterInput.addEventListener('input', renderAnimalTable);
  }

  // Enter tuşu desteği arama girişleri için
  var haKupe = document.getElementById('ha-kupe');
  if (haKupe) {
    haKupe.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') searchAnimal();
    });
  }

  var kaKupe = document.getElementById('ka-kupe');
  if (kaKupe) {
    kaKupe.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') searchKurbanlik();
    });
  }

  var maMusteri = document.getElementById('ma-musteri');
  if (maMusteri) {
    maMusteri.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') searchCustomer();
    });
  }

  // Navigasyon tıklama olayları
  document.querySelectorAll('.nav-item').forEach(function(navItem) {
    navItem.addEventListener('click', function(e) {
      e.preventDefault();
      var sectionId = this.getAttribute('data-section');
      if (sectionId) navigateTo(sectionId);
    });
  });

  // Overlay tıklamasıyla sidebar kapatma
  var overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.addEventListener('click', function() {
      toggleSidebar();
    });
  }

  // Hamburger menü butonu
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function() {
      toggleSidebar();
    });
  }

  console.log('Ali Ahır - Ahır Yönetim Sistemi başlatıldı. Toplam hayvan: ' + appData.animals.length);
}

// ==========================================
// YENİ ÖZELLİKLER (Toplu Sil, Hisse Sil, Görevler, Uyarılar)
// ==========================================
function toggleAllCheckboxes(source, tableId) {
  var checkboxes = document.querySelectorAll(tableId + ' tbody .row-checkbox');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = source.checked;
  }
}

function deleteSelected(type) {
  var tableId = '';
  var dataArray = [];
  var renderFunc = null;

  if (type === 'animals') { tableId = '#table-hayvan-listesi'; dataArray = appData.animals; renderFunc = renderAnimalTable; }
  else if (type === 'sales') { tableId = '#table-kurbanlik-satisi'; dataArray = appData.sales; renderFunc = renderSalesTable; }
  else if (type === 'feeds') { tableId = '#table-yem-veri'; dataArray = appData.feedPurchases; renderFunc = renderFeedTable; }
  else if (type === 'vets') { tableId = '#table-vet-veri'; dataArray = appData.vetExpenses; renderFunc = renderVetTable; }

  var checkboxes = document.querySelectorAll(tableId + ' tbody .row-checkbox:checked');
  if (checkboxes.length === 0) {
    showToast('Lütfen silinecek kayıtları seçin.', 'warning');
    return;
  }

  if (confirm(checkboxes.length + ' adet kaydı silmek istediğinize emin misiniz?')) {
    // Toplu silme yaparken indexlerin kaymaması için büyükten küçüğe sıralayıp silmeliyiz
    var indices = [];
    checkboxes.forEach(function(cb) { indices.push(parseInt(cb.value)); });
    indices.sort(function(a, b) { return b - a; });

    indices.forEach(function(index) {
      if (type === 'sales') {
        var sale = dataArray[index];
        var animal = appData.animals.find(function(a) { return a.kupeNo === sale.kupeNo; });
        if (animal) animal.satisDurumu = 'STOKTA';
      }
      dataArray.splice(index, 1);
    });

    // Checkbox master'ı uncheck yap
    var master = document.querySelector(tableId + ' thead input[type="checkbox"]');
    if (master) master.checked = false;

    saveData();
    renderFunc();
    if (type === 'sales' || type === 'animals') updateDashboard();
    if (type === 'feeds' || type === 'vets') distributeCosts();
    
    showToast(checkboxes.length + ' adet kayıt başarıyla silindi.', 'success');
  }
}

function deleteHisse(kupeNo, musteriAdi) {
  if (!confirm('Bu hissedarı (' + musteriAdi + ') silmek istediğinize emin misiniz?')) return;

  var salesIndex = appData.sales.findIndex(function(s) {
    return s.kupeNo === kupeNo && s.musteriAdi === musteriAdi;
  });

  if (salesIndex !== -1) {
    var sale = appData.sales[salesIndex];
    var animal = appData.animals.find(function(a) { return a.kupeNo === sale.kupeNo; });
    if (animal) animal.satisDurumu = 'STOKTA';
    appData.sales.splice(salesIndex, 1);
  } else {
    var kcIndex = appData.kurbanlikCikti.findIndex(function(k) {
      return k.kupeNo === kupeNo && k.musteriAdi === musteriAdi;
    });
    if (kcIndex !== -1) appData.kurbanlikCikti.splice(kcIndex, 1);
  }

  saveData();
  renderKurbanlikCiktiTable();
  updateDashboard();
  showToast('Hissedar başarıyla silindi.', 'success');
}

// TODO ve UYARILAR
function addTodo() {
  var input = document.getElementById('todo-input');
  var text = (input.value || '').trim();
  if (!text) return;

  if (!appData.todos) appData.todos = [];
  appData.todos.push({
    id: Date.now().toString(),
    text: text,
    done: false
  });

  input.value = '';
  saveData();
  renderTodos();
}

function toggleTodo(id) {
  var todo = appData.todos.find(function(t) { return t.id === id; });
  if (todo) {
    todo.done = !todo.done;
    saveData();
    renderTodos();
  }
}

function deleteTodo(id) {
  var idx = appData.todos.findIndex(function(t) { return t.id === id; });
  if (idx !== -1) {
    appData.todos.splice(idx, 1);
    saveData();
    renderTodos();
  }
}

function renderTodos() {
  var list = document.getElementById('todo-list');
  if (!list) return;

  if (!appData.todos || appData.todos.length === 0) {
    list.innerHTML = '<li style="color:var(--color-text-secondary); text-align:center; padding: 12px;">Henüz görev eklenmemiş.</li>';
    return;
  }

  var html = '';
  appData.todos.forEach(function(t) {
    var style = t.done ? 'text-decoration: line-through; opacity: 0.6;' : '';
    html += '<li style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom: 1px solid var(--color-border);">';
    html += '<div style="display:flex; align-items:center; gap:8px; flex:1; cursor:pointer;" onclick="toggleTodo(\'' + t.id + '\')">';
    html += '<input type="checkbox" ' + (t.done ? 'checked' : '') + ' onclick="event.stopPropagation(); toggleTodo(\'' + t.id + '\')">';
    html += '<span style="' + style + '">' + escapeHtml(t.text) + '</span>';
    html += '</div>';
    html += '<button style="background:none; border:none; color:var(--color-danger); cursor:pointer;" onclick="deleteTodo(\'' + t.id + '\')">❌</button>';
    html += '</li>';
  });

  list.innerHTML = html;
}

function renderAlerts() {
  var list = document.getElementById('alert-list');
  if (!list) return;

  var alerts = [];

  var kurbanliklar = appData.animals.filter(function(a) { return a.durum === 'KURBANLIK'; });
  var kurbanlikBosHisseler = [];

  var sales = appData.sales || [];
  kurbanliklar.forEach(function(a) {
    var satilan = sales.filter(function(s) { return s.kupeNo === a.kupeNo && s.satisTuru && s.satisTuru.includes('Hisse'); });
    var satilanHisse = satilan.reduce(function(sum, s) { return sum + (parseInt(s.satisTuru) || 1); }, 0);
    var kc = appData.kurbanlikCikti.filter(function(k) { return k.kupeNo === a.kupeNo; });
    satilanHisse += kc.length;

    if (satilanHisse > 0 && satilanHisse < 7) {
      kurbanlikBosHisseler.push(a.kupeNo + ' (' + (7 - satilanHisse) + ' boş hisse)');
    }
  });

  if (kurbanlikBosHisseler.length > 0) {
    var detay = kurbanlikBosHisseler.join('<br>');
    alerts.push({ 
      icon: '⚠️', 
      text: '<details><summary style="cursor:pointer; font-weight:bold;">' + kurbanlikBosHisseler.length + ' adet kurbanlıkta satılmamış (boş) hisseler bulunuyor.</summary><div style="margin-top:8px; font-size:0.9em; opacity:0.9;">' + detay + '</div></details>', 
      color: 'var(--color-warning)' 
    });
  }

  var eksikTahsilatListesi = [];
  sales.forEach(function(s) {
    if (s.satisFiyati > s.alinanToplam) {
      eksikTahsilatListesi.push(escapeHtml(s.musteriAdi) + ' (' + escapeHtml(s.kupeNo) + ') - Kalan: ' + formatMoney(s.satisFiyati - s.alinanToplam));
    }
  });
  if (eksikTahsilatListesi.length > 0) {
    var detay = eksikTahsilatListesi.join('<br>');
    alerts.push({ 
      icon: '💰', 
      text: '<details><summary style="cursor:pointer; font-weight:bold;">' + eksikTahsilatListesi.length + ' adet satışın tahsilatı henüz tamamlanmadı.</summary><div style="margin-top:8px; font-size:0.9em; opacity:0.9;">' + detay + '</div></details>', 
      color: 'var(--color-danger)' 
    });
  }

  var stoktaBesi = appData.animals.filter(function(a) { return a.durum === 'BESİ' && a.satisDurumu === 'STOKTA'; });
  if (stoktaBesi.length > 0) {
    var detay = stoktaBesi.map(function(a) { return a.kupeNo; }).join(', ');
    alerts.push({ 
      icon: 'ℹ️', 
      text: '<details><summary style="cursor:pointer; font-weight:bold;">Stokta satılmayı bekleyen ' + stoktaBesi.length + ' adet besi hayvanı var.</summary><div style="margin-top:8px; font-size:0.9em; opacity:0.9;">Küpe No: ' + escapeHtml(detay) + '</div></details>', 
      color: 'var(--color-info)' 
    });
  }

  var yakinDogumlar = [];
  var now = new Date();
  (appData.pregnancies || []).forEach(function(p) {
    if (p.durum === 'Gebe' && p.dogum) {
      var birthDate = new Date(p.dogum);
      var diff = (birthDate - now) / (1000 * 60 * 60 * 24);
      if (diff <= 7 && diff >= -30) {
        var remainingDays = Math.ceil(diff);
        if (remainingDays < 0) {
          yakinDogumlar.push(escapeHtml(p.kupeNo) + ' (Doğum gecikti: ' + Math.abs(remainingDays) + ' gün)');
        } else if (remainingDays === 0) {
          yakinDogumlar.push(escapeHtml(p.kupeNo) + ' (Doğum bugün veya yarın)');
        } else {
          yakinDogumlar.push(escapeHtml(p.kupeNo) + ' (' + remainingDays + ' gün kaldı)');
        }
      }
    }
  });
  if (yakinDogumlar.length > 0) {
    var detay = yakinDogumlar.join('<br>');
    alerts.push({ 
      icon: '🐄', 
      text: '<details><summary style="cursor:pointer; font-weight:bold;">' + yakinDogumlar.length + ' adet hayvanın doğumu yaklaştı veya gecikti!</summary><div style="margin-top:8px; font-size:0.9em; opacity:0.9;">' + detay + '</div></details>', 
      color: 'var(--color-warning)' 
    });
  }
  if (alerts.length === 0) {
    list.innerHTML = '<li style="color:var(--color-success); text-align:center; padding: 12px;">✅ Tüm sistem harika görünüyor! Uyarı yok.</li>';
    return;
  }

  var html = '';
  alerts.forEach(function(a) {
    html += '<li style="display:flex; gap:8px; padding: 10px 0; border-bottom: 1px solid var(--color-border); align-items:flex-start;">';
    html += '<span style="margin-top:2px;">' + a.icon + '</span>';
    html += '<div style="color:' + a.color + '; font-size:0.9em; line-height:1.4; width:100%;">' + a.text + '</div>';
    html += '</li>';
  });

  list.innerHTML = html;
}

// ==========================================
// MÜŞTERİ LİSTESİ (CUSTOMER MANAGEMENT)
// ==========================================
function renderCustomerTable() {
  var tbody = document.querySelector('#table-musteri-listesi tbody');
  if (!tbody) return;

  var filter = (document.getElementById('filter-musteri-listesi')?.value || '').toLowerCase();

  var customers = {};

  // Eski kurbanlık çıktı kayıtları
  (appData.kurbanlikCikti || []).forEach(function(k) {
    var name = (k.musteriAdi || '').trim();
    if (!name) return;
    if (!customers[name]) {
      customers[name] = { ad: name, hayvanCount: 0, hisseCount: 0, alisveris: 0, odenen: 0 };
    }
    customers[name].hisseCount++;
    customers[name].alisveris += parseFloat(k.satisFiyati) || 0;
    customers[name].odenen += parseFloat(k.alinanUcret) || 0;
  });

  // Normal satışlar (Hisseli veya Tam)
  (appData.sales || []).forEach(function(s) {
    var name = (s.musteriAdi || '').trim();
    if (!name) return;
    if (!customers[name]) {
      customers[name] = { ad: name, telefon: s.musteriTel || '-', hayvanCount: 0, hisseCount: 0, alisveris: 0, odenen: 0 };
    }
    // Eger sonradan telefon eklendiyse ve oncekinde yoksa guncelle
    if (s.musteriTel && customers[name].telefon === '-') {
      customers[name].telefon = s.musteriTel;
    }
    
    var isHisse = s.satisTuru && s.satisTuru.includes('Hisse');
    if (isHisse) {
      customers[name].hisseCount += (parseInt(s.satisTuru) || 1);
    } else {
      customers[name].hayvanCount++;
    }
    
    customers[name].alisveris += parseFloat(s.satisFiyati) || 0;
    customers[name].odenen += parseFloat(s.alinanToplam) || 0;
  });

  var list = Object.values(customers).filter(function(c) {
    return c.ad.toLowerCase().includes(filter);
  });

  // Kalan borca göre çoktan aza sıralama
  list.sort(function(a, b) {
    var borcA = a.alisveris - a.odenen;
    var borcB = b.alisveris - b.odenen;
    return borcB - borcA;
  });

  var totalAlacakli = 0;
  var totalAlacak = 0;
  var totalOdenen = 0;

  var html = '';
  list.forEach(function(c) {
    var kalan = c.alisveris - c.odenen;
    if (kalan > 0) {
      totalAlacakli++;
      totalAlacak += kalan;
    }
    totalOdenen += c.odenen;

    var satinAldigi = [];
    if (c.hayvanCount > 0) satinAldigi.push(c.hayvanCount + ' Hayvan');
    if (c.hisseCount > 0) satinAldigi.push(c.hisseCount + ' Hisse');
    var aldigiText = satinAldigi.join(', ') || '-';

    html += '<tr>';
    html += '<td data-label="Seç"><input type="checkbox" value="' + escapeHtml(c.ad) + '"></td>';
    html += '<td data-label="Müşteri Adı" class="font-bold">' + escapeHtml(c.ad) + '</td>';
    html += '<td data-label="Telefon No">' + escapeHtml(c.telefon || '-') + '</td>';
    html += '<td data-label="Satın Aldığı">' + escapeHtml(aldigiText) + '</td>';
    html += '<td data-label="Toplam Alışveriş">' + formatMoney(c.alisveris) + '</td>';
    html += '<td data-label="Ödenen Tutar">' + formatMoney(c.odenen) + '</td>';
    html += '<td data-label="Kalan Borç" class="font-bold ' + (kalan > 0 ? 'text-danger' : 'text-success') + '">' + formatMoney(kalan) + '</td>';
    html += '<td data-label="İşlem" class="admin-only"><button class="btn btn-sm btn-outline" onclick="editCustomerName(\'' + escapeHtml(c.ad).replace(/'/g, "\\'") + '\')">✏️ Adını Değiştir</button></td>';
    html += '</tr>';
  });

  if (list.length === 0) {
    html = '<tr><td colspan="6" class="text-center">Müşteri bulunamadı</td></tr>';
  }

  tbody.innerHTML = html;

  setText('ml-toplam-musteri', list.length);
  setText('ml-alacakli-sayisi', totalAlacakli);
  setText('ml-toplam-alacak', formatMoney(totalAlacak));
  setText('ml-toplam-odenen', formatMoney(totalOdenen));
}

function editCustomerName(oldName) {
  var newName = prompt("'" + oldName + "' adlı müşterinin yeni adını girin:", oldName);
  if (!newName || newName.trim() === '' || newName === oldName) return;
  newName = newName.trim();

  var changed = 0;
  (appData.sales || []).forEach(function(s) {
    if ((s.musteriAdi || '').trim() === oldName) {
      s.musteriAdi = newName;
      changed++;
    }
  });
  (appData.kurbanlikCikti || []).forEach(function(k) {
    if ((k.musteriAdi || '').trim() === oldName) {
      k.musteriAdi = newName;
      changed++;
    }
  });

  if (changed > 0) {
    saveData();
    renderCustomerTable();
    updateDashboard(); // Refresh stats
    if (typeof renderSalesTable === 'function') renderSalesTable();
    if (typeof renderKurbanlikCiktiTable === 'function') renderKurbanlikCiktiTable();
    showToast(changed + " adet kayıtta müşteri adı güncellendi!", "success");
  }
}

function deleteSelectedCustomers() {
  var checkboxes = document.querySelectorAll('#table-musteri-listesi tbody input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    showToast('Silmek için müşteri seçin!', 'error');
    return;
  }

  if (!confirm(checkboxes.length + ' müşteriyi ve onlara ait TÜM satış kayıtlarını silmek istediğinize emin misiniz?\n(Bu işlem geri alınamaz ve bu müşterilere satılan hayvanlar tekrar STOKTA olarak işaretlenir!)')) {
    return;
  }

  var namesToDelete = Array.from(checkboxes).map(function(cb) {
    return cb.value;
  });

  var countSales = 0;
  
  // Normal satışlardan sil ve hayvan durumunu düzelt
  appData.sales = appData.sales.filter(function(s) {
    if (namesToDelete.includes((s.musteriAdi || '').trim())) {
      var animal = appData.animals.find(function(a) { return a.kupeNo === s.kupeNo; });
      if (animal) animal.satisDurumu = 'STOKTA';
      countSales++;
      return false;
    }
    return true;
  });

  // Kurbanlık Çıktıdan sil
  appData.kurbanlikCikti = appData.kurbanlikCikti.filter(function(k) {
    if (namesToDelete.includes((k.musteriAdi || '').trim())) {
      var animal = appData.animals.find(function(a) { return a.kupeNo === k.kupeNo; });
      if (animal) animal.satisDurumu = 'STOKTA';
      countSales++;
      return false;
    }
    return true;
  });

  saveData();
  renderCustomerTable();
  updateDashboard();
  if (typeof renderSalesTable === 'function') renderSalesTable();
  if (typeof renderKurbanlikCiktiTable === 'function') renderKurbanlikCiktiTable();
  
  var chkAll = document.querySelector('#table-musteri-listesi thead input[type="checkbox"]');
  if (chkAll) chkAll.checked = false;

  showToast(countSales + ' adet satış kaydı silindi ve müşteriler kaldırıldı.', 'success');
}

// ==========================================
// ADMİN PANELİ (YETKİLİLER)
// ==========================================
function renderAdminTable() {
  var tbody = document.querySelector('#table-admin-listesi tbody');
  if (!tbody) return;

  var currentUser = localStorage.getItem('ahirCurrentUser') || '';
  var html = '';

  (appData.users || []).forEach(function(u, index) {
    var isMe = (u.user === currentUser);
    var roleText = (u.role === 'guest') ? '<span class="badge badge-warning">Misafir</span>' : '<span class="badge badge-success">Admin</span>';
    html += '<tr>';
    html += '<td data-label="Kullanıcı Adı" class="font-bold">' + escapeHtml(u.user) + ' ' + roleText + (isMe ? ' <span style="color:var(--color-primary-light); font-size:0.8em;">(Siz)</span>' : '') + '</td>';
    html += '<td data-label="Şifre">' + (isMe ? escapeHtml(u.pass) : '••••••••') + '</td>';
    html += '<td data-label="İşlem">';
    if (isMe) {
      html += '<button class="btn btn-sm btn-outline" onclick="editAdminCredentials(' + index + ')">✏️ Bilgilerimi Düzenle</button>';
    } else {
      html += '<span style="color:var(--color-text-muted);">🔒 Düzenlenemez</span>';
    }
    html += '</td>';
    html += '</tr>';
  });

  tbody.innerHTML = html;
}

function editAdminCredentials(index) {
  var userObj = appData.users[index];
  if (!userObj) return;

  var newUsername = prompt("Yeni Kullanıcı Adı belirleyin (Küçük/Büyük harf fark etmez):", userObj.user);
  if (newUsername === null) return;
  newUsername = newUsername.trim().toLowerCase();
  
  if (newUsername === '') {
    showToast("Kullanıcı adı boş olamaz!", "error");
    return;
  }

  // Check if someone else already uses this name
  var existing = appData.users.find(function(u, i) { return i !== index && u.user === newUsername; });
  if (existing) {
    showToast("Bu kullanıcı adı başkası tarafından kullanılıyor!", "error");
    return;
  }

  var newPassword = prompt("Yeni Şifre belirleyin:", userObj.pass);
  if (newPassword === null) return;
  newPassword = newPassword.trim();

  if (newPassword === '') {
    showToast("Şifre boş olamaz!", "error");
    return;
  }

  userObj.user = newUsername;
  userObj.pass = newPassword;
  
  saveData();
  
  // Update local storage so session still works
  localStorage.setItem('ahirCurrentUser', newUsername);
  
  renderAdminTable();
  showToast("Giriş bilgileriniz başarıyla güncellendi!", "success");
}

function addNewAdmin() {
  const role = localStorage.getItem('ahirUserRole');
  if (role === 'guest') {
    showToast('Misafir hesaplar yeni yetkili ekleyemez!', 'error');
    return;
  }

  var newUsername = prompt("Yeni eklenecek yetkilinin ismini girin:");
  if (newUsername === null) return;
  newUsername = newUsername.trim().toLowerCase();
  
  if (newUsername === '') {
    showToast("Kullanıcı adı boş olamaz!", "error");
    return;
  }

  // Check if someone else already uses this name
  var existing = appData.users.find(function(u) { return u.user === newUsername; });
  if (existing) {
    showToast("Bu isimde bir yetkili zaten mevcut!", "error");
    return;
  }

  var newPassword = prompt("Bu yetkili için bir şifre belirleyin:");
  if (newPassword === null) return;
  newPassword = newPassword.trim();

  if (newPassword === '') {
    showToast("Şifre boş olamaz!", "error");
    return;
  }

  var roleInput = prompt("Bu kişinin rolü ne olacak?\n1: Yetkili (Admin)\n2: Misafir (Sadece Okuma)", "1");
  if (roleInput === null) return;
  var newRole = (roleInput === "2") ? "guest" : "admin";

  appData.users.push({ user: newUsername, pass: newPassword, role: newRole });
  saveData();
  renderAdminTable();
  showToast(newUsername + " adlı kullanıcı başarıyla eklendi!", "success");}

// ==========================================
// EXCEL / CSV DIŞA AKTARIM
// ==========================================
function exportTableToCSV(tableId, filename) {
  var table = document.getElementById(tableId);
  if (!table) return;
  var rows = table.querySelectorAll('tr');
  var csv = [];
  
  for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll('td, th');
    
    for (var j = 0; j < cols.length; j++) {
      // Çekmece/Checkbox sütunu ve İşlem sütununu atla
      var text = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, ' ').trim();
      if (text === 'İşlem' || cols[j].querySelector('input[type="checkbox"]') || cols[j].classList.contains('admin-only')) {
        continue;
      }
      // Excel uyumluluğu için tırnak içine al
      row.push('"' + text.replace(/"/g, '""') + '"');
    }
    if (row.length > 0) csv.push(row.join(';'));
  }

  // Türkçe karakter (UTF-8 BOM) uyumluluğu
  var csvFile = new Blob(["\uFEFF" + csv.join('\n')], { type: "text/csv;charset=utf-8;" });
  
  var downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function exportReportToCSV() {
  var csv = [];
  csv.push('Kapakli Mert Besi - Detayli Rapor');
  csv.push('Tarih;' + new Date().toLocaleDateString('tr-TR'));
  csv.push('');
  
  csv.push('Hayvan Dagilimi');
  csv.push('Toplam Hayvan;' + document.getElementById('rapor-toplam-hayvan').innerText);
  csv.push('Aktif Hayvan;' + document.getElementById('rapor-aktif').innerText);
  csv.push('Pasif (Satilmis);' + document.getElementById('rapor-pasif').innerText);
  csv.push('Kurbanlik;' + document.getElementById('rapor-kurbanlik').innerText);
  csv.push('Besi;' + document.getElementById('rapor-besi').innerText);
  csv.push('Damizlik;' + document.getElementById('rapor-damizlik').innerText);
  csv.push('');
  
  csv.push('Mali Ozet');
  csv.push('Toplam Alis Fiyati;' + document.getElementById('rapor-toplam-alis').innerText.replace('₺', '').trim());
  csv.push('Toplam Satis Fiyati;' + document.getElementById('rapor-toplam-satis').innerText.replace('₺', '').trim());
  csv.push('Toplam Yem Maliyeti;' + document.getElementById('rapor-toplam-yem').innerText.replace('₺', '').trim());
  csv.push('Toplam Veteriner Gideri;' + document.getElementById('rapor-toplam-vet').innerText.replace('₺', '').trim());
  csv.push('Toplam Coban Gideri;' + document.getElementById('rapor-toplam-coban').innerText.replace('₺', '').trim());
  csv.push('Kar / Zarar;' + document.getElementById('rapor-kar-zarar').innerText.replace('₺', '').trim());
  csv.push('Kar Yuzdesi;' + document.getElementById('rapor-kar-yuzde').innerText);
  csv.push('');
  
  csv.push('Saglik ve Ureme');
  csv.push('Toplam Yapilan Asi;' + document.getElementById('rapor-toplam-asi').innerText);
  csv.push('Aktif Gebe Hayvan;' + document.getElementById('rapor-aktif-gebe').innerText);
  csv.push('Doguran Hayvan;' + document.getElementById('rapor-doguran').innerText);
  
  var csvFile = new Blob(["\uFEFF" + csv.join('\n')], { type: "text/csv;charset=utf-8;" });
  var downloadLink = document.createElement("a");
  downloadLink.download = 'Detayli_Rapor.csv';
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// ==========================================
// AŞI TAKVİMİ YÖNETİMİ
// ==========================================
function addVaccine() {
  const role = localStorage.getItem('ahirUserRole');
  if (role === 'guest') {
    showToast('Misafir hesaplar aşı ekleyemez!', 'error');
    return;
  }

  var kupeNo = (document.getElementById('asi-kupe')?.value || '').trim();
  var ad = (document.getElementById('asi-ad')?.value || '').trim();
  var tarih = document.getElementById('asi-tarih')?.value || '';
  var tekrar = document.getElementById('asi-tekrar')?.value || '';
  var aciklama = (document.getElementById('asi-aciklama')?.value || '').trim();

  if (!kupeNo || !ad || !tarih) {
    showToast('Küpe No, Aşı Adı ve Tarih zorunludur!', 'error');
    return;
  }

  appData.vaccines.push({
    kupeNo: kupeNo,
    ad: ad,
    tarih: tarih,
    tekrar: tekrar,
    aciklama: aciklama
  });

  saveData();
  renderVaccineList();
  updateReport();

  document.getElementById('asi-kupe').value = '';
  document.getElementById('asi-ad').value = '';
  document.getElementById('asi-tarih').value = '';
  document.getElementById('asi-tekrar').value = '';
  document.getElementById('asi-aciklama').value = '';
  showToast('Aşı kaydı eklendi', 'success');
}

function renderVaccineList() {
  var tbody = document.querySelector('#table-asi tbody');
  if (!tbody) return;

  var html = '';
  var list = (appData.vaccines || []).slice().reverse();

  list.forEach(function(v, reverseIndex) {
    var realIndex = (appData.vaccines.length - 1) - reverseIndex;
    
    // Tekrar tarihi yaklaşanlara renk ver
    var tekrarRenk = '';
    if (v.tekrar) {
      var d = new Date(v.tekrar);
      var now = new Date();
      var diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
      if (diff < 0) tekrarRenk = 'color: var(--color-danger); font-weight: bold;';
      else if (diff <= 7) tekrarRenk = 'color: var(--color-warning); font-weight: bold;';
    }

    html += '<tr>';
    html += '<td data-label="Tarih">' + formatDate(v.tarih) + '</td>';
    html += '<td data-label="Küpe No" class="font-bold">' + escapeHtml(v.kupeNo) + '</td>';
    html += '<td data-label="Aşı Adı">' + escapeHtml(v.ad) + '</td>';
    html += '<td data-label="Tekrar Tarihi" style="' + tekrarRenk + '">' + (v.tekrar ? formatDate(v.tekrar) : '-') + '</td>';
    html += '<td data-label="Açıklama">' + escapeHtml(v.aciklama || '-') + '</td>';
    html += '<td data-label="İşlem" class="admin-only"><button class="btn btn-sm btn-danger" onclick="deleteVaccine(' + realIndex + ')">🗑️</button></td>';
    html += '</tr>';
  });

  if (list.length === 0) {
    html = '<tr><td colspan="6" class="text-center">Aşı kaydı bulunamadı</td></tr>';
  }

  tbody.innerHTML = html;
}

function deleteVaccine(index) {
  if (confirm('Bu aşı kaydını silmek istediğinize emin misiniz?')) {
    appData.vaccines.splice(index, 1);
    saveData();
    renderVaccineList();
    updateReport();
  }
}

// ==========================================
// GEBELİK TAKİBİ YÖNETİMİ
// ==========================================
function suggestBirthDate() {
  var tTarih = document.getElementById('gebelik-tarih')?.value;
  if (tTarih) {
    var d = new Date(tTarih);
    d.setDate(d.getDate() + 283); // Ortalama 283 gün
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    document.getElementById('gebelik-dogum').value = yyyy + '-' + mm + '-' + dd;
  }
}

function addPregnancy() {
  const role = localStorage.getItem('ahirUserRole');
  if (role === 'guest') {
    showToast('Misafir hesaplar gebelik ekleyemez!', 'error');
    return;
  }

  var kupeNo = (document.getElementById('gebelik-kupe')?.value || '').trim();
  var tarih = document.getElementById('gebelik-tarih')?.value || '';
  var boga = (document.getElementById('gebelik-boga')?.value || '').trim();
  var dogum = document.getElementById('gebelik-dogum')?.value || '';

  if (!kupeNo || !tarih || !dogum) {
    showToast('Küpe No, Tohumlama Tarihi ve Tahmini Doğum Tarihi zorunludur!', 'error');
    return;
  }

  appData.pregnancies.push({
    kupeNo: kupeNo,
    tarih: tarih,
    boga: boga,
    dogum: dogum,
    durum: 'Gebe'
  });

  saveData();
  renderPregnancyList();
  updateReport();

  document.getElementById('gebelik-kupe').value = '';
  document.getElementById('gebelik-tarih').value = '';
  document.getElementById('gebelik-boga').value = '';
  document.getElementById('gebelik-dogum').value = '';
  showToast('Gebelik kaydı eklendi', 'success');
}

function renderPregnancyList() {
  var tbody = document.querySelector('#table-gebelik tbody');
  if (!tbody) return;

  var html = '';
  var list = (appData.pregnancies || []).slice().reverse();

  list.forEach(function(p, reverseIndex) {
    var realIndex = (appData.pregnancies.length - 1) - reverseIndex;
    
    var kalanSure = '-';
    var kalanRenk = '';
    if (p.durum === 'Gebe' && p.dogum) {
      var d = new Date(p.dogum);
      var now = new Date();
      var diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
      
      if (diff < 0) {
        kalanSure = Math.abs(diff) + ' gün geçti';
        kalanRenk = 'color: var(--color-danger); font-weight: bold;';
      } else {
        kalanSure = diff + ' gün kaldı';
        if (diff <= 15) kalanRenk = 'color: var(--color-warning); font-weight: bold;';
        else kalanRenk = 'color: var(--color-success); font-weight: bold;';
      }
    }

    var durumClass = '';
    if (p.durum === 'Gebe') durumClass = 'badge-success';
    else if (p.durum === 'Doğurdu') durumClass = 'badge-primary';
    else durumClass = 'badge-danger';

    html += '<tr>';
    html += '<td data-label="Küpe No" class="font-bold">' + escapeHtml(p.kupeNo) + '</td>';
    html += '<td data-label="Tohumlama Tarihi">' + formatDate(p.tarih) + '</td>';
    html += '<td data-label="Boğa / Irk">' + escapeHtml(p.boga || '-') + '</td>';
    html += '<td data-label="Tahmini Doğum">' + formatDate(p.dogum) + '</td>';
    html += '<td data-label="Kalan Süre" style="' + kalanRenk + '">' + kalanSure + '</td>';
    html += '<td data-label="Durum" class="admin-only"><select onchange="updatePregnancyStatus(' + realIndex + ', this.value)" class="form-input" style="padding: 2px 5px; height: auto;">';
    html += '<option value="Gebe" ' + (p.durum === 'Gebe' ? 'selected' : '') + '>Gebe</option>';
    html += '<option value="Doğurdu" ' + (p.durum === 'Doğurdu' ? 'selected' : '') + '>Doğurdu</option>';
    html += '<option value="Yavru Attı" ' + (p.durum === 'Yavru Attı' ? 'selected' : '') + '>Yavru Attı</option>';
    html += '</select></td>';
    
    // Mobil/Misafir görünümü için durum text'i
    html += '<td data-label="Durum" style="display:none;" class="guest-only"><span class="badge ' + durumClass + '">' + p.durum + '</span></td>';

    html += '<td data-label="İşlem" class="admin-only"><button class="btn btn-sm btn-danger" onclick="deletePregnancy(' + realIndex + ')">🗑️</button></td>';
    html += '</tr>';
  });

  if (list.length === 0) {
    html = '<tr><td colspan="7" class="text-center">Gebelik kaydı bulunamadı</td></tr>';
  }

  tbody.innerHTML = html;
  
  // Style düzenlemeleri (admin / guest only sınıflarını tabloya özel işletmek için)
  const role = localStorage.getItem('ahirUserRole');
  if (role === 'guest') {
    tbody.querySelectorAll('.guest-only').forEach(el => el.style.display = 'table-cell');
  }
}

function updatePregnancyStatus(index, status) {
  if (appData.pregnancies[index]) {
    appData.pregnancies[index].durum = status;
    saveData();
    renderPregnancyList();
    updateReport();
  }
}

function deletePregnancy(index) {
  if (confirm('Bu gebelik kaydını silmek istediğinize emin misiniz?')) {
    appData.pregnancies.splice(index, 1);
    saveData();
    renderPregnancyList();
    updateReport();
  }
}

// ==========================================
// ÇOBAN GİDERLERİ YÖNETİMİ
// ==========================================
function addCoban() {
  const role = localStorage.getItem('ahirUserRole');
  if (role === 'guest') {
    showToast('Misafir hesaplar çoban ekleyemez!', 'error');
    return;
  }

  var isim = (document.getElementById('ce-isim')?.value || '').trim();
  var yas = document.getElementById('ce-yas')?.value || '';
  var maas = parseFloat(document.getElementById('ce-maas')?.value) || 0;
  var gorev = (document.getElementById('ce-gorev')?.value || '').trim();

  if (!isim) {
    showToast('Lütfen çoban adı girin!', 'error');
    return;
  }

  appData.shepherds.push({
    id: Date.now().toString(),
    isim: isim,
    yas: yas,
    maas: maas,
    gorev: gorev
  });

  saveData();
  renderCobanList();
  
  document.getElementById('coban-ekle-form').reset();
  showToast('Çoban başarıyla eklendi.', 'success');
}

function addCobanGider() {
  const role = localStorage.getItem('ahirUserRole');
  if (role === 'guest') {
    showToast('Misafir hesaplar gider ekleyemez!', 'error');
    return;
  }

  var cobanId = document.getElementById('cg-coban')?.value;
  var tutar = parseFloat(document.getElementById('cg-tutar')?.value) || 0;
  var tarih = document.getElementById('cg-tarih')?.value || getTodayStr();
  var aciklama = (document.getElementById('cg-aciklama')?.value || '').trim();

  if (!cobanId || tutar <= 0) {
    showToast('Lütfen geçerli bir çoban seçin ve tutar girin!', 'error');
    return;
  }

  appData.shepherdExpenses.push({
    id: Date.now().toString(),
    cobanId: cobanId,
    tutar: tutar,
    tarih: tarih,
    aciklama: aciklama
  });

  saveData();
  renderCobanGiderList();
  updateReport(); // Gideri genel toplama yansıtmak için
  
  document.getElementById('coban-gider-form').reset();
  document.getElementById('cg-tarih').value = getTodayStr();
  showToast('Ödeme başarıyla kaydedildi.', 'success');
}

function renderCobanList() {
  var tbody = document.querySelector('#table-coban-listesi tbody');
  var select = document.getElementById('cg-coban');
  if (!tbody || !select) return;

  var html = '';
  var options = '<option value="">-- Çoban Seçin --</option>';

  (appData.shepherds || []).forEach(function(c, i) {
    html += '<tr>';
    html += '<td data-label="İsim Soyisim" class="font-bold">' + escapeHtml(c.isim) + '</td>';
    html += '<td data-label="Yaş">' + escapeHtml(c.yas || '-') + '</td>';
    html += '<td data-label="Görev">' + escapeHtml(c.gorev || '-') + '</td>';
    html += '<td data-label="Aylık Ücret">' + formatMoney(c.maas) + '</td>';
    html += '<td data-label="İşlem" class="admin-only"><button class="btn btn-sm btn-danger" onclick="deleteCoban(' + i + ')">🗑️ Sil</button></td>';
    html += '</tr>';

    options += '<option value="' + c.id + '">' + escapeHtml(c.isim) + '</option>';
  });

  if ((appData.shepherds || []).length === 0) {
    html = '<tr><td colspan="5" class="text-center">Kayıtlı çoban bulunamadı</td></tr>';
  }

  tbody.innerHTML = html;
  select.innerHTML = options;
}

function deleteCoban(index) {
  if (confirm('Bu çobanı silmek istediğinize emin misiniz?')) {
    appData.shepherds.splice(index, 1);
    saveData();
    renderCobanList();
  }
}

function renderCobanGiderList() {
  var tbody = document.querySelector('#table-coban-giderleri tbody');
  if (!tbody) return;

  var html = '';
  
  // Ters sırala (en yeni en üstte)
  var expenses = (appData.shepherdExpenses || []).slice().reverse();
  var shepherds = appData.shepherds || [];

  var toplamGider = 0;
  expenses.forEach(function(g, reverseIndex) {
    toplamGider += (parseFloat(g.tutar) || 0);
    var realIndex = (appData.shepherdExpenses.length - 1) - reverseIndex;
    var coban = shepherds.find(function(c) { return c.id === g.cobanId; });
    var cobanIsim = coban ? coban.isim : 'Silinmiş Çoban';

    html += '<tr>';
    html += '<td data-label="Tarih">' + formatDate(g.tarih) + '</td>';
    html += '<td data-label="Çoban" class="font-bold">' + escapeHtml(cobanIsim) + '</td>';
    html += '<td data-label="Açıklama">' + escapeHtml(g.aciklama || '-') + '</td>';
    html += '<td data-label="Ödenen Tutar">' + formatMoney(g.tutar) + '</td>';
    html += '<td data-label="İşlem" class="admin-only"><button class="btn btn-sm btn-danger" onclick="deleteCobanGider(' + realIndex + ')">🗑️ Sil</button></td>';
    html += '</tr>';
  });

  if (expenses.length === 0) {
    html = '<tr><td colspan="5" class="text-center">Ödeme geçmişi bulunamadı</td></tr>';
  }

  tbody.innerHTML = html;

  // Özet kartlarını güncelle
  var toplamMaas = shepherds.reduce(function(s, c) { return s + (parseFloat(c.maas) || 0); }, 0);
  setText('coban-toplam-sayi', shepherds.length);
  setText('coban-aylik-maas', formatMoney(toplamMaas));
  setText('coban-toplam-gider', formatMoney(toplamGider));
}

function deleteCobanGider(index) {
  if (confirm('Bu ödeme kaydını silmek istediğinize emin misiniz?')) {
    appData.shepherdExpenses.splice(index, 1);
    saveData();
    renderCobanGiderList();
    updateReport();
  }
}

// ==========================================
// ==========================================
// FOTOĞRAF YÜKLEME, SIKIŞTIRMA VE SİLME
// ==========================================
function previewPhoto(input, imgId, removeBtnId) {
  if (input.files && input.files[0]) {
    var file = input.files[0];
    
    var processFile = function(fileToProcess) {
      var fileType = fileToProcess.type || '';
      if (fileType && !fileType.match('image.*')) {
        showToast('Lütfen geçerli bir resim dosyası seçin!', 'error');
        input.value = '';
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onerror = function() {
          showToast('Resim yüklenemedi. Lütfen geçerli bir dosya seçin!', 'error');
          input.value = '';
        };
        img.onload = function() {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var MAX_WIDTH = 400;
          var MAX_HEIGHT = 400;
          var width = img.width;
          var height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          var dataUrl = canvas.toDataURL('image/jpeg', 0.4);
          var previewImg = document.getElementById(imgId);
          if (previewImg) { previewImg.src = dataUrl; previewImg.style.display = 'block'; }
          if (removeBtnId) {
            var removeBtn = document.getElementById(removeBtnId);
            if (removeBtn) removeBtn.style.display = 'block';
          }
        }
        img.src = e.target.result;
      }
      reader.readAsDataURL(fileToProcess);
    };

    var fileName = file.name.replace(/İ/g, 'i').replace(/I/g, 'i').toLowerCase();
    if (/\.(heic|heif)$/i.test(fileName)) {
      if (typeof heic2any !== 'undefined') {
        showToast('HEIC fotoğraf dönüştürülüyor, lütfen bekleyin...', 'info');
        heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 })
          .then(function(resultBlob) {
            var blob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
            var convertedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg"
            });
            processFile(convertedFile);
          })
          .catch(function(error) {
            console.error('HEIC dönüşüm hatası:', error);
            showToast('HEIC fotoğraf dönüştürülemedi!', 'error');
            input.value = '';
          });
      } else {
        showToast('HEIC formatı için dönüştürücü yüklenemedi. Lütfen JPEG/PNG kullanın.', 'error');
        input.value = '';
      }
    } else {
      processFile(file);
    }
  } else {
    var previewImg = document.getElementById(imgId);
    if (previewImg) { previewImg.src = ''; previewImg.style.display = 'none'; }
    if (removeBtnId) {
      var removeBtn = document.getElementById(removeBtnId);
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }
}

function removePhoto(inputId, imgId, removeBtnId) {
  var input = document.getElementById(inputId);
  if (input) input.value = '';
  
  var previewImg = document.getElementById(imgId);
  if (previewImg) { previewImg.src = ''; previewImg.style.display = 'none'; }
  
  var removeBtn = document.getElementById(removeBtnId);
  if (removeBtn) removeBtn.style.display = 'none';
}

function updateKupeList() {
  var dataList = document.getElementById('kupe-list');
  if (!dataList) return;
  var html = '';
  var sortedAnimals = [...(appData.animals || [])].sort((a, b) => a.kupeNo.localeCompare(b.kupeNo, undefined, {numeric: true, sensitivity: 'base'}));
  sortedAnimals.forEach(function(a) {
    html += '<option value="' + escapeHtml(a.kupeNo) + '">';
  });
  dataList.innerHTML = html;
}
