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
  NativeSelect,
  ScrollArea,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { Edit, MessageSquare, Plus, Search, Trash } from 'lucide-react'
import {
  useSistemMesajlari,
  useSistemMesajiCreate,
  useSistemMesajiUpdate,
  useSistemMesajiDelete,
} from '#/hooks/use-banking'
import type { SistemMesaji } from '#/data/mock-data'

export const Route = createFileRoute('/mesajlar-ve-etiketler')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: MesajlarVeEtiketlerPage,
})

function MesajlarVeEtiketlerPage() {
  const { data: mesajlar = [], isLoading } = useSistemMesajlari()
  const createMutation = useSistemMesajiCreate()
  const updateMutation = useSistemMesajiUpdate()
  const deleteMutation = useSistemMesajiDelete()

  const [filterTur, setFilterTur] = useState<string>('hepsi')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAcik, setModalAcik] = useState(false)
  const [duzenlenenMesaj, setDuzenlenenMesaj] = useState<SistemMesaji | null>(null)

  const form = useForm({
    initialValues: {
      kod: '',
      tur: 'hata',
      deger: '',
      aciklama: '',
    },
    validate: {
      kod: (value) => {
        if (value.trim().length < 3) return 'Kod en az 3 karakter olmalıdır'
        if (!/^[A-Z0-9_]+$/.test(value)) return 'Kod sadece büyük harf, rakam ve alt çizgi (_) içerebilir'
        return null
      },
      deger: (value) => (value.trim().length < 1 ? 'Değer boş bırakılamaz' : null),
      aciklama: (value) => (value.trim().length < 5 ? 'Açıklama en az 5 karakter olmalıdır' : null),
    },
  })

  const handleEkleDuzenleAc = (mesaj?: SistemMesaji) => {
    if (mesaj) {
      setDuzenlenenMesaj(mesaj)
      form.setValues({
        kod: mesaj.kod,
        tur: mesaj.tur,
        deger: mesaj.deger,
        aciklama: mesaj.aciklama,
      })
    } else {
      setDuzenlenenMesaj(null)
      form.reset()
    }
    setModalAcik(true)
  }

  const handleKaydet = (values: typeof form.values) => {
    if (duzenlenenMesaj) {
      updateMutation.mutate(
        {
          id: duzenlenenMesaj.id,
          data: {
            kod: values.kod.toUpperCase(),
            tur: values.tur as SistemMesaji['tur'],
            deger: values.deger,
            aciklama: values.aciklama,
          },
        },
        {
          onSuccess: () => {
            setModalAcik(false)
            form.reset()
          },
        }
      )
    } else {
      createMutation.mutate(
        {
          kod: values.kod.toUpperCase(),
          tur: values.tur as SistemMesaji['tur'],
          deger: values.deger,
          aciklama: values.aciklama,
        },
        {
          onSuccess: () => {
            setModalAcik(false)
            form.reset()
          },
        }
      )
    }
  }

  const handleSil = (id: string, kod: string) => {
    if (confirm(`"${kod}" kodlu mesajı/etiketi silmek istediğinize emin misiniz?`)) {
      deleteMutation.mutate(id)
    }
  }

  const getTurColor = (tur: SistemMesaji['tur']) => {
    switch (tur) {
      case 'hata':
        return 'red'
      case 'uyari':
        return 'yellow'
      case 'etiket':
        return 'blue'
      case 'mesaj':
        return 'green'
      default:
        return 'gray'
    }
  }

  const getTurLabel = (tur: SistemMesaji['tur']) => {
    switch (tur) {
      case 'hata':
        return 'Hata Mesajı'
      case 'uyari':
        return 'Uyarı Mesajı'
      case 'etiket':
        return 'Arayüz Etiketi'
      case 'mesaj':
        return 'Bilgi Mesajı'
      default:
        return tur
    }
  }

  const filteredMesajlar = mesajlar.filter((m) => {
    const matchesTur = filterTur === 'hepsi' || m.tur === filterTur
    const matchesSearch =
      m.kod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.deger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.aciklama.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTur && matchesSearch
  })

  return (
    <div style={{ width: 'min(1280px, calc(100% - 2rem))', marginInline: 'auto', paddingBlock: '3rem' }}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Group gap="xs">
              <MessageSquare size={28} color="var(--mantine-color-green-6)" />
              <Title order={2} style={{ color: 'var(--sea-ink)' }}>Sistem Mesajları ve Etiketler</Title>
            </Group>
            <Text c="dimmed" size="sm">
              Hata kodları, sistem uyarıları, arayüz etiketleri ve bildirim şablonlarını yönetin.
            </Text>
          </Stack>

          <Button
            leftSection={<Plus size={16} />}
            color="green"
            onClick={() => handleEkleDuzenleAc()}
          >
            Yeni Mesaj / Etiket Ekle
          </Button>
        </Group>

        <Group justify="space-between" align="center" gap="md">
          <SegmentedControl
            value={filterTur}
            onChange={setFilterTur}
            color="green"
            data={[
              { label: 'Tüm Mesajlar', value: 'hepsi' },
              { label: 'Hata Mesajları', value: 'hata' },
              { label: 'Uyarılar', value: 'uyari' },
              { label: 'Etiketler', value: 'etiket' },
              { label: 'Mesajlar', value: 'mesaj' },
            ]}
          />

          <TextInput
            placeholder="Mesaj kodu, değer veya açıklama ara..."
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
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Kod</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Tür</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Değer / Metin</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Açıklama</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Son Güncelleme</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700, width: 100 }}>İşlemler</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredMesajlar.map((mesaj) => (
                  <Table.Tr key={mesaj.id}>
                    <Table.Td>
                      <Text fw={600} size="sm" style={{ fontFamily: 'monospace', color: 'var(--sea-ink)' }}>
                        {mesaj.kod}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={getTurColor(mesaj.tur)}>
                        {getTurLabel(mesaj.tur)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ fontWeight: 500 }}>{mesaj.deger}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{mesaj.aciklama}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {mesaj.guncellemeTarihi.toLocaleDateString('tr-TR')} {mesaj.guncellemeTarihi.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          radius="md"
                          onClick={() => handleEkleDuzenleAc(mesaj)}
                        >
                          <Edit size={14} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          radius="md"
                          onClick={() => handleSil(mesaj.id, mesaj.kod)}
                          loading={deleteMutation.isPending}
                        >
                          <Trash size={14} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}

                {filteredMesajlar.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={6}>
                      <Text ta="center" c="dimmed" py="xl">
                        {isLoading ? 'Yükleniyor...' : 'Eşleşen sistem mesajı/etiketi bulunamadı.'}
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
        title={
          <Text fw={700} size="lg">
            {duzenlenenMesaj ? 'Mesaj / Etiket Düzenle' : 'Yeni Mesaj / Etiket Ekle'}
          </Text>
        }
        centered
        radius="md"
        styles={{ header: { borderBottom: '1px solid var(--line)' }, content: { padding: '1.5rem' } }}
      >
        <form onSubmit={form.onSubmit(handleKaydet)}>
          <Stack gap="md" pt="md">
            <TextInput
              label="Mesaj Kodu (Büyük harf ve alt çizgi)"
              placeholder="Örn: ERR_CONNECTION_LOST"
              required
              {...form.getInputProps('kod')}
              disabled={!!duzenlenenMesaj}
            />

            <NativeSelect
              label="Tür"
              data={[
                { value: 'hata', label: 'Hata Mesajı' },
                { value: 'uyari', label: 'Uyarı Mesajı' },
                { value: 'etiket', label: 'Arayüz Etiketi' },
                { value: 'mesaj', label: 'Bilgi Mesajı' },
              ]}
              {...form.getInputProps('tur')}
            />

            <TextInput
              label="Değer / Mesaj Metni"
              placeholder="Örn: Bağlantı zaman aşımına uğradı."
              required
              {...form.getInputProps('deger')}
            />

            <Textarea
              label="Açıklama"
              placeholder="Bu mesajın hangi durumda tetiklendiğini açıklayın."
              required
              minRows={3}
              {...form.getInputProps('aciklama')}
            />

            <Group justify="flex-end" gap="sm" pt="md">
              <Button variant="outline" color="gray" onClick={() => setModalAcik(false)}>
                İptal
              </Button>
              <Button type="submit" color="green" loading={createMutation.isPending || updateMutation.isPending}>
                Kaydet
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  )
}
