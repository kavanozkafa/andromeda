import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { DashboardSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import {
  Badge,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { BarChart, DonutChart } from '@mantine/charts'
import { Shield, ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react'
import { useLoginKayitlari } from '#/hooks/use-banking'

export const Route = createFileRoute('/dijital-bankacilik-dashboard')({
  ...protectedRouteOptions,
  pendingComponent: DashboardSkeleton,
  errorComponent: RouteErrorComponent,
  component: DijitalBankacilikDashboardPage,
})

const hataKategoriLabels: Record<string, string> = {
  yanlis_sifre: 'Yanlış Şifre',
  hatali_kullanici_adi: 'Hatalı Kullanıcı Adı',
  hesap_blokeli: 'Hesap Blokeli',
  otp_basarisiz: 'OTP Başarısız',
  oturum_suresi_dolmus: 'Oturum Süresi Dolmuş',
  ip_engelli: 'IP Engelli',
  cok_fazla_deneme: 'Çok Fazla Deneme',
}

const hataKategoriColors: Record<string, string> = {
  yanlis_sifre: 'red',
  hatali_kullanici_adi: 'orange',
  hesap_blokeli: 'dark',
  otp_basarisiz: 'yellow',
  oturum_suresi_dolmus: 'gray',
  ip_engelli: 'violet',
  cok_fazla_deneme: 'pink',
}

function DijitalBankacilikDashboardPage() {
  const { data: loginKayitlari = [] } = useLoginKayitlari()

  const basariliSayisi = useMemo(
    () => loginKayitlari.filter((k) => k.basarili).length,
    [loginKayitlari],
  )

  const hataliSayisi = useMemo(
    () => loginKayitlari.filter((k) => !k.basarili).length,
    [loginKayitlari],
  )

  const basariOrani = useMemo(() => {
    if (loginKayitlari.length === 0) return 0
    return ((basariliSayisi / loginKayitlari.length) * 100).toFixed(1)
  }, [loginKayitlari, basariliSayisi, hataliSayisi])

  const hataKategoriDagilimi = useMemo(() => {
    const hataliKayitlar = loginKayitlari.filter((k) => !k.basarili)
    const sayac: Record<string, number> = {}
    for (const kayit of hataliKayitlar) {
      const kategori = kayit.hataKategorisi || 'diger'
      sayac[kategori] = (sayac[kategori] || 0) + 1
    }
    return Object.entries(sayac)
      .map(([kategori, sayi]) => ({ kategori, sayi }))
      .sort((a, b) => b.sayi - a.sayi)
  }, [loginKayitlari])

  const hataDonutVerisi = useMemo(() => {
    return hataKategoriDagilimi.map((item) => ({
      name: hataKategoriLabels[item.kategori] || item.kategori,
      value: item.sayi,
      color: hataKategoriColors[item.kategori] || 'gray',
    }))
  }, [hataKategoriDagilimi])

  const sonHataliGirisler = useMemo(
    () => loginKayitlari.filter((k) => !k.basarili).slice(0, 10),
    [loginKayitlari],
  )

  const cihazDagilimi = useMemo(() => {
    const sayac: Record<string, number> = {}
    for (const kayit of loginKayitlari) {
      sayac[kayit.cihaz] = (sayac[kayit.cihaz] || 0) + 1
    }
    return Object.entries(sayac)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [loginKayitlari])

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <div>
          <Title order={2}>Dijital Bankacılık Dashboard</Title>
          <Text c="dimmed">Giriş denemeleri ve hata analizi</Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Toplam Deneme
                </Text>
                <Text fw={700} size="xl">
                  {loginKayitlari.length}
                </Text>
              </Stack>
              <Paper
                p="md"
                radius="md"
                style={{ backgroundColor: 'var(--mantine-color-blue-light)' }}
              >
                <Shield size={24} color="var(--mantine-color-blue-filled)" />
              </Paper>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Başarılı Giriş
                </Text>
                <Text fw={700} size="xl" c="green">
                  {basariliSayisi}
                </Text>
                <Text size="xs" c="green">
                  %{basariOrani} oranında
                </Text>
              </Stack>
              <Paper
                p="md"
                radius="md"
                style={{ backgroundColor: 'var(--mantine-color-green-light)' }}
              >
                <ShieldCheck
                  size={24}
                  color="var(--mantine-color-green-filled)"
                />
              </Paper>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Hatalı Giriş
                </Text>
                <Text fw={700} size="xl" c="red">
                  {hataliSayisi}
                </Text>
                <Text size="xs" c="red">
                  %
                  {loginKayitlari.length > 0
                    ? ((hataliSayisi / loginKayitlari.length) * 100).toFixed(1)
                    : 0}{' '}
                  oranında
                </Text>
              </Stack>
              <Paper
                p="md"
                radius="md"
                style={{ backgroundColor: 'var(--mantine-color-red-light)' }}
              >
                <ShieldX size={24} color="var(--mantine-color-red-filled)" />
              </Paper>
            </Group>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Hata Kategorisi
                </Text>
                <Text fw={700} size="xl">
                  {hataKategoriDagilimi.length}
                </Text>
              </Stack>
              <Paper
                p="md"
                radius="md"
                style={{ backgroundColor: 'var(--mantine-color-yellow-light)' }}
              >
                <AlertTriangle
                  size={24}
                  color="var(--mantine-color-yellow-filled)"
                />
              </Paper>
            </Group>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Hata Kategorileri Dağılımı
            </Title>
            <DonutChart
              h={300}
              data={hataDonutVerisi}
              withTooltip
              tooltipProps={{
                content: (props: any) => {
                  const { payload } = props
                  if (!payload || !payload.length) return null
                  const data = payload[0].payload
                  return (
                    <Paper p="sm" shadow="md" withBorder>
                      <Text fw={500}>{data.name}</Text>
                      <Text size="sm">{data.value} deneme</Text>
                    </Paper>
                  )
                },
              }}
              withLabels
            />
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Cihaz Bazlı Giriş Denemeleri
            </Title>
            <BarChart
              h={300}
              data={cihazDagilimi}
              dataKey="name"
              series={[
                { name: 'value', color: 'green.6', label: 'Deneme Sayısı' },
              ]}
              withTooltip
              tooltipProps={{
                content: (props: any) => {
                  const { payload, label } = props
                  if (!payload || !payload.length) return null
                  return (
                    <Paper p="sm" shadow="md" withBorder>
                      <Text fw={500}>{label}</Text>
                      <Text size="sm">{payload[0].value} deneme</Text>
                    </Paper>
                  )
                },
              }}
            />
          </Card>
        </SimpleGrid>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">
            Hata Kategorileri Detayı
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            {hataKategoriDagilimi.map((item) => (
              <Paper key={item.kategori} p="md" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Badge
                    color={hataKategoriColors[item.kategori]}
                    variant="light"
                    size="lg"
                  >
                    {hataKategoriLabels[item.kategori] || item.kategori}
                  </Badge>
                </Group>
                <Text fw={700} size="xl">
                  {item.sayi}
                </Text>
                <Text size="xs" c="dimmed">
                  %
                  {hataliSayisi > 0
                    ? ((item.sayi / hataliSayisi) * 100).toFixed(1)
                    : 0}{' '}
                  hatalar içinde
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">
            Son Hatalı Giriş Denemeleri
          </Title>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Kullanıcı</Table.Th>
                <Table.Th>Hata Türü</Table.Th>
                <Table.Th>IP Adresi</Table.Th>
                <Table.Th>Cihaz</Table.Th>
                <Table.Th>Konum</Table.Th>
                <Table.Th>Tarih</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sonHataliGirisler.map((kayit) => (
                <Table.Tr key={kayit.id}>
                  <Table.Td>
                    <Text fw={500}>{kayit.kullaniciAdi}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        hataKategoriColors[kayit.hataKategorisi || ''] || 'gray'
                      }
                      variant="light"
                    >
                      {hataKategoriLabels[kayit.hataKategorisi || ''] ||
                        'Bilinmiyor'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" ff="monospace">
                      {kayit.ipAdresi}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{kayit.cihaz}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{kayit.konum}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {kayit.tarih.toLocaleDateString('tr-TR')}{' '}
                      {kayit.tarih.toLocaleTimeString('tr-TR')}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>
    </div>
  )
}
