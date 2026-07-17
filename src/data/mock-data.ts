import { faker } from '@faker-js/faker'

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
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    adSoyad: faker.person.fullName(),
    email: faker.internet.email(),
    telefon: faker.phone.number({ style: 'national' }),
    hesapNo: faker.finance.accountNumber(10),
    bakiye: Number(faker.finance.amount({ min: 100, max: 500000 })),
    kayitTarihi: faker.date.past({ years: 5 }),
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
