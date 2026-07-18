import { useCallback, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { TableSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import { DataTable } from '#/components/DataTable'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NativeSelect,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { Download, Filter, Search } from 'lucide-react'
import { useBankacilikLoglari } from '#/hooks/use-banking'
import type { ColumnDef } from '@tanstack/react-table'
import type { BankacilikLog } from '#/data/mock-data'

export const Route = createFileRoute('/islemler')({
  ...protectedRouteOptions,
  pendingComponent: () => <TableSkeleton cols={9} />,
  errorComponent: RouteErrorComponent,
  component: IslemlerPage,
})

const PAGE_SIZE = 15

const islemTipiLabels: Record<BankacilikLog['islemTipi'], string> = {
  para_yatirma: 'Para Yatırma',
  para_cekme: 'Para Çekme',
  havale: 'Havale',
  eft: 'EFT',
  odeme: 'Ödeme',
  yatirim: 'Yatırım',
}

const islemTipiColors: Record<BankacilikLog['islemTipi'], string> = {
  para_yatirma: 'green',
  para_cekme: 'red',
  havale: 'blue',
  eft: 'cyan',
  odeme: 'yellow',
  yatirim: 'purple',
}

function getDurumColor(durum: BankacilikLog['durum']) {
  switch (durum) {
    case 'basarili':
      return 'green'
    case 'basarisiz':
      return 'red'
    case 'beklemede':
      return 'yellow'
  }
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

const columns: ColumnDef<BankacilikLog, any>[] = [
  {
    accessorKey: 'musteriAdi',
    header: 'Müşteri Adı',
    cell: ({ row }) => <Text fw={500}>{row.original.musteriAdi}</Text>,
  },
  {
    accessorKey: 'islemTipi',
    header: 'İşlem Tipi',
    cell: ({ row }) => (
      <Badge color={islemTipiColors[row.original.islemTipi]} variant="light">
        {islemTipiLabels[row.original.islemTipi]}
      </Badge>
    ),
  },
  {
    accessorKey: 'tutar',
    header: 'Tutar',
    cell: ({ row }) => (
      <Text fw={500}>{row.original.tutar.toLocaleString('tr-TR')} ₺</Text>
    ),
  },
  {
    accessorKey: 'tarih',
    header: 'Tarih',
    cell: ({ row }) => (
      <Text size="sm">{row.original.tarih.toLocaleDateString('tr-TR')}</Text>
    ),
  },
  {
    id: 'saat',
    header: 'Saat',
    cell: ({ row }) => (
      <Text size="sm" c="dimmed">
        {row.original.tarih.toLocaleTimeString('tr-TR')}
      </Text>
    ),
  },
  {
    accessorKey: 'durum',
    header: 'Durum',
    cell: ({ row }) => (
      <Badge color={getDurumColor(row.original.durum)} variant="light">
        {getDurumLabel(row.original.durum)}
      </Badge>
    ),
  },
  {
    accessorKey: 'cihaz',
    header: 'Cihaz',
    cell: ({ row }) => <Text size="sm">{row.original.cihaz}</Text>,
  },
  {
    accessorKey: 'konum',
    header: 'Konum',
    cell: ({ row }) => <Text size="sm">{row.original.konum}</Text>,
  },
  {
    accessorKey: 'referansNo',
    header: 'Referans No',
    cell: ({ row }) => (
      <Text size="sm" ff="monospace">
        {row.original.referansNo}
      </Text>
    ),
  },
]

function IslemlerPage() {
  const { data: islemler = [] } = useBankacilikLoglari()
  const [searchTerm, setSearchTerm] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [islemTipiFiltre, setIslemTipiFiltre] = useState<string>('hepsi')
  const [durumFiltre, setDurumFiltre] = useState<string>('hepsi')
  const [tarihAraligi, setTarihAraligi] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])
  const [showFilters, setShowFilters] = useState(false)

  const toggleFilters = useCallback(() => setShowFilters((prev) => !prev), [])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setActivePage(1)
  }, [])

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

  const handleExportCSV = useCallback(() => {
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
      islemTipiLabels[islem.islemTipi],
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
  }, [filteredIslemler])

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
              onClick={toggleFilters}
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
                onChange={(e) => handleSearchChange(e.currentTarget.value)}
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

        <DataTable
          data={paginatedIslemler}
          columns={columns}
          emptyMessage="Arama kriterlerinize uygun işlem bulunamadı"
        />

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
