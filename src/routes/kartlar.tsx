import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { PageSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { CreditCard, Eye, EyeOff, Lock, Search, Unlock } from 'lucide-react'
import { useKrediKartlari } from '#/hooks/use-banking'
import type { KrediKarti } from '#/data/mock-data'

export const Route = createFileRoute('/kartlar')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: KartlarPage,
})

function KartlarPage() {
  const { data: kartlar = [] } = useKrediKartlari()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCVV, setShowCVV] = useState<string | null>(null)
  const [seciliKart, setSeciliKart] = useState<KrediKarti | null>(null)
  const [detayModalAcik, setDetayModalAcik] = useState(false)

  const filtrelenmisKartlar = useMemo(() => {
    return kartlar.filter(
      (kart) =>
        kart.kartSahibi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kart.kartNo.includes(searchTerm),
    )
  }, [kartlar, searchTerm])

  const aktifKartlar = filtrelenmisKartlar.filter((k) => k.durum === 'aktif')
  const toplamLimit = aktifKartlar.reduce((sum, k) => sum + k.limit, 0)
  const toplamKullanilan = aktifKartlar.reduce(
    (sum, k) => sum + k.kullanilan,
    0,
  )

  const getKartTipiRengi = (tip: KrediKarti['kartTipi']) => {
    switch (tip) {
      case 'visa':
        return {
          bg: 'linear-gradient(135deg, #1a1f71 0%, #2d4db5 100%)',
          text: '#fff',
        }
      case 'mastercard':
        return {
          bg: 'linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)',
          text: '#fff',
        }
      case 'troy':
        return {
          bg: 'linear-gradient(135deg, #0066b2 0%, #00a3e0 100%)',
          text: '#fff',
        }
    }
  }

  const getDurumBadge = (durum: KrediKarti['durum']) => {
    switch (durum) {
      case 'aktif':
        return { color: 'green', label: 'Aktif' }
      case 'blokeli':
        return { color: 'red', label: 'Blokeli' }
      case 'suresi_dolmus':
        return { color: 'yellow', label: 'Süresi Dolmuş' }
    }
  }

  const getKartTuruLabel = (tur: KrediKarti['kartTuru']) => {
    switch (tur) {
      case 'kredi':
        return 'Kredi Kartı'
      case 'borc':
        return 'Banka Kartı'
      case 'onkod':
        return 'Ön Ödemeli Kart'
    }
  }

  const handleToggleBlokla = (kart: KrediKarti) => {
    notifications.show({
      title:
        kart.durum === 'blokeli'
          ? 'Kart Blokajı Kaldırıldı'
          : 'Kart Bloke Edildi',
      message: `${kart.kartNo} numaralı kart ${kart.durum === 'blokeli' ? 'aktif' : 'bloke'} edildi`,
      color: kart.durum === 'blokeli' ? 'green' : 'red',
    })
  }

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Kartlarım</Title>
            <Text c="dimmed">Kredi ve banka kartlarınızı yönetin</Text>
          </div>
          <TextInput
            placeholder="Kart ara..."
            leftSection={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            w={300}
          />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Card p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">
              Aktif Kartlar
            </Text>
            <Text fw={700} size="xl">
              {aktifKartlar.length}
            </Text>
          </Card>
          <Card p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">
              Toplam Limit
            </Text>
            <Text fw={700} size="xl" c="green">
              {toplamLimit.toLocaleString('tr-TR')} ₺
            </Text>
          </Card>
          <Card p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">
              Kullanılabilir
            </Text>
            <Text fw={700} size="xl" c="blue">
              {(toplamLimit - toplamKullanilan).toLocaleString('tr-TR')} ₺
            </Text>
          </Card>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 4 }}>
          {filtrelenmisKartlar.map((kart) => {
            const renk = getKartTipiRengi(kart.kartTipi)
            const durum = getDurumBadge(kart.durum)
            const kullanimOrani = (kart.kullanilan / kart.limit) * 100

            return (
              <Card
                key={kart.id}
                p="lg"
                radius="lg"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSeciliKart(kart)
                  setDetayModalAcik(true)
                }}
              >
                <div
                  style={{
                    background: renk.bg,
                    borderRadius: '12px',
                    padding: '20px',
                    color: renk.text,
                    marginBottom: '16px',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Badge
                      color={
                        kart.durum === 'aktif'
                          ? 'green'
                          : kart.durum === 'blokeli'
                            ? 'red'
                            : 'yellow'
                      }
                      variant="filled"
                      size="sm"
                    >
                      {durum.label}
                    </Badge>
                    <Text size="xs" style={{ opacity: 0.8 }}>
                      {getKartTuruLabel(kart.kartTuru)}
                    </Text>
                  </Group>

                  <div>
                    <Text size="lg" fw={500} ff="monospace" mb={4}>
                      {showCVV === kart.id
                        ? `**** **** **** *${Math.floor(Math.random() * 900 + 100)}`
                        : kart.kartNo}
                    </Text>
                    <Group justify="space-between">
                      <div>
                        <Text size="xs" style={{ opacity: 0.7 }}>
                          KART SAHİBİ
                        </Text>
                        <Text size="sm" fw={500}>
                          {kart.kartSahibi}
                        </Text>
                      </div>
                      <div>
                        <Text size="xs" style={{ opacity: 0.7 }}>
                          SKT
                        </Text>
                        <Text size="sm" fw={500}>
                          {kart.sonKullanma}
                        </Text>
                      </div>
                    </Group>
                  </div>
                </div>

                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Kullanım
                    </Text>
                    <Text size="sm" fw={500}>
                      {kart.kullanilan.toLocaleString('tr-TR')} /{' '}
                      {kart.limit.toLocaleString('tr-TR')} ₺
                    </Text>
                  </Group>
                  <Progress
                    value={kullanimOrani}
                    color={
                      kullanimOrani > 80
                        ? 'red'
                        : kullanimOrani > 50
                          ? 'yellow'
                          : 'green'
                    }
                    size="sm"
                  />
                  <Group justify="flex-end" mt="xs">
                    <ActionIcon
                      variant="subtle"
                      color={kart.durum === 'blokeli' ? 'green' : 'red'}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleBlokla(kart)
                      }}
                    >
                      {kart.durum === 'blokeli' ? (
                        <Unlock size={16} />
                      ) : (
                        <Lock size={16} />
                      )}
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowCVV(showCVV === kart.id ? null : kart.id)
                      }}
                    >
                      {showCVV === kart.id ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </ActionIcon>
                  </Group>
                </Stack>
              </Card>
            )
          })}
        </SimpleGrid>

        <Modal
          opened={detayModalAcik}
          onClose={() => setDetayModalAcik(false)}
          title="Kart Detayları"
          centered
          size="md"
        >
          {seciliKart && (
            <Stack gap="md">
              <div
                style={{
                  background: getKartTipiRengi(seciliKart.kartTipi).bg,
                  borderRadius: '12px',
                  padding: '24px',
                  color: '#fff',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Group justify="space-between">
                  <Badge
                    color={seciliKart.durum === 'aktif' ? 'green' : 'red'}
                    variant="filled"
                  >
                    {getDurumBadge(seciliKart.durum).label}
                  </Badge>
                  <CreditCard size={32} />
                </Group>
                <div>
                  <Text size="lg" ff="monospace" fw={500} mb={8}>
                    {seciliKart.kartNo}
                  </Text>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" style={{ opacity: 0.7 }}>
                        KART SAHİBİ
                      </Text>
                      <Text size="sm">{seciliKart.kartSahibi}</Text>
                    </div>
                    <div>
                      <Text size="xs" style={{ opacity: 0.7 }}>
                        SKT
                      </Text>
                      <Text size="sm">{seciliKart.sonKullanma}</Text>
                    </div>
                  </Group>
                </div>
              </div>

              <Stack gap="sm">
                <Group justify="space-between">
                  <Text c="dimmed">Kart Tipi</Text>
                  <Text fw={500}>{seciliKart.kartTipi.toUpperCase()}</Text>
                </Group>
                <Group justify="space-between">
                  <Text c="dimmed">Kart Türü</Text>
                  <Text fw={500}>{getKartTuruLabel(seciliKart.kartTuru)}</Text>
                </Group>
                <Group justify="space-between">
                  <Text c="dimmed">Limit</Text>
                  <Text fw={500}>
                    {seciliKart.limit.toLocaleString('tr-TR')} ₺
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text c="dimmed">Kullanılan</Text>
                  <Text fw={500} c="red">
                    {seciliKart.kullanilan.toLocaleString('tr-TR')} ₺
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text c="dimmed">Kullanılabilir</Text>
                  <Text fw={500} c="green">
                    {(seciliKart.limit - seciliKart.kullanilan).toLocaleString(
                      'tr-TR',
                    )}{' '}
                    ₺
                  </Text>
                </Group>
              </Stack>

              <Group justify="flex-end" mt="md">
                <Button
                  variant="subtle"
                  color="gray"
                  onClick={() => setDetayModalAcik(false)}
                >
                  Kapat
                </Button>
                <Button
                  color={seciliKart.durum === 'blokeli' ? 'green' : 'red'}
                  leftSection={
                    seciliKart.durum === 'blokeli' ? (
                      <Unlock size={16} />
                    ) : (
                      <Lock size={16} />
                    )
                  }
                  onClick={() => {
                    handleToggleBlokla(seciliKart)
                    setDetayModalAcik(false)
                  }}
                >
                  {seciliKart.durum === 'blokeli' ? 'Bloke Kaldır' : 'Bloke Et'}
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </div>
  )
}
