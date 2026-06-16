// ==========================================
// ALİ AHIR - AHIR YÖNETİM SİSTEMİ
// Tam Uygulama Mantığı (app.js)
// ==========================================

// ==========================================
// STATE MANAGEMENT
// ==========================================
let appData = {};

function loadData() {
  try {
    const saved = localStorage.getItem('ahirYonetimData');
    if (saved) {
      appData = JSON.parse(saved);
      // Eksik alanları varsayılan veriden tamamla
      if (!appData.animals) appData.animals = [];
      if (!appData.sales) appData.sales = [];
      if (!appData.feedPurchases) appData.feedPurchases = [];
      if (!appData.vetExpenses) appData.vetExpenses = [];
      if (!appData.kurbanlikCikti) appData.kurbanlikCikti = [];
      if (!appData.todos) appData.todos = [];
    } else {
      appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData();
    }
  } catch (err) {
    console.error('Veri yüklenirken hata:', err);
    appData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
  }
}

function saveData() {
  try {
    localStorage.setItem('ahirYonetimData', JSON.stringify(appData));
  } catch (err) {
    console.error('Veri kaydedilirken hata:', err);
    showToast('Veri kaydedilemedi! Depolama alanı dolu olabilir.', 'error');
  }
}

// ==========================================
// NAVIGATION (replaces all SayfayaGit_* macros)
// ==========================================
function navigateTo(sectionId) {
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

function toggleSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.querySelector('.overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
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
    case 'section-rapor':
      updateReport();
      break;
    case 'section-musteri-listesi':
      renderCustomerTable();
      break;
    default:
      break;
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
    aciklama: aciklama
  });

  saveData();
  showToast(kupeNo + ' numaralı hayvan başarıyla eklendi.');

  // Formu temizle
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
    resultDiv.innerHTML =
      '<div class="card">' +
        '<div class="card-header">🐄 Hayvan Bilgileri - ' + escapeHtml(animal.kupeNo) + '</div>' +
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

    resultDiv.innerHTML =
      '<div class="card">' +
        '<div class="card-header">🔎 Kurbanlık Bilgileri - ' + escapeHtml(kupeNo) + '</div>' +
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

  // Sadece satılan hayvanların alış fiyatlarının toplamı
  var satilanKupelar = sales.map(function(s) { return s.kupeNo; }).concat(kCikti.map(function(k) { return k.kupeNo; }));
  var satilanAlis = animals.filter(function(a) {
    return satilanKupelar.includes(a.kupeNo);
  }).reduce(function(s, a) { return s + (a.alisFiyati || 0); }, 0);

  var karZarar = toplamSatis - satilanAlis - toplamYem - toplamVet;

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
  var satilanAlis = animals.filter(function(a) {
    return satilanKupelar.includes(a.kupeNo);
  }).reduce(function(s, a) { return s + (a.alisFiyati || 0); }, 0);

  var karZarar = toplamSatis - satilanAlis - toplamYem - toplamVet;
  var toplamMaliyet = satilanAlis + toplamYem + toplamVet;

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
  
  var modal = document.getElementById('edit-modal');
  if (modal) modal.classList.add('show');
}

function closeEditModal() {
  var modal = document.getElementById('edit-modal');
  if (modal) modal.classList.remove('show');
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
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ahir_yedek_' + getTodayStr() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Veri yedeği indirildi.', 'info');
  } catch (err) {
    showToast('Dışa aktarma hatası: ' + err.message, 'error');
  }
}

function importData() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

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
const ALLOWED_USERS = [
  { user: "ali gül", pass: "5555" },
  { user: "mert gül", pass: "5555" },
  { user: "oğuzhan gül", pass: "5555" }
];

function checkLogin() {
  const session = localStorage.getItem('ahirSessionActive');
  if (session === 'true') {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
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

  const isValid = ALLOWED_USERS.some(function(u) { return u.user === user && u.pass === pass; });

  if (isValid) {
    localStorage.setItem('ahirSessionActive', 'true');
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    errorEl.style.display = 'none';
    initializeApp(); // Start app after login
  } else {
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
  // Login kontrolü
  if (!checkLogin()) {
    return; // Stop initialization until login
  }

  initializeApp();
});

function initializeApp() {
  // Veriyi yükle
  loadData();

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
      customers[name] = { ad: name, hayvanCount: 0, hisseCount: 0, alisveris: 0, odenen: 0 };
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
    html += '<td data-label="Satın Aldığı">' + escapeHtml(aldigiText) + '</td>';
    html += '<td data-label="Toplam Alışveriş">' + formatMoney(c.alisveris) + '</td>';
    html += '<td data-label="Ödenen Tutar">' + formatMoney(c.odenen) + '</td>';
    html += '<td data-label="Kalan Borç" class="font-bold ' + (kalan > 0 ? 'text-danger' : 'text-success') + '">' + formatMoney(kalan) + '</td>';
    html += '<td data-label="İşlem"><button class="btn btn-sm btn-outline" onclick="editCustomerName(\'' + escapeHtml(c.ad).replace(/'/g, "\\'") + '\')">✏️ Adını Değiştir</button></td>';
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


