import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  NativeSelect,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { Download, FileText, Filter, Printer, RefreshCw } from 'lucide-react'
import { makeBankacilikLoglari, makeKullanicilar } from '#/data/mock-data'
import type { BankacilikLog, Kullanici } from '#/data/mock-data'

export const Route = createFileRoute('/raporlar')({
  component: RaporlarPage,
})

type RaporTuru = 'islemler' | 'kullanicilar' | 'gelir' | 'subeler'

function RaporlarPage() {
  const [islemler] = useState<BankacilikLog[]>(() => makeBankacilikLoglari(200))
  const [kullanicilar] = useState<Kullanici[]>(() => makeKullanicilar(100))
  const [raporTuru, setRaporTuru] = useState<RaporTuru>('islemler')
  const [baslangicTarihi, setBaslangicTarihi] = useState<Date | null>(null)
  const [bitisTarihi, setBitisTarihi] = useState<Date | null>(null)
  const [durumFiltre, setDurumFiltre] = useState<string>('hepsi')
  const [raporBaslik, setRaporBaslik] = useState('')

  const raporVerileri = useMemo(() => {
    let filtrelenmisIslemler = islemler
    if (durumFiltre !== 'hepsi') {
      filtrelenmisIslemler = islemler.filter((i) => i.durum === durumFiltre)
    }

    switch (raporTuru) {
      case 'islemler':
        return {
          baslik: 'İşlem Raporu',
          toplamKayit: filtrelenmisIslemler.length,
          sutunlar: ['Müşteri', 'İşlem Tipi', 'Tutar', 'Tarih', 'Durum'],
          veriler: filtrelenmisIslemler
            .slice(0, 50)
            .map((i) => [
              i.musteriAdi,
              getIslemTipiLabel(i.islemTipi),
              `${i.tutar.toLocaleString('tr-TR')} ₺`,
              i.tarih.toLocaleDateString('tr-TR'),
              getDurumLabel(i.durum),
            ]),
          ozet: [
            {
              label: 'Toplam İşlem',
              value: filtrelenmisIslemler.length.toString(),
            },
            {
              label: 'Toplam Tutar',
              value: `${filtrelenmisIslemler.reduce((s, i) => s + i.tutar, 0).toLocaleString('tr-TR')} ₺`,
            },
            {
              label: 'Başarılı',
              value: `${filtrelenmisIslemler.filter((i) => i.durum === 'basarili').length}`,
            },
            {
              label: 'Başarısız',
              value: `${filtrelenmisIslemler.filter((i) => i.durum === 'basarisiz').length}`,
            },
          ],
        }

      case 'kullanicilar':
        return {
          baslik: 'Kullanıcı Raporu',
          toplamKayit: kullanicilar.length,
          sutunlar: ['Ad Soyad', 'E-posta', 'Telefon', 'Hesap No', 'Bakiye'],
          veriler: kullanicilar.map((k) => [
            k.adSoyad,
            k.email,
            k.telefon,
            k.hesapNo,
            `${k.bakiye.toLocaleString('tr-TR')} ₺`,
          ]),
          ozet: [
            {
              label: 'Toplam Kullanıcı',
              value: kullanicilar.length.toString(),
            },
            {
              label: 'Toplam Bakiye',
              value: `${kullanicilar.reduce((s, k) => s + k.bakiye, 0).toLocaleString('tr-TR')} ₺`,
            },
            {
              label: 'Ortalama Bakiye',
              value: `${(kullanicilar.reduce((s, k) => s + k.bakiye, 0) / kullanicilar.length).toLocaleString('tr-TR')} ₺`,
            },
          ],
        }

      case 'gelir':
        const gelirVerileri = [
          { tur: 'Havale/EFT', tutar: 245000 },
          { tur: 'Kredi Kartı', tutar: 189000 },
          { tur: 'Yatırım', tutar: 312000 },
          { tur: 'Kredi', tutar: 156000 },
          { tur: 'Komisyon', tutar: 78000 },
        ]
        return {
          baslik: 'Gelir Raporu',
          toplamKayit: gelirVerileri.length,
          sutunlar: ['Gelir Türü', 'Tutar', 'Oran'],
          veriler: gelirVerileri.map((g) => {
            const toplam = gelirVerileri.reduce((s, v) => s + v.tutar, 0)
            return [
              g.tur,
              `${g.tutar.toLocaleString('tr-TR')} ₺`,
              `%${((g.tutar / toplam) * 100).toFixed(1)}`,
            ]
          }),
          ozet: [
            {
              label: 'Toplam Gelir',
              value: `${gelirVerileri.reduce((s, g) => s + g.tutar, 0).toLocaleString('tr-TR')} ₺`,
            },
            {
              label: 'En Yüksek',
              value: `${Math.max(...gelirVerileri.map((g) => g.tutar)).toLocaleString('tr-TR')} ₺`,
            },
            { label: 'Kalem Sayısı', value: gelirVerileri.length.toString() },
          ],
        }

      case 'subeler':
        const subeVerileri = [
          { sube: 'İstanbul Merkez', islem: 1250, gelir: 450000 },
          { sube: 'Ankara Şube', islem: 890, gelir: 320000 },
          { sube: 'İzmir Şube', islem: 670, gelir: 245000 },
          { sube: 'Bursa Şube', islem: 450, gelir: 180000 },
          { sube: 'Antalya Şube', islem: 380, gelir: 145000 },
        ]
        return {
          baslik: 'Şube Raporu',
          toplamKayit: subeVerileri.length,
          sutunlar: ['Şube', 'İşlem Sayısı', 'Gelir'],
          veriler: subeVerileri.map((s) => [
            s.sube,
            s.islem.toString(),
            `${s.gelir.toLocaleString('tr-TR')} ₺`,
          ]),
          ozet: [
            { label: 'Toplam Şube', value: subeVerileri.length.toString() },
            {
              label: 'Toplam İşlem',
              value: subeVerileri
                .reduce((s, v) => s + v.islem, 0)
                .toLocaleString('tr-TR'),
            },
            {
              label: 'Toplam Gelir',
              value: `${subeVerileri.reduce((s, v) => s + v.gelir, 0).toLocaleString('tr-TR')} ₺`,
            },
          ],
        }
    }
  }, [raporTuru, islemler, kullanicilar, durumFiltre])

  function getIslemTipiLabel(tip: BankacilikLog['islemTipi']) {
    const labels: Record<BankacilikLog['islemTipi'], string> = {
      para_yatirma: 'Para Yatırma',
      para_cekme: 'Para Çekme',
      havale: 'Havale',
      eft: 'EFT',
      odeme: 'Ödeme',
      yatirim: 'Yatırım',
    }
    return labels[tip]
  }

  function getDurumLabel(durum: BankacilikLog['durum']) {
    switch (durum) {
      case 'basarili':
        return 'Başarılı'
      case 'basarisiz':
        return 'Başarısız'
      case 'beklemede':
        return 'Beklemede'
    }
  }

  const handleExportCSV = () => {
    const headers = raporVerileri.sutunlar
    const rows = raporVerileri.veriler

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${raporTuru}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    notifications.show({
      title: 'Rapor İndirildi',
      message: `${raporVerileri.baslik} başarıyla CSV olarak indirildi`,
      color: 'green',
    })
  }

  const handleYazdir = () => {
    notifications.show({
      title: 'Yazdırma',
      message: 'Yazdırma paneli açılıyor...',
      color: 'blue',
    })
    window.print()
  }

  const handleRaporOlustur = () => {
    const baslik = raporBaslik || raporVerileri.baslik
    notifications.show({
      title: 'Rapor Oluşturuldu',
      message: `"${baslik}" başarıyla oluşturuldu`,
      color: 'green',
    })
  }

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Raporlar</Title>
            <Text c="dimmed">Finansal raporları oluşturun ve dışa aktarın</Text>
          </div>
          <Group>
            <Button
              variant="light"
              color="green"
              leftSection={<Printer size={16} />}
              onClick={handleYazdir}
            >
              Yazdır
            </Button>
            <Button
              color="green"
              leftSection={<Download size={16} />}
              onClick={handleExportCSV}
            >
              CSV İndir
            </Button>
          </Group>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md" mb="lg">
            <ActionIcon variant="light" color="green" size="lg">
              <Filter size={20} />
            </ActionIcon>
            <div>
              <Title order={4}>Rapor Filtreleri</Title>
              <Text size="sm" c="dimmed">
                Rapor tarihini ve filtresini seçin
              </Text>
            </div>
          </Group>

          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
              <NativeSelect
                label="Rapor Türü"
                data={[
                  { value: 'islemler', label: 'İşlem Raporu' },
                  { value: 'kullanicilar', label: 'Kullanıcı Raporu' },
                  { value: 'gelir', label: 'Gelir Raporu' },
                  { value: 'subeler', label: 'Şube Raporu' },
                ]}
                value={raporTuru}
                onChange={(e) =>
                  setRaporTuru(e.currentTarget.value as RaporTuru)
                }
              />
              <DatePickerInput
                label="Başlangıç Tarihi"
                placeholder="Tarih seçin"
                value={baslangicTarihi as any}
                onChange={(v) =>
                  setBaslangicTarihi(v ? new Date(v as string) : null)
                }
              />
              <DatePickerInput
                label="Bitiş Tarihi"
                placeholder="Tarih seçin"
                value={bitisTarihi as any}
                onChange={(v) =>
                  setBitisTarihi(v ? new Date(v as string) : null)
                }
              />
              {raporTuru === 'islemler' && (
                <NativeSelect
                  label="Durum Filtresi"
                  data={[
                    { value: 'hepsi', label: 'Tüm Durumlar' },
                    { value: 'basarili', label: 'Başarılı' },
                    { value: 'basarisiz', label: 'Başarısız' },
                    { value: 'beklemede', label: 'Beklemede' },
                  ]}
                  value={durumFiltre}
                  onChange={(e) => setDurumFiltre(e.currentTarget.value)}
                />
              )}
            </SimpleGrid>

            <TextInput
              label="Rapor Başlığı (İsteğe Bağlı)"
              placeholder="Özel rapor başlığı girin..."
              value={raporBaslik}
              onChange={(e) => setRaporBaslik(e.currentTarget.value)}
            />

            <Group justify="flex-end">
              <Button
                variant="light"
                color="gray"
                leftSection={<RefreshCw size={16} />}
                onClick={() => {
                  setBaslangicTarihi(null)
                  setBitisTarihi(null)
                  setDurumFiltre('hepsi')
                  setRaporBaslik('')
                }}
              >
                Sıfırla
              </Button>
              <Button
                color="green"
                leftSection={<FileText size={16} />}
                onClick={handleRaporOlustur}
              >
                Rapor Oluştur
              </Button>
            </Group>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md" mb="lg">
            <ActionIcon variant="light" color="green" size="lg">
              <FileText size={20} />
            </ActionIcon>
            <div>
              <Title order={4}>{raporVerileri.baslik}</Title>
              <Text size="sm" c="dimmed">
                {raporVerileri.toplamKayit} kayıt • Oluşturulma:{' '}
                {new Date().toLocaleDateString('tr-TR')}
              </Text>
            </div>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
            {raporVerileri.ozet.map((item) => (
              <Paper key={item.label} p="md" radius="md" withBorder>
                <Text size="sm" c="dimmed">
                  {item.label}
                </Text>
                <Text fw={700} size="lg">
                  {item.value}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                {raporVerileri.sutunlar.map((sutun) => (
                  <Table.Th key={sutun}>{sutun}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {raporVerileri.veriler.map((satir, index) => (
                <Table.Tr key={index}>
                  {satir.map((hucre, hucreIndex) => (
                    <Table.Td key={hucreIndex}>
                      <Text fw={hucreIndex === 0 ? 500 : 400} size="sm">
                        {hucre}
                      </Text>
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Divider my="lg" />

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Toplam {raporVerileri.toplamKayit} kayıt gösteriliyor
            </Text>
            <Text size="sm" c="dimmed">
              Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
            </Text>
          </Group>
        </Card>
      </Stack>
    </div>
  )
}
