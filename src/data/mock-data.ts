import { faker } from '@faker-js/faker'

export interface DashboardStats {
  toplamKullanici: number
  gunlukIslemler: number
  toplamGelir: number
  aktifKartlar: number
  kullaniciYuzdesi: number
  islemYuzdesi: number
  gelirYuzdesi: number
  kartYuzdesi: number
}

export interface IslemHacmiVerisi {
  tarih: string
  islemler: number
  tutar: number
}

export interface GelirDagilimiVerisi {
  tur: string
  tutar: number
  renk: string
}

export interface KullaniciAktiviteVerisi {
  sehir: string
  aktifKullanici: number
  yeniKullanicilar: number
}

export interface Duyuru {
  id: string
  baslik: string
  icerik: string
  tarih: Date
  durum: 'aktif' | 'pasif' | 'taslak'
}

export interface Kullanici {
  id: string
  adSoyad: string
  email: string
  telefon: string
  hesapNo: string
  bakiye: number
  kayitTarihi: Date
  sonGirisTarihi: Date
  sonGirisIp: string
  sonGirisCihaz: string
  ikiAdimliDogrulama: boolean
  sifreGuncellemeTarihi: Date
}

export interface BankacilikLog {
  id: string
  musteriAdi: string
  islemTipi:
    'para_yatirma' | 'para_cekme' | 'havale' | 'eft' | 'odeme' | 'yatirim'
  tutar: number
  tarih: Date
  durum: 'basarili' | 'basarisiz' | 'beklemede'
  ipAdresi: string
  cihaz: string
  konum: string
  referansNo: string
}

export interface LoginKaydi {
  id: string
  kullaniciAdi: string
  tarih: Date
  basarili: boolean
  hataKategorisi?:
    | 'yanlis_sifre'
    | 'hatali_kullanici_adi'
    | 'hesap_blokeli'
    | 'otp_basarisiz'
    | 'oturum_suresi_dolmus'
    | 'ip_engelli'
    | 'cok_fazla_deneme'
  ipAdresi: string
  cihaz: string
  konum: string
}

export function makeLoginKayitlari(count: number = 200): LoginKaydi[] {
  const hataKategorileri: LoginKaydi['hataKategorisi'][] = [
    'yanlis_sifre',
    'hatali_kullanici_adi',
    'hesap_blokeli',
    'otp_basarisiz',
    'oturum_suresi_dolmus',
    'ip_engelli',
    'cok_fazla_deneme',
  ]
  const cihazlar = [
    'iPhone 15 Pro',
    'Samsung Galaxy S24',
    'iPad Air',
    'Web Tarayıcı - Chrome',
    'Web Tarayıcı - Firefox',
    'Android Tablet',
    'Huawei P60',
  ]
  const konumlar = [
    'İstanbul',
    'Ankara',
    'İzmir',
    'Bursa',
    'Antalya',
    'Gaziantep',
    'Konya',
  ]
  const kullanicilar = [
    'ahmet.yilmaz',
    'ayse.demir',
    'mehmet.kaya',
    'fatma.ozkan',
    'ali.celik',
    'zeynep.aksoy',
    'hasan.yildiz',
    'emine.dogan',
    'mustafa.arslan',
    'selin.koc',
    'burak.akdeniz',
    'elif.cinar',
    'murat.tas',
    'gul.erdem',
    'oguz.kaplan',
  ]

  return Array.from({ length: count }, () => {
    const basarili = faker.datatype.boolean({ probability: 0.72 })
    return {
      id: faker.string.uuid(),
      kullaniciAdi: faker.helpers.arrayElement(kullanicilar),
      tarih: faker.date.recent({ days: 30 }),
      basarili,
      hataKategorisi: basarili
        ? undefined
        : faker.helpers.arrayElement(hataKategorileri),
      ipAdresi: faker.internet.ip(),
      cihaz: faker.helpers.arrayElement(cihazlar),
      konum: faker.helpers.arrayElement(konumlar),
    }
  })
}

export function makeDuyurular(count: number = 10): Duyuru[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    baslik: faker.lorem.sentence({ min: 3, max: 8 }),
    icerik: faker.lorem.paragraphs({ min: 1, max: 3 }),
    tarih: faker.date.recent({ days: 30 }),
    durum: faker.helpers.arrayElement(['aktif', 'pasif', 'taslak']),
  }))
}

