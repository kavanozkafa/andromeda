import {
  makeBankacilikLoglari,
  makeDuyurular,
  makeKullanicilar,
  makeKrediKartlari,
  makeLoginKayitlari,
  makeTelefonModelleri,
} from '#/data/mock-data'
import type {
  BankacilikLog,
  Duyuru,
  Kullanici,
  KrediKarti,
  LoginKaydi,
  TelefonModel,
} from '#/data/mock-data'

let dusurularDb = makeDuyurular(20)
let kullanicilarDb = makeKullanicilar(30)
let bankacilikLoglariDb = makeBankacilikLoglari(100)
let krediKartlariDb = makeKrediKartlari(8)
let loginKayitlariDb = makeLoginKayitlari(200)
let telefonModelleriDb = makeTelefonModelleri()

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
}
