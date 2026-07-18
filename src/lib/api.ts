import {
  makeBankacilikLoglari,
  makeDuyurular,
  makeKullanicilar,
  makeKrediKartlari,
  makeLoginKayitlari,
  makeTelefonModelleri,
  makeAktifOturumlar,
  makeSistemParametreleri,
  makeSistemMesajlari,
} from '#/data/mock-data'
import type {
  BankacilikLog,
  Duyuru,
  Kullanici,
  KrediKarti,
  LoginKaydi,
  TelefonModel,
  AktifOturum,
  SistemParametresi,
  SistemMesaji,
} from '#/data/mock-data'

let dusurularDb = makeDuyurular(20)
let kullanicilarDb = makeKullanicilar(30)
let bankacilikLoglariDb = makeBankacilikLoglari(100)
let krediKartlariDb = makeKrediKartlari(8)
let loginKayitlariDb = makeLoginKayitlari(200)
let telefonModelleriDb = makeTelefonModelleri()
let aktifOturumlarDb = makeAktifOturumlar(12)
let sistemParametreleriDb = makeSistemParametreleri()
let sistemMesajlariDb = makeSistemMesajlari()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  duyurular: {
    list: async (): Promise<Duyuru[]> => {
      await delay(300)
      return [...dusurularDb]
    },
    create: async (data: Omit<Duyuru, 'id'>): Promise<Duyuru> => {
      await delay(200)
      const yeni: Duyuru = { ...data, id: crypto.randomUUID() }
      dusurularDb = [yeni, ...dusurularDb]
      return yeni
    },
    update: async (id: string, data: Partial<Duyuru>): Promise<Duyuru> => {
      await delay(200)
      const idx = dusurularDb.findIndex((d) => d.id === id)
      if (idx === -1) throw new Error('Duyuru bulunamadı')
      dusurularDb[idx] = { ...dusurularDb[idx], ...data }
      return dusurularDb[idx]
    },
    delete: async (id: string): Promise<void> => {
      await delay(200)
      dusurularDb = dusurularDb.filter((d) => d.id !== id)
    },
  },

  kullanicilar: {
    list: async (): Promise<Kullanici[]> => {
      await delay(300)
      return [...kullanicilarDb]
    },
    update: async (
      id: string,
      data: Partial<Kullanici>,
    ): Promise<Kullanici> => {
      await delay(200)
      const idx = kullanicilarDb.findIndex((k) => k.id === id)
      if (idx === -1) throw new Error('Kullanıcı bulunamadı')
      kullanicilarDb[idx] = { ...kullanicilarDb[idx], ...data }
      return kullanicilarDb[idx]
    },
    delete: async (id: string): Promise<void> => {
      await delay(200)
      kullanicilarDb = kullanicilarDb.filter((k) => k.id !== id)
    },
  },

  bankacilikLoglari: {
    list: async (): Promise<BankacilikLog[]> => {
      await delay(400)
      return [...bankacilikLoglariDb].sort(
        (a, b) => b.tarih.getTime() - a.tarih.getTime(),
      )
    },
  },

  krediKartlari: {
    list: async (): Promise<KrediKarti[]> => {
      await delay(300)
      return [...krediKartlariDb]
    },
  },

  loginKayitlari: {
    list: async (): Promise<LoginKaydi[]> => {
      await delay(400)
      return [...loginKayitlariDb].sort(
        (a, b) => b.tarih.getTime() - a.tarih.getTime(),
      )
    },
  },

  telefonModelleri: {
    list: async (): Promise<TelefonModel[]> => {
      await delay(300)
      return [...telefonModelleriDb]
    },
  },

  aktifOturumlar: {
    list: async (): Promise<AktifOturum[]> => {
      await delay(300)
      return [...aktifOturumlarDb].sort(
        (a, b) => b.sonIslemTarihi.getTime() - a.sonIslemTarihi.getTime()
      )
    },
    kick: async (id: string): Promise<void> => {
      await delay(200)
      aktifOturumlarDb = aktifOturumlarDb.filter((o) => o.id !== id)
    },
  },

  sistemParametreleri: {
    list: async (): Promise<SistemParametresi[]> => {
      await delay(300)
      return [...sistemParametreleriDb]
    },
    create: async (data: Omit<SistemParametresi, 'id' | 'guncellemeTarihi'>): Promise<SistemParametresi> => {
      await delay(200)
      const yeni: SistemParametresi = {
        ...data,
        id: crypto.randomUUID(),
        guncellemeTarihi: new Date(),
      }
      sistemParametreleriDb = [yeni, ...sistemParametreleriDb]
      return yeni
    },
    update: async (id: string, data: Partial<SistemParametresi>): Promise<SistemParametresi> => {
      await delay(200)
      const idx = sistemParametreleriDb.findIndex((p) => p.id === id)
      if (idx === -1) throw new Error('Parametre bulunamadı')
      sistemParametreleriDb[idx] = {
        ...sistemParametreleriDb[idx],
        ...data,
        guncellemeTarihi: new Date(),
      }
      return sistemParametreleriDb[idx]
    },
    delete: async (id: string): Promise<void> => {
      await delay(200)
      sistemParametreleriDb = sistemParametreleriDb.filter((p) => p.id !== id)
    },
  },

  sistemMesajlari: {
    list: async (): Promise<SistemMesaji[]> => {
      await delay(300)
      return [...sistemMesajlariDb]
    },
    create: async (data: Omit<SistemMesaji, 'id' | 'guncellemeTarihi'>): Promise<SistemMesaji> => {
      await delay(200)
      const yeni: SistemMesaji = {
        ...data,
        id: crypto.randomUUID(),
        guncellemeTarihi: new Date(),
      }
      sistemMesajlariDb = [yeni, ...sistemMesajlariDb]
      return yeni
    },
    update: async (id: string, data: Partial<SistemMesaji>): Promise<SistemMesaji> => {
      await delay(200)
      const idx = sistemMesajlariDb.findIndex((m) => m.id === id)
      if (idx === -1) throw new Error('Sistem mesajı bulunamadı')
      sistemMesajlariDb[idx] = {
        ...sistemMesajlariDb[idx],
        ...data,
        guncellemeTarihi: new Date(),
      }
      return sistemMesajlariDb[idx]
    },
    delete: async (id: string): Promise<void> => {
      await delay(200)
      sistemMesajlariDb = sistemMesajlariDb.filter((m) => m.id !== id)
    },
  },
}