export function makeKullanicilar(count: number = 20): Kullanici[] {
  const cihazlar = [
    'iPhone 15 Pro',
    'Samsung Galaxy S24',
    'iPad Air',
    'Web Tarayıcı',
    'Android Tablet',
  ]
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    adSoyad: faker.person.fullName(),
    email: faker.internet.email(),
    telefon: faker.phone.number({ style: 'national' }),
    hesapNo: faker.finance.accountNumber(10),
    bakiye: Number(faker.finance.amount({ min: 100, max: 500000 })),
    kayitTarihi: faker.date.past({ years: 5 }),
    sonGirisTarihi: faker.date.recent({ days: 30 }),
    sonGirisIp: faker.internet.ip(),
    sonGirisCihaz: faker.helpers.arrayElement(cihazlar),
    ikiAdimliDogrulama: faker.datatype.boolean({ probability: 0.4 }),
    sifreGuncellemeTarihi: faker.date.past({ years: 1 }),
  }))
}

export function makeBankacilikLoglari(count: number = 50): BankacilikLog[] {
  const islemTipleri: BankacilikLog['islemTipi'][] = [
    'para_yatirma',
    'para_cekme',
    'havale',
    'eft',
    'odeme',
    'yatirim',
  ]
  const durumlar: BankacilikLog['durum'][] = [
    'basarili',
    'basarisiz',
    'beklemede',
  ]
  const cihazlar = [
    'iPhone 15 Pro',
    'Samsung Galaxy S24',
    'iPad Air',
    'Web Tarayıcı',
    'Android Tablet',
  ]
  const konumlar = [
    'İstanbul',
    'Ankara',
    'İzmir',
    'Bursa',
    'Antalya',
    'Gaziantep',
  ]

  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    musteriAdi: faker.person.fullName(),
    islemTipi: faker.helpers.arrayElement(islemTipleri),
    tutar: Number(faker.finance.amount({ min: 10, max: 100000 })),
    tarih: faker.date.recent({ days: 7 }),
    durum: faker.helpers.arrayElement(durumlar),
    ipAdresi: faker.internet.ip(),
    cihaz: faker.helpers.arrayElement(cihazlar),
    konum: faker.helpers.arrayElement(konumlar),
    referansNo: faker.string.alphanumeric(12).toUpperCase(),
  }))
}

export function makeDashboardStats(): DashboardStats {
  return {
    toplamKullanici: faker.number.int({ min: 1000, max: 5000 }),
    gunlukIslemler: faker.number.int({ min: 100, max: 800 }),
    toplamGelir: Number(faker.finance.amount({ min: 500000, max: 5000000 })),
    aktifKartlar: faker.number.int({ min: 500, max: 3000 }),
    kullaniciYuzdesi: faker.number.float({
      min: 2,
      max: 15,
      fractionDigits: 1,
    }),
    islemYuzdesi: faker.number.float({ min: 3, max: 20, fractionDigits: 1 }),
    gelirYuzdesi: faker.number.float({ min: 5, max: 25, fractionDigits: 1 }),
    kartYuzdesi: faker.number.float({ min: 1, max: 10, fractionDigits: 1 }),
  }
}

export function makeIslemHacmiVerisi(): IslemHacmiVerisi[] {
  const gunler = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
  const bugun = new Date()

  return Array.from({ length: 7 }, (_, i) => {
    const tarih = new Date(bugun)
    tarih.setDate(bugun.getDate() - (6 - i))
    return {
      tarih: gunler[tarih.getDay() === 0 ? 6 : tarih.getDay() - 1],
      islemler: faker.number.int({ min: 50, max: 400 }),
      tutar: Number(faker.finance.amount({ min: 10000, max: 500000 })),
    }
  })
}

export function makeGelirDagilimiVerisi(): GelirDagilimiVerisi[] {
  return [
    {
      tur: 'Havale/EFT',
      tutar: faker.number.int({ min: 50000, max: 200000 }),
      renk: 'green',
    },
    {
      tur: 'Kredi Kartı',
      tutar: faker.number.int({ min: 30000, max: 150000 }),
      renk: 'blue',
    },
    {
      tur: 'Yatırım',
      tutar: faker.number.int({ min: 40000, max: 180000 }),
      renk: 'cyan',
    },
    {
      tur: 'Kredi',
      tutar: faker.number.int({ min: 20000, max: 100000 }),
      renk: 'yellow',
    },
    {
      tur: 'Diğer',
      tutar: faker.number.int({ min: 10000, max: 50000 }),
      renk: 'gray',
    },
  ]
}

