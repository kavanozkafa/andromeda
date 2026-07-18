import { useState } from 'react'
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
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { LogOut, Search, UserCheck } from 'lucide-react'
import { useAktifOturumlar, useAktifOturumKick } from '#/hooks/use-banking'
import type { AktifOturum } from '#/data/mock-data'

export const Route = createFileRoute('/aktif-kullanicilar')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: AktifKullanicilarPage,
})

function AktifKullanicilarPage() {
  const { data: oturumlar = [], isLoading } = useAktifOturumlar()
  const kickMutation = useAktifOturumKick()
  const [searchTerm, setSearchTerm] = useState('')
  const [seciliOturum, setSeciliOturum] = useState<AktifOturum | null>(null)
  const [modalAcik, setModalAcik] = useState(false)

  const handleKickConfirm = (oturum: AktifOturum) => {
    setSeciliOturum(oturum)
    setModalAcik(true)
  }

  const handleKickAction = () => {
    if (seciliOturum) {
      kickMutation.mutate(seciliOturum.id, {
        onSuccess: () => {
          setModalAcik(false)
          setSeciliOturum(null)
        },
      })
    }
  }

  const filteredOturumlar = oturumlar.filter(
    (o) =>
      o.adSoyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.kullaniciAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.ipAdresi.includes(searchTerm) ||
      o.konum.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ width: 'min(1280px, calc(100% - 2rem))', marginInline: 'auto', paddingBlock: '3rem' }}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Group gap="xs">
              <UserCheck size={28} color="var(--mantine-color-green-6)" />
              <Title order={2} style={{ color: 'var(--sea-ink)' }}>Aktif Kullanıcı Oturumları</Title>
            </Group>
            <Text c="dimmed" size="sm">
              Sistemde anlık olarak aktif olan kullanıcıların listesi ve oturum sonlandırma işlemleri.
            </Text>
          </Stack>

          <TextInput
            placeholder="Kullanıcı adı, ad soyad veya IP ara..."
            leftSection={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            w={350}
          />
        </Group>

        <Card padding="md" radius="lg" withBorder style={{ background: 'var(--surface-strong)', boxShadow: '0 10px 25px rgba(30, 90, 72, 0.05)' }}>
          <ScrollArea>
            <Table striped highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Kullanıcı</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>IP Adresi</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Cihaz</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Konum</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Giriş Zamanı</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Son İşlem</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Aktif Sayfa</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Bakiye</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700, width: 80 }}>İşlem</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredOturumlar.map((oturum) => (
                  <Table.Tr key={oturum.id}>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text fw={600} size="sm" style={{ color: 'var(--sea-ink)' }}>{oturum.adSoyad}</Text>
                        <Text size="xs" c="dimmed">{oturum.kullaniciAdi} | {oturum.email}</Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ fontFamily: 'monospace' }}>{oturum.ipAdresi}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{oturum.cihaz}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{oturum.konum}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {oturum.girisTarihi.toLocaleDateString('tr-TR')} {oturum.girisTarihi.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" fw={500}>
                        {oturum.sonIslemTarihi.toLocaleTimeString('tr-TR')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="green">
                        {oturum.aktifSayfa}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={700} style={{ color: 'var(--mantine-color-green-7)' }}>
                        {oturum.bakiye.toLocaleString('tr-TR')} ₺
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="Oturumu Sonlandır (Kick)" withArrow position="left" color="red">
                        <ActionIcon
                          variant="light"
                          color="red"
                          radius="md"
                          onClick={() => handleKickConfirm(oturum)}
                          loading={kickMutation.isPending && seciliOturum?.id === oturum.id}
                        >
                          <LogOut size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}

                {filteredOturumlar.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={9}>
                      <Text ta="center" c="dimmed" py="xl">
                        {isLoading ? 'Yükleniyor...' : 'Aktif oturum bulunamadı.'}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Card>
      </Stack>

      <Modal
        opened={modalAcik}
        onClose={() => setModalAcik(false)}
        title={<Text fw={700} size="lg">Oturumu Sonlandır</Text>}
        centered
        radius="md"
        styles={{ header: { borderBottom: '1px solid var(--line)' }, content: { padding: '1.5rem' } }}
      >
        <Stack gap="md" pt="md">
          <Text size="sm">
            <strong>{seciliOturum?.adSoyad}</strong> kullanıcısının aktif oturumunu sonlandırmak istediğinize emin misiniz? Kullanıcı sistemden çıkarılacaktır.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="outline" color="gray" onClick={() => setModalAcik(false)}>
              İptal
            </Button>
            <Button color="red" onClick={handleKickAction} loading={kickMutation.isPending}>
              Oturumu Sonlandır
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  )
}
