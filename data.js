// ==========================================
// VARSAYILAN VERİLER - Excel dosyasından alınan başlangıç verileri
// localStorage boşsa bu veriler yüklenir
// ==========================================
const DEFAULT_DATA = {
  animals: [
    { kupeNo: '55001', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 130000, aciklama: '' },
    { kupeNo: '55002', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 130000, aciklama: '' },
    { kupeNo: '55003', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 130000, aciklama: '' },
    { kupeNo: '55004', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55005', irk: 'BELÇİKA MAVİ', padok: 'PADOK 2', cinsiyet: 'DİŞİ', alisTarihi: '2026-02-06', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 130000, aciklama: '' },
    { kupeNo: '55006', irk: 'SİMENTAL', padok: 'PADOK 2', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55007', irk: 'SİMENTAL', padok: 'PADOK 2', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55008', irk: 'SİMENTAL MELEZİ', padok: 'PADOK 3', cinsiyet: 'DİŞİ', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'SATILDI', alisFiyati: 130000, aciklama: '' },
    { kupeNo: '55009', irk: 'SİMENTAL', padok: 'PADOK 3', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55010', irk: 'SİMENTAL', padok: 'PADOK 3', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'Hisseli Satış', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55011', irk: 'SİMENTAL', padok: 'PADOK 3', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'Hisseli Satış', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55012', irk: 'SİMENTAL', padok: 'PADOK 3', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55013', irk: 'SİMENTAL', padok: 'PADOK 4', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55014', irk: 'SİMENTAL', padok: 'PADOK 4', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55015', irk: 'SİMENTAL', padok: 'PADOK 4', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55016', irk: 'SİMENTAL', padok: 'PADOK 4', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55017', irk: 'SİMENTAL', padok: 'PADOK 4', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55018', irk: 'SİMENTAL', padok: 'PADOK 4', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55019', irk: 'SİMENTAL', padok: 'PADOK 5', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55020', irk: 'SİMENTAL', padok: 'PADOK 5', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55021', irk: 'SİMENTAL', padok: 'PADOK 5', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55022', irk: 'SİMENTAL', padok: 'PADOK 5', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55023', irk: 'SİMENTAL', padok: 'PADOK 5', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55024', irk: 'SİMENTAL', padok: 'PADOK 5', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55025', irk: 'SİMENTAL', padok: 'PADOK 5', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55026', irk: 'SİMENTAL', padok: 'PADOK 6', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55027', irk: 'SİMENTAL', padok: 'PADOK 6', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55028', irk: 'SİMENTAL', padok: 'PADOK 6', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55029', irk: 'SİMENTAL', padok: 'PADOK 6', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55030', irk: 'SİMENTAL', padok: 'PADOK 6', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55031', irk: 'SİMENTAL', padok: 'PADOK 6', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55032', irk: 'SİMENTAL', padok: 'PADOK 6', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55033', irk: 'SİMENTAL', padok: 'SAĞIM HANE', cinsiyet: 'DİŞİ', alisTarihi: '2026-02-09', dogumTarihi: '', kilo: 100, durum: 'DAMIZLIK', satisDurumu: 'STOKTA', alisFiyati: 130000, aciklama: '' },
    { kupeNo: '55034', irk: 'SİMENTAL', padok: 'SAĞIM HANE', cinsiyet: 'DİŞİ', alisTarihi: '2026-02-09', dogumTarihi: '', kilo: 100, durum: 'DAMIZLIK', satisDurumu: 'SATILDI', alisFiyati: 130000, aciklama: '' },
    { kupeNo: '55035', irk: 'SİMENTAL', padok: 'SAĞIM HANE', cinsiyet: 'DİŞİ', alisTarihi: '2026-02-09', dogumTarihi: '', kilo: 100, durum: 'DAMIZLIK', satisDurumu: 'SATILDI', alisFiyati: 130000, aciklama: '' },
    { kupeNo: '55036', irk: 'SİMENTAL', padok: 'SAĞIM HANE', cinsiyet: 'ERKEK', alisTarihi: '2026-02-09', dogumTarihi: '', kilo: 100, durum: 'BESİ', satisDurumu: 'SATILDI', alisFiyati: 0, aciklama: '' },
    { kupeNo: '55100', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55101', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55102', irk: 'SİMENTAL', padok: 'PADOK 2', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55103', irk: 'SİMENTAL', padok: 'PADOK 2', cinsiyet: 'ERKEK', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55104', irk: 'SİMENTAL', padok: 'PADOK 2', cinsiyet: 'DİŞİ', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55105', irk: 'SİMENTAL', padok: 'PADOK 2', cinsiyet: 'DİŞİ', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'SATILDI', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55106', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'DİŞİ', alisTarihi: '2025-11-01', dogumTarihi: '', kilo: 100, durum: 'KURBANLIK', satisDurumu: 'STOKTA', alisFiyati: 100000, aciklama: '' },
    { kupeNo: '55500', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'ERKEK', alisTarihi: '2026-06-28', dogumTarihi: '', kilo: 50, durum: 'DAMIZLIK', satisDurumu: 'SATILDI', alisFiyati: 100000, aciklama: '' }
  ],

  sales: [
    { kupeNo: '55035', musteriAdi: 'ALİ GÜL', irk: 'SİMENTAL', padok: 'SAĞIM HANE', cinsiyet: 'DİŞİ', satisTuru: '5 Hisse', tahminiKilo: 300, alisFiyati: 130000, vetGideri: 0, yemGideri: 0, satisFiyati: 275000, alinanToplam: 15000, kalan: 0, karYuzdesi: 0 },
    { kupeNo: '55105', musteriAdi: 'mehmet', irk: 'SİMENTAL', padok: 'PADOK 2', cinsiyet: 'DİŞİ', satisTuru: 'TAM SATIŞ', tahminiKilo: 150, alisFiyati: 100000, vetGideri: 0, yemGideri: 0, satisFiyati: 200000, alinanToplam: 10000, kalan: 0, karYuzdesi: 0 },
    { kupeNo: '55036', musteriAdi: 'ALİ', irk: 'SİMENTAL', padok: 'SAĞIM HANE', cinsiyet: 'ERKEK', satisTuru: 'TAM SATIŞ', tahminiKilo: 10000, alisFiyati: 0, vetGideri: 0, yemGideri: 0, satisFiyati: 150000, alinanToplam: 10000, kalan: 0, karYuzdesi: 0 },
    { kupeNo: '55008', musteriAdi: 'BEDİRHAN UYSAL', irk: 'SİMENTAL MELEZİ', padok: 'PADOK 3', cinsiyet: 'DİŞİ', satisTuru: 'TAM SATIŞ', tahminiKilo: 350, alisFiyati: 130000, vetGideri: 182.93, yemGideri: 0, satisFiyati: 290000, alinanToplam: 10000, kalan: 0, karYuzdesi: 0 },
    { kupeNo: '55034', musteriAdi: 'LEVENT GÜL', irk: 'SİMENTAL', padok: 'SAĞIM HANE', cinsiyet: 'DİŞİ', satisTuru: 'TAM SATIŞ', tahminiKilo: 100, alisFiyati: 130000, vetGideri: 182.93, yemGideri: 3658.54, satisFiyati: 250000, alinanToplam: 100000, kalan: 120000, karYuzdesi: 0.48 },
    { kupeNo: '55500', musteriAdi: 'oğuzhan', irk: 'SİMENTAL', padok: 'PADOK 1', cinsiyet: 'ERKEK', satisTuru: 'TAM SATIŞ', tahminiKilo: 150, alisFiyati: 100000, vetGideri: 174.42, yemGideri: 3488.37, satisFiyati: 250000, alinanToplam: 100000, kalan: 150000, karYuzdesi: 0.60 }
  ],

  feedPurchases: [
    { yemMarkasi: 'PRO', yemTuru: 'TOZ', alimTarihi: '2026-06-01', birimFiyati: 1000, adeti: 100, odenenFiyat: 100000, toplamFiyat: 100000 },
    { yemMarkasi: 'ROTA', yemTuru: 'TOZ', alimTarihi: '2026-06-05', birimFiyati: 1000, adeti: 50, odenenFiyat: 50000, toplamFiyat: 50000 }
  ],

  vetExpenses: [
    { veterinerAdi: 'ALİ', alinanIlac: 'DXX', adeti: 5, birimFiyati: 500, veterinerHizmeti: 5000, toplamFiyat: 7500 }
  ],

  kurbanlikCikti: [
    { kupeNo: '55010', musteriAdi: 'MUSTAFA GÜL', irk: 'SİMENTAL', padokNo: '5', satisFiyati: 290000, alinanUcret: 150000, kalanUcret: 140000, kurbandaAlinanUcret: 0 },
    { kupeNo: '55011', musteriAdi: 'ALİ GÜL', irk: 'SİMENTAL', padokNo: '5', satisFiyati: 40000, alinanUcret: 10000, kalanUcret: 30000, kurbandaAlinanUcret: 0 },
    { kupeNo: '55011', musteriAdi: 'EMRAH GÜL', irk: 'SİMENTAL', padokNo: '5', satisFiyati: 40000, alinanUcret: 10000, kalanUcret: 30000, kurbandaAlinanUcret: 0 },
    { kupeNo: '55011', musteriAdi: 'NESRİN GÜL', irk: 'SİMENTAL', padokNo: '5', satisFiyati: 40000, alinanUcret: 5000, kalanUcret: 35000, kurbandaAlinanUcret: 0 },
    { kupeNo: '55011', musteriAdi: 'NESLİHAN KIROĞLU', irk: 'SİMENTAL', padokNo: '5', satisFiyati: 40000, alinanUcret: 7500, kalanUcret: 32500, kurbandaAlinanUcret: 0 },
    { kupeNo: '55011', musteriAdi: 'LEVENT GÜL', irk: 'SİMENTAL', padokNo: '5', satisFiyati: 40000, alinanUcret: 10000, kalanUcret: 30000, kurbandaAlinanUcret: 0 }
  ]
};