export function makeKullaniciAktiviteVerisi(): KullaniciAktiviteVerisi[] {
  return [
    {
      sehir: 'İstanbul',
      aktifKullanici: faker.number.int({ min: 500, max: 1500 }),
      yeniKullanicilar: faker.number.int({ min: 50, max: 200 }),
    },
    {
      sehir: 'Ankara',
      aktifKullanici: faker.number.int({ min: 200, max: 600 }),
      yeniKullanicilar: faker.number.int({ min: 20, max: 100 }),
    },
    {
      sehir: 'İzmir',
      aktifKullanici: faker.number.int({ min: 150, max: 400 }),
      yeniKullanicilar: faker.number.int({ min: 15, max: 80 }),
    },
    {
      sehir: 'Bursa',
      aktifKullanici: faker.number.int({ min: 100, max: 300 }),
      yeniKullanicilar: faker.number.int({ min: 10, max: 60 }),
    },
    {
      sehir: 'Antalya',
      aktifKullanici: faker.number.int({ min: 80, max: 250 }),
      yeniKullanicilar: faker.number.int({ min: 8, max: 50 }),
    },
    {
      sehir: 'Gaziantep',
      aktifKullanici: faker.number.int({ min: 60, max: 180 }),
      yeniKullanicilar: faker.number.int({ min: 5, max: 40 }),
    },
  ]
}

export interface KrediKarti {
  id: string
  kartNo: string
  kartSahibi: string
  sonKullanma: string
  kartTipi: 'visa' | 'mastercard' | 'troy'
  kartTuru: 'kredi' | 'borc' | 'onkod'
  limit: number
  kullanilan: number
  durum: 'aktif' | 'blokeli' | 'suresi_dolmus'
}

export function makeKrediKartlari(count: number = 6): KrediKarti[] {
  const kartTipleri: KrediKarti['kartTipi'][] = ['visa', 'mastercard', 'troy']
  const kartTurleri: KrediKarti['kartTuru'][] = ['kredi', 'borc', 'onkod']
  const durumlar: KrediKarti['durum'][] = [
    'aktif',
    'aktif',
    'aktif',
    'blokeli',
    'suresi_dolmus',
  ]

  return Array.from({ length: count }, () => {
    const limit = faker.number.int({ min: 5000, max: 100000 })
    return {
      id: faker.string.uuid(),
      kartNo: `**** **** **** ${faker.string.numeric(4)}`,
      kartSahibi: faker.person.fullName().toUpperCase(),
      sonKullanma: `${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}/${faker.number.int({ min: 25, max: 30 }).toString().slice(-2)}`,
      kartTipi: faker.helpers.arrayElement(kartTipleri),
      kartTuru: faker.helpers.arrayElement(kartTurleri),
      limit,
      kullanilan: faker.number.int({ min: 0, max: limit }),
      durum: faker.helpers.arrayElement(durumlar),
    }
  })
}

export interface TelefonModel {
  model: string
  marka: string
  adet: number
}

export function makeTelefonModelleri(): TelefonModel[] {
  return [
    { model: 'Galaxy S24 Ultra', marka: 'Samsung', adet: 1245 },
    { model: 'iPhone 15 Pro', marka: 'Apple', adet: 987 },
    { model: 'Redmi Note 13', marka: 'Xiaomi', adet: 876 },
    { model: 'Galaxy A54', marka: 'Samsung', adet: 753 },
    { model: 'iPhone 15', marka: 'Apple', adet: 654 },
    { model: 'P60 Pro', marka: 'Huawei', adet: 432 },
    { model: 'iPhone 17 Pro', marka: 'Apple', adet: 44 },
    { model: 'Pixel 8', marka: 'Google', adet: 398 },
    { model: 'Redmi Note 12', marka: 'Xiaomi', adet: 567 },
    { model: 'Galaxy A34', marka: 'Samsung', adet: 521 },
    { model: 'iPhone 14', marka: 'Apple', adet: 345 },
    { model: 'Find X6', marka: 'Oppo', adet: 189 },
    { model: 'OnePlus 12', marka: 'OnePlus', adet: 234 },
    { model: 'Galaxy S23', marka: 'Samsung', adet: 412 },
    { model: 'Mi 14', marka: 'Xiaomi', adet: 178 },
    { model: 'iPhone 13', marka: 'Apple', adet: 267 },
    { model: 'Mate 60', marka: 'Huawei', adet: 156 },
    { model: 'Nokia G42', marka: 'Nokia', adet: 98 },
    { model: 'Galaxy Z Flip 5', marka: 'Samsung', adet: 145 },
    { model: 'iPhone SE 4', marka: 'Apple', adet: 123 },
  ].sort((a, b) => b.adet - a.adet)
}
