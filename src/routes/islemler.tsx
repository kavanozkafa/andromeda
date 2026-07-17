import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NativeSelect,
  Pagination,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { Download, Filter, Search } from 'lucide-react'
import { makeBankacilikLoglari } from '#/data/mock-data'
import type { BankacilikLog } from '#/data/mock-data'

export const Route = createFileRoute('/islemler')({
  component: IslemlerPage,
})

const PAGE_SIZE = 15

function IslemlerPage() {
  const [islemler] = useState<BankacilikLog[]>(() =>
    makeBankacilikLoglari(100).sort(
      (a, b) => b.tarih.getTime() - a.tarih.getTime(),
    ),
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [islemTipiFiltre, setIslemTipiFiltre] = useState<string>('hepsi')
  const [durumFiltre, setDurumFiltre] = useState<string>('hepsi')
  const [tarihAraligi, setTarihAraligi] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])
  const [showFilters, setShowFilters] = useState(false)

  const filteredIslemler = useMemo(() => {
    return islemler.filter((islem) => {
      const searchMatch =
        islem.musteriAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        islem.referansNo.toLowerCase().includes(searchTerm.toLowerCase())

      const tipMatch =
        islemTipiFiltre === 'hepsi' || islem.islemTipi === islemTipiFiltre

      const durumMatch = durumFiltre === 'hepsi' || islem.durum === durumFiltre

      const tarihMatch =
        !tarihAraligi[0] ||
        !tarihAraligi[1] ||
        (islem.tarih >= tarihAraligi[0] && islem.tarih <= tarihAraligi[1])

      return searchMatch && tipMatch && durumMatch && tarihMatch
    })
  }, [islemler, searchTerm, islemTipiFiltre, durumFiltre, tarihAraligi])

  const paginatedIslemler = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE
    return filteredIslemler.slice(start, start + PAGE_SIZE)
  }, [filteredIslemler, activePage])

  const totalPages = Math.ceil(filteredIslemler.length / PAGE_SIZE)

  const toplamTutar = useMemo(() => {
    return filteredIslemler.reduce((sum, islem) => sum + islem.tutar, 0)
  }, [filteredIslemler])

  const basariliSayisi = useMemo(() => {
    return filteredIslemler.filter((i) => i.durum === 'basarili').length
  }, [filteredIslemler])

  const getIslemTipiLabel = (tip: BankacilikLog['islemTipi']) => {
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

  const getIslemTipiColor = (tip: BankacilikLog['islemTipi']) => {
    const colors: Record<BankacilikLog['islemTipi'], string> = {
      para_yatirma: 'green',
      para_cekme: 'red',
      havale: 'blue',
      eft: 'cyan',
      odeme: 'yellow',
      yatirim: 'purple',
    }
    return colors[tip]
  }

  const getDurumColor = (durum: BankacilikLog['durum']) => {
    switch (durum) {
      case 'basarili':
        return 'green'
      case 'basarisiz':
        return 'red'
      case 'beklemede':
        return 'yellow'
    }
  }

  const getDurumLabel = (durum: BankacilikLog['durum']) => {
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
    const headers = [
      'Müşteri',
      'İşlem Tipi',
      'Tutar',
      'Tarih',
      'Durum',
      'Referans No',
    ]
    const rows = filteredIslemler.map((islem) => [
      islem.musteriAdi,
      getIslemTipiLabel(islem.islemTipi),
      islem.tutar.toFixed(2),
      islem.tarih.toLocaleDateString('tr-TR'),
      getDurumLabel(islem.durum),
      islem.referansNo,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `islemler_${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    notifications.show({
      title: 'Dışa Aktarıldı',
      message: `${filteredIslemler.length} işlem CSV olarak indirildi`,
      color: 'green',
    })
  }

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>İşlem Geçmişi</Title>
            <Text c="dimmed">
              Tüm bankacılık işlemlerini görüntüleyin ve filtreleyin
            </Text>
          </div>
          <Group>
            <Button
              variant="light"
              color="green"
              leftSection={<Download size={16} />}
              onClick={handleExportCSV}
            >
              CSV İndir
            </Button>
            <ActionIcon
              variant={showFilters ? 'filled' : 'light'}
              color="green"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
            </ActionIcon>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Paper p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">
              Toplam İşlem
            </Text>
            <Text fw={700} size="xl">
              {filteredIslemler.length}
            </Text>
          </Paper>
          <Paper p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">
              Toplam Tutar
            </Text>
            <Text fw={700} size="xl" c="green">
              {toplamTutar.toLocaleString('tr-TR')} ₺
            </Text>
          </Paper>
          <Paper p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">
              Başarı Oranı
            </Text>
            <Text fw={700} size="xl" c="blue">
              %
              {filteredIslemler.length > 0
                ? ((basariliSayisi / filteredIslemler.length) * 100).toFixed(1)
                : 0}
            </Text>
          </Paper>
        </SimpleGrid>

        {showFilters && (
          <Paper p="md" radius="md" withBorder>
            <Group align="flex-end">
              <TextInput
                placeholder="Müşteri veya referans no ara..."
                leftSection={<Search size={16} />}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.currentTarget.value)
                  setActivePage(1)
                }}
                w={300}
              />
              <NativeSelect
                data={[
                  { value: 'hepsi', label: 'Tüm Tipler' },
                  { value: 'para_yatirma', label: 'Para Yatırma' },
                  { value: 'para_cekme', label: 'Para Çekme' },
                  { value: 'havale', label: 'Havale' },
                  { value: 'eft', label: 'EFT' },
                  { value: 'odeme', label: 'Ödeme' },
                  { value: 'yatirim', label: 'Yatırım' },
                ]}
                value={islemTipiFiltre}
                onChange={(e) => {
                  setIslemTipiFiltre(e.currentTarget.value)
                  setActivePage(1)
                }}
                w={180}
              />
              <NativeSelect
                data={[
                  { value: 'hepsi', label: 'Tüm Durumlar' },
                  { value: 'basarili', label: 'Başarılı' },
                  { value: 'basarisiz', label: 'Başarısız' },
                  { value: 'beklemede', label: 'Beklemede' },
                ]}
                value={durumFiltre}
                onChange={(e) => {
                  setDurumFiltre(e.currentTarget.value)
                  setActivePage(1)
                }}
                w={160}
              />
              <DatePickerInput
                type="range"
                placeholder="Tarih aralığı seçin"
                value={tarihAraligi as any}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    const parsed: [Date | null, Date | null] = [
                      value[0] ? new Date(value[0]) : null,
                      value[1] ? new Date(value[1]) : null,
                    ]
                    setTarihAraligi(parsed)
                    setActivePage(1)
                  }
                }}
                w={280}
              />
            </Group>
          </Paper>
        )}

        <ScrollArea>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Müşteri Adı</Table.Th>
                <Table.Th>İşlem Tipi</Table.Th>
                <Table.Th>Tutar</Table.Th>
                <Table.Th>Tarih</Table.Th>
                <Table.Th>Saat</Table.Th>
                <Table.Th>Durum</Table.Th>
                <Table.Th>Cihaz</Table.Th>
                <Table.Th>Konum</Table.Th>
                <Table.Th>Referans No</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedIslemler.map((islem) => (
                <Table.Tr key={islem.id}>
                  <Table.Td>
                    <Text fw={500}>{islem.musteriAdi}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getIslemTipiColor(islem.islemTipi)}
                      variant="light"
                    >
                      {getIslemTipiLabel(islem.islemTipi)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>
                      {islem.tutar.toLocaleString('tr-TR')} ₺
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {islem.tarih.toLocaleDateString('tr-TR')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {islem.tarih.toLocaleTimeString('tr-TR')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getDurumColor(islem.durum)} variant="light">
                      {getDurumLabel(islem.durum)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{islem.cihaz}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{islem.konum}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">
                      {islem.referansNo}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
              {paginatedIslemler.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={9}>
                    <Text ta="center" c="dimmed" py="xl">
                      Arama kriterlerinize uygun işlem bulunamadı
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        <Group justify="center">
          <Text size="sm" c="dimmed">
            {filteredIslemler.length} kayıttan{' '}
            {(activePage - 1) * PAGE_SIZE + 1}-
            {Math.min(activePage * PAGE_SIZE, filteredIslemler.length)} arası
            gösteriliyor
          </Text>
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            color="green"
          />
        </Group>
      </Stack>
    </div>
  )
}
