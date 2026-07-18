import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { PageSkeleton } from '#/components/Skeleton'
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
  TextInput,
  Title,
} from '@mantine/core'
import { BarChart } from '@mantine/charts'
import { Smartphone, Search, TrendingUp } from 'lucide-react'
import { useTelefonModelleri } from '#/hooks/use-banking'

export const Route = createFileRoute('/musteri-telefon-bilgileri')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: MusteriTelefonBilgileriPage,
})

const markaRenkleri: Record<string, string> = {
  Apple: 'blue',
  Samsung: 'green',
  Xiaomi: 'orange',
  Huawei: 'red',
  Google: 'yellow',
  Oppo: 'cyan',
  OnePlus: 'violet',
  Nokia: 'gray',
}

function MusteriTelefonBilgileriPage() {
  const { data: modeller = [] } = useTelefonModelleri()
  const [searchTerm, setSearchTerm] = useState('')

  const toplamMusteri = useMemo(
    () => modeller.reduce((sum, m) => sum + m.adet, 0),
    [modeller],
  )

  const filtrelenmisModeller = useMemo(
    () =>
      modeller.filter(
        (m) =>
          m.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.marka.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [modeller, searchTerm],
  )

  const markaDagilimi = useMemo(() => {
    const sayac: Record<string, number> = {}
    for (const m of modeller) {
      sayac[m.marka] = (sayac[m.marka] || 0) + m.adet
    }
    return Object.entries(sayac)
      .map(([marka, adet]) => ({ marka, adet }))
      .sort((a, b) => b.adet - a.adet)
  }, [modeller])

  const barChartData = useMemo(
    () =>
      filtrelenmisModeller.slice(0, 10).map((m) => ({
        model: m.model,
        adet: m.adet,
      })),
    [filtrelenmisModeller],
  )

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Müşteri Telefon Bilgileri</Title>
            <Text c="dimmed">
              Müşterilerin kullandığı telefon modelleri ve marka dağılımı
            </Text>
          </div>
          <TextInput
            placeholder="Model veya marka ara..."
            leftSection={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            w={300}
          />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Toplam Müşteri
                </Text>
                <Text fw={700} size="xl">
                  {toplamMusteri.toLocaleString('tr-TR')}
                </Text>
              </Stack>
              <Paper
                p="md"
                radius="md"
                style={{ backgroundColor: 'var(--mantine-color-blue-light)' }}
              >
                <Smartphone
                  size={24}
                  color="var(--mantine-color-blue-filled)"
                />
              </Paper>
            </Group>
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Toplam Model
                </Text>
                <Text fw={700} size="xl">
                  {modeller.length}
                </Text>
              </Stack>
              <Paper
                p="md"
                radius="md"
                style={{ backgroundColor: 'var(--mantine-color-green-light)' }}
              >
                <TrendingUp
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
                  Toplam Marka
                </Text>
                <Text fw={700} size="xl">
                  {markaDagilimi.length}
                </Text>
              </Stack>
              <Paper
                p="md"
                radius="md"
                style={{ backgroundColor: 'var(--mantine-color-cyan-light)' }}
              >
                <Smartphone
                  size={24}
                  color="var(--mantine-color-cyan-filled)"
                />
              </Paper>
            </Group>
          </Card>
        </SimpleGrid>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">
            En Çok Kullanılan 10 Telefon Modeli
          </Title>
          <BarChart
            h={350}
            data={barChartData}
            dataKey="model"
            series={[
              { name: 'adet', color: 'green.6', label: 'Kullanıcı Sayısı' },
            ]}
            withTooltip
            tooltipProps={{
              content: (props: any) => {
                const { payload, label } = props
                if (!payload || !payload.length) return null
                return (
                  <Paper p="sm" shadow="md" withBorder>
                    <Text fw={500}>{label}</Text>
                    <Text size="sm">
                      {payload[0].value?.toLocaleString('tr-TR')} müşteri
                    </Text>
                  </Paper>
                )
              },
            }}
          />
        </Card>

        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Marka Dağılımı
            </Title>
            <Stack gap="xs">
              {markaDagilimi.map((item) => {
                const yuzde =
                  toplamMusteri > 0
                    ? ((item.adet / toplamMusteri) * 100).toFixed(1)
                    : '0'
                return (
                  <Group
                    key={item.marka}
                    justify="space-between"
                    p="xs"
                    style={{
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderRadius: 8,
                    }}
                  >
                    <Group>
                      <Badge
                        color={markaRenkleri[item.marka] || 'gray'}
                        variant="light"
                      >
                        {item.marka}
                      </Badge>
                    </Group>
                    <Group gap="lg">
                      <Text fw={500}>
                        {item.adet.toLocaleString('tr-TR')} adet
                      </Text>
                      <Text size="sm" c="dimmed" w={50} ta="right">
                        %{yuzde}
                      </Text>
                    </Group>
                  </Group>
                )
              })}
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Tüm Telefon Modelleri
            </Title>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Marka</Table.Th>
                  <Table.Th>Model</Table.Th>
                  <Table.Th>Adet</Table.Th>
                  <Table.Th>Oran</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtrelenmisModeller.map((model, index) => {
                  const yuzde =
                    toplamMusteri > 0
                      ? ((model.adet / toplamMusteri) * 100).toFixed(1)
                      : '0'
                  return (
                    <Table.Tr key={model.model}>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {index + 1}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={markaRenkleri[model.marka] || 'gray'}
                          variant="light"
                        >
                          {model.marka}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>{model.model}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={700}>
                          {model.adet.toLocaleString('tr-TR')}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          %{yuzde}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
                {filtrelenmisModeller.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Text ta="center" c="dimmed" py="xl">
                        Sonuç bulunamadı
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Card>
        </SimpleGrid>
      </Stack>
    </div>
  )
}
