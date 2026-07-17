import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
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
import { AreaChart, BarChart, DonutChart } from '@mantine/charts'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  makeDashboardStats,
  makeGelirDagilimiVerisi,
  makeIslemHacmiVerisi,
  makeKullaniciAktiviteVerisi,
} from '#/data/mock-data'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const [stats] = useState(makeDashboardStats)
  const [islemHacmi] = useState(makeIslemHacmiVerisi)
  const [gelirDagilimi] = useState(makeGelirDagilimiVerisi)
  const [kullaniciAktivitesi] = useState(makeKullaniciAktiviteVerisi)

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats.toplamKullanici.toLocaleString('tr-TR'),
      yuzde: stats.kullaniciYuzdesi,
      icon: Users,
      renk: 'green',
    },
    {
      title: 'Günlük İşlemler',
      value: stats.gunlukIslemler.toLocaleString('tr-TR'),
      yuzde: stats.islemYuzdesi,
      icon: Activity,
      renk: 'blue',
    },
    {
      title: 'Toplam Gelir',
      value: `${stats.toplamGelir.toLocaleString('tr-TR')} ₺`,
      yuzde: stats.gelirYuzdesi,
      icon: TrendingUp,
      renk: 'cyan',
    },
    {
      title: 'Aktif Kartlar',
      value: stats.aktifKartlar.toLocaleString('tr-TR'),
      yuzde: stats.kartYuzdesi,
      icon: CreditCard,
      renk: 'yellow',
    },
  ]

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <div>
          <Title order={2}>Dashboard</Title>
          <Text c="dimmed">Bankacılık sistemi genel durumu</Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {statCards.map((card) => (
            <Card
              key={card.title}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    {card.title}
                  </Text>
                  <Text fw={700} size="xl">
                    {card.value}
                  </Text>
                  <Group gap={4}>
                    {card.yuzde > 0 ? (
                      <ArrowUpRight size={14} color="green" />
                    ) : (
                      <ArrowDownRight size={14} color="red" />
                    )}
                    <Text size="xs" c={card.yuzde > 0 ? 'green' : 'red'}>
                      {card.yuzde > 0 ? '+' : ''}
                      {card.yuzde}%
                    </Text>
                    <Text size="xs" c="dimmed">
                      geçen aya göre
                    </Text>
                  </Group>
                </Stack>
                <Paper
                  p="md"
                  radius="md"
                  style={{
                    backgroundColor: `var(--mantine-color-${card.renk}-light)`,
                  }}
                >
                  <card.icon
                    size={24}
                    color={`var(--mantine-color-${card.renk}-filled)`}
                  />
                </Paper>
              </Group>
            </Card>
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              İşlem Hacmi
            </Title>
            <AreaChart
              h={300}
              data={islemHacmi}
              dataKey="tarih"
              series={[
                { name: 'islemler', color: 'green.6', label: 'İşlemler' },
              ]}
              curveType="monotone"
              fillOpacity={0.3}
              withTooltip
              tooltipProps={{
                content: (props: any) => {
                  const { payload, label } = props
                  if (!payload || !payload.length) return null
                  return (
                    <Paper p="sm" shadow="md" withBorder>
                      <Text fw={500}>{label}</Text>
                      <Text size="sm">
                        {payload[0].value?.toLocaleString('tr-TR')} işlem
                      </Text>
                    </Paper>
                  )
                },
              }}
            />
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Gelir Dağılımı
            </Title>
            <DonutChart
              h={300}
              data={gelirDagilimi.map((item) => ({
                name: item.tur,
                value: item.tutar,
                color: item.renk,
              }))}
              withTooltip
              tooltipProps={{
                content: (props: any) => {
                  const { payload } = props
                  if (!payload || !payload.length) return null
                  const data = payload[0].payload
                  return (
                    <Paper p="sm" shadow="md" withBorder>
                      <Text fw={500}>{data.name}</Text>
                      <Text size="sm">
                        {data.value.toLocaleString('tr-TR')} ₺
                      </Text>
                    </Paper>
                  )
                },
              }}
              withLabels
            />
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Kullanıcı Aktivitesi
            </Title>
            <BarChart
              h={300}
              data={kullaniciAktivitesi}
              dataKey="sehir"
              series={[
                {
                  name: 'aktifKullanici',
                  color: 'green.6',
                  label: 'Aktif Kullanıcı',
                },
                {
                  name: 'yeniKullanicilar',
                  color: 'cyan.6',
                  label: 'Yeni Kullanıcı',
                },
              ]}
              withTooltip
              tooltipProps={{
                content: (props: any) => {
                  const { payload, label } = props
                  if (!payload || !payload.length) return null
                  return (
                    <Paper p="sm" shadow="md" withBorder>
                      <Text fw={500}>{label}</Text>
                      {payload.map((item: any) => (
                        <Text key={item.name} size="sm">
                          {item.name === 'aktifKullanici' ? 'Aktif' : 'Yeni'}:{' '}
                          {item.value?.toLocaleString('tr-TR')}
                        </Text>
                      ))}
                    </Paper>
                  )
                },
              }}
            />
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Son İşlemler
            </Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Müşteri</Table.Th>
                  <Table.Th>İşlem</Table.Th>
                  <Table.Th>Tutar</Table.Th>
                  <Table.Th>Durum</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {[
                  {
                    musteri: 'Ahmet Yılmaz',
                    islem: 'Havale',
                    tutar: 15000,
                    durum: 'basarili',
                  },
                  {
                    musteri: 'Ayşe Demir',
                    islem: 'Ödeme',
                    tutar: 2500,
                    durum: 'basarili',
                  },
                  {
                    musteri: 'Mehmet Kaya',
                    islem: 'EFT',
                    tutar: 8000,
                    durum: 'beklemede',
                  },
                  {
                    musteri: 'Fatma Özkan',
                    islem: 'Yatırım',
                    tutar: 25000,
                    durum: 'basarili',
                  },
                  {
                    musteri: 'Ali Çelik',
                    islem: 'Para Çekme',
                    tutar: 3000,
                    durum: 'basarisiz',
                  },
                ].map((islem, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Text fw={500}>{islem.musteri}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="green">
                        {islem.islem}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>
                        {islem.tutar.toLocaleString('tr-TR')} ₺
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={
                          islem.durum === 'basarili'
                            ? 'green'
                            : islem.durum === 'beklemede'
                              ? 'yellow'
                              : 'red'
                        }
                      >
                        {islem.durum === 'basarili'
                          ? 'Başarılı'
                          : islem.durum === 'beklemede'
                            ? 'Beklemede'
                            : 'Başarısız'}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </SimpleGrid>
      </Stack>
    </div>
  )
}
