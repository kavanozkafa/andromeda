import { useCallback, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { TableSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import { DataTable } from '#/components/DataTable'
import {
  Badge,
  Group,
  Pagination,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Search } from 'lucide-react'
import { useBankacilikLoglari } from '#/hooks/use-banking'
import type { ColumnDef } from '@tanstack/react-table'
import type { BankacilikLog } from '#/data/mock-data'

export const Route = createFileRoute('/bankacilik-loglari')({
  ...protectedRouteOptions,
  pendingComponent: () => <TableSkeleton cols={9} />,
  errorComponent: RouteErrorComponent,
  component: BankacilikLoglariPage,
})

const PAGE_SIZE = 10

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
      <Text size="sm">
        {row.original.tarih.toLocaleDateString('tr-TR')}{' '}
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
    accessorKey: 'ipAdresi',
    header: 'IP Adresi',
    cell: ({ row }) => (
      <Text size="sm" c="dimmed">
        {row.original.ipAdresi}
      </Text>
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

function BankacilikLoglariPage() {
  const { data: logs = [] } = useBankacilikLoglari()
  const [searchTerm, setSearchTerm] = useState('')
  const [activePage, setActivePage] = useState(1)

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setActivePage(1)
  }, [])

  const filteredLogs = useMemo(
    () =>
      logs.filter(
        (log) =>
          log.musteriAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.referansNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.islemTipi.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [logs, searchTerm],
  )

  const paginatedLogs = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE
    return filteredLogs.slice(start, start + PAGE_SIZE)
  }, [filteredLogs, activePage])

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE)

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Dijital Bankacılık Logları</Title>
            <Text c="dimmed">Müşteri işlemlerinin detaylı kayıtları</Text>
          </div>
          <TextInput
            placeholder="Müşteri, referans no veya işlem tipi ara..."
            leftSection={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
            w={400}
          />
        </Group>

        <DataTable
          data={paginatedLogs}
          columns={columns}
          emptyMessage="Kayıt bulunamadı"
        />

        <Group justify="center">
          <Text size="sm" c="dimmed">
            {filteredLogs.length} kayıttan {(activePage - 1) * PAGE_SIZE + 1}-
            {Math.min(activePage * PAGE_SIZE, filteredLogs.length)} arası
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
