import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Badge,
  Group,
  Pagination,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Search } from 'lucide-react'
import { makeBankacilikLoglari } from '#/data/mock-data'
import type { BankacilikLog } from '#/data/mock-data'

export const Route = createFileRoute('/bankacilik-loglari')({
  component: BankacilikLoglariPage,
})

const PAGE_SIZE = 10

function BankacilikLoglariPage() {
  const [logs] = useState<BankacilikLog[]>(() =>
    makeBankacilikLoglari(50).sort(
      (a, b) => b.tarih.getTime() - a.tarih.getTime(),
    ),
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [activePage, setActivePage] = useState(1)

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
            onChange={(e) => {
              setSearchTerm(e.currentTarget.value)
              setActivePage(1)
            }}
            w={400}
          />
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Müşteri Adı</Table.Th>
                <Table.Th>İşlem Tipi</Table.Th>
                <Table.Th>Tutar</Table.Th>
                <Table.Th>Tarih</Table.Th>
                <Table.Th>Durum</Table.Th>
                <Table.Th>IP Adresi</Table.Th>
                <Table.Th>Cihaz</Table.Th>
                <Table.Th>Konum</Table.Th>
                <Table.Th>Referans No</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedLogs.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>
                    <Text fw={500}>{log.musteriAdi}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={getIslemTipiColor(log.islemTipi)}
                      variant="light"
                    >
                      {getIslemTipiLabel(log.islemTipi)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{log.tutar.toLocaleString('tr-TR')} ₺</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {log.tarih.toLocaleDateString('tr-TR')}{' '}
                      {log.tarih.toLocaleTimeString('tr-TR')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={getDurumColor(log.durum)} variant="light">
                      {getDurumLabel(log.durum)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {log.ipAdresi}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{log.cihaz}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{log.konum}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">
                      {log.referansNo}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
              {paginatedLogs.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={9}>
                    <Text ta="center" c="dimmed" py="xl">
                      Kayıt bulunamadı
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>

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
