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
  NumberInput,
  ScrollArea,
  SegmentedControl,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Edit, Plus, Sliders, Trash, Search } from 'lucide-react'
import {
  useSistemParametreleri,
  useSistemParametreCreate,
  useSistemParametreUpdate,
  useSistemParametreDelete,
} from '#/hooks/use-banking'
import type { SistemParametresi } from '#/data/mock-data'

export const Route = createFileRoute('/sistem-parametreleri')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: SistemParametreleriPage,
})

function SistemParametreleriPage() {
  const { data: parametreler = [], isLoading } = useSistemParametreleri()
  const createMutation = useSistemParametreCreate()
  const updateMutation = useSistemParametreUpdate()
  const deleteMutation = useSistemParametreDelete()

  const [filterGrup, setFilterGrup] = useState<string>('hepsi')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAcik, setModalAcik] = useState(false)
  const [duzenlenenParametre, setDuzenlenenParametre] = useState<SistemParametresi | null>(null)

  const form = useForm({
    initialValues: {
      anahtar: '',
      deger: '',
      tip: 'string' as SistemParametresi['tip'],
      aciklama: '',
      grup: 'genel' as SistemParametresi['grup'],
    },
    validate: {
      anahtar: (value) => (value.trim().length < 3 ? 'Anahtar en az 3 karakter olmalıdır' : null),
      deger: (value) => (value.trim().length < 1 ? 'Değer boş bırakılamaz' : null),
      aciklama: (value) => (value.trim().length < 5 ? 'Açıklama en az 5 karakter olmalıdır' : null),
    },
  })

  const handleEkleDuzenleAc = (parametre?: SistemParametresi) => {
    if (parametre) {
      setDuzenlenenParametre(parametre)
      form.setValues({
        anahtar: parametre.anahtar,
        deger: parametre.deger,
        tip: parametre.tip,
        aciklama: parametre.aciklama,
        grup: parametre.grup,
      })
    } else {
      setDuzenlenenParametre(null)
      form.reset()
      form.setFieldValue('tip', 'string')
      form.setFieldValue('deger', '')
    }
    setModalAcik(true)
  }

  const handleKaydet = (values: typeof form.values) => {
    if (duzenlenenParametre) {
      updateMutation.mutate(
        {
          id: duzenlenenParametre.id,
          data: {
            anahtar: values.anahtar,
            deger: values.deger,
            tip: values.tip,
            aciklama: values.aciklama,
            grup: values.grup,
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
          anahtar: values.anahtar,
          deger: values.deger,
          tip: values.tip,
          aciklama: values.aciklama,
          grup: values.grup,
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

  const handleSil = (id: string, anahtar: string) => {
    if (confirm(`"${anahtar}" parametresini silmek istediğinize emin misiniz?`)) {
      deleteMutation.mutate(id)
    }
  }

  const getGrupColor = (grup: SistemParametresi['grup']) => {
    switch (grup) {
      case 'limit':
        return 'blue'
      case 'guvenlik':
        return 'red'
      case 'genel':
        return 'green'
      default:
        return 'gray'
    }
  }

  const getGrupLabel = (grup: SistemParametresi['grup']) => {
    switch (grup) {
      case 'limit':
        return 'Limit Ayarları'
      case 'guvenlik':
        return 'Güvenlik Ayarları'
      case 'genel':
        return 'Genel Ayarlar'
      default:
        return grup
    }
  }

  const getTipColor = (tip: SistemParametresi['tip']) => {
    switch (tip) {
      case 'boolean':
        return 'teal'
      case 'number':
        return 'indigo'
      case 'string':
        return 'orange'
      default:
        return 'gray'
    }
  }

  const getTipLabel = (tip: SistemParametresi['tip']) => {
    switch (tip) {
      case 'boolean':
        return 'Boolean'
      case 'number':
        return 'Sayı (Int)'
      case 'string':
        return 'Metin'
      default:
        return tip
    }
  }

  const renderDegerCell = (parametre: SistemParametresi) => {
    if (parametre.tip === 'boolean') {
      const isTrue = parametre.deger === 'true'
      return (
        <Badge variant="light" color={isTrue ? 'teal' : 'red'}>
          {isTrue ? 'AÇIK (True)' : 'KAPALI (False)'}
        </Badge>
      )
    }
    if (parametre.tip === 'number') {
      return (
        <Badge variant="outline" color="indigo">
          {Number(parametre.deger).toLocaleString('tr-TR')}
        </Badge>
      )
    }
    return (
      <Text size="sm" fw={500} style={{ wordBreak: 'break-all' }}>
        {parametre.deger}
      </Text>
    )
  }

  const filteredParametreler = parametreler.filter((p) => {
    const matchesGrup = filterGrup === 'hepsi' || p.grup === filterGrup
    const matchesSearch =
      p.anahtar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.aciklama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.deger.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesGrup && matchesSearch
  })

  return (
    <div style={{ width: 'min(1280px, calc(100% - 2rem))', marginInline: 'auto', paddingBlock: '3rem' }}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Group gap="xs">
              <Sliders size={28} color="var(--mantine-color-green-6)" />
              <Title order={2} style={{ color: 'var(--sea-ink)' }}>Sistem Parametreleri</Title>
            </Group>
            <Text c="dimmed" size="sm">
              Uygulama limitleri, güvenlik kuralları ve genel sistem davranışlarını düzenleyin.
            </Text>
          </Stack>

          <Button
            leftSection={<Plus size={16} />}
            color="green"
            onClick={() => handleEkleDuzenleAc()}
          >
            Yeni Parametre Ekle
          </Button>
        </Group>

        <Group justify="space-between" align="center" gap="md">
          <SegmentedControl
            value={filterGrup}
            onChange={setFilterGrup}
            color="green"
            data={[
              { label: 'Tüm Parametreler', value: 'hepsi' },
              { label: 'Limitler', value: 'limit' },
              { label: 'Güvenlik', value: 'guvenlik' },
              { label: 'Genel', value: 'genel' },
            ]}
          />

          <TextInput
            placeholder="Parametre anahtarı, açıklama veya değer ara..."
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
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Parametre Anahtarı</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Açıklama</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Tip</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Grup</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700, width: 220 }}>Değer</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700 }}>Son Güncelleme</Table.Th>
                  <Table.Th style={{ color: 'var(--sea-ink)', fontWeight: 700, width: 100 }}>İşlemler</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredParametreler.map((parametre) => (
                  <Table.Tr key={parametre.id}>
                    <Table.Td>
                      <Text fw={600} size="sm" style={{ fontFamily: 'monospace', color: 'var(--sea-ink)' }}>
                        {parametre.anahtar}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{parametre.aciklama}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="outline" color={getTipColor(parametre.tip)}>
                        {getTipLabel(parametre.tip)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={getGrupColor(parametre.grup)}>
                        {getGrupLabel(parametre.grup)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {renderDegerCell(parametre)}
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">
                        {parametre.guncellemeTarihi.toLocaleDateString('tr-TR')} {parametre.guncellemeTarihi.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          radius="md"
                          onClick={() => handleEkleDuzenleAc(parametre)}
                        >
                          <Edit size={14} />
                        </ActionIcon>
                        <ActionIcon
                          variant="light"
                          color="red"
                          radius="md"
                          onClick={() => handleSil(parametre.id, parametre.anahtar)}
                          loading={deleteMutation.isPending}
                        >
                          <Trash size={14} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}

                {filteredParametreler.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Text ta="center" c="dimmed" py="xl">
                        {isLoading ? 'Yükleniyor...' : 'Eşleşen parametre bulunamadı.'}
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
            {duzenlenenParametre ? 'Parametre Düzenle' : 'Yeni Parametre Ekle'}
          </Text>
        }
        centered
        radius="md"
        styles={{ header: { borderBottom: '1px solid var(--line)' }, content: { padding: '1.5rem' } }}
      >
        <form onSubmit={form.onSubmit(handleKaydet)}>
          <Stack gap="md" pt="md">
            <TextInput
              label="Parametre Anahtarı"
              placeholder="Örn: MAX_PASSWORD_ATTEMPTS"
              required
              {...form.getInputProps('anahtar')}
              disabled={!!duzenlenenParametre}
            />

            <NativeSelect
              label="Parametre Tipi"
              data={[
                { value: 'string', label: 'Metin (String)' },
                { value: 'number', label: 'Sayı (Int)' },
                { value: 'boolean', label: 'Mantıksal (Boolean)' },
              ]}
              {...form.getInputProps('tip')}
              disabled={!!duzenlenenParametre}
              onChange={(e) => {
                const newTip = e.currentTarget.value as SistemParametresi['tip']
                form.setFieldValue('tip', newTip)
                if (newTip === 'boolean') {
                  form.setFieldValue('deger', 'false')
                } else {
                  form.setFieldValue('deger', '')
                }
              }}
            />

            {form.values.tip === 'boolean' ? (
              <Switch
                label="Parametre Değeri (AÇIK / KAPALI)"
                checked={form.values.deger === 'true'}
                onChange={(e) => form.setFieldValue('deger', e.currentTarget.checked ? 'true' : 'false')}
                color="green"
                mt="xs"
              />
            ) : form.values.tip === 'number' ? (
              <NumberInput
                label="Parametre Değeri (Sayı)"
                placeholder="Örn: 100"
                value={form.values.deger ? Number(form.values.deger) : undefined}
                onChange={(val) => form.setFieldValue('deger', String(val))}
                required
                allowDecimal={false}
              />
            ) : (
              <TextInput
                label="Parametre Değeri"
                placeholder="Örn: AndromedaBank"
                required
                {...form.getInputProps('deger')}
              />
            )}

            <NativeSelect
              label="Grup"
              data={[
                { value: 'genel', label: 'Genel Ayarlar' },
                { value: 'limit', label: 'Limit Ayarları' },
                { value: 'guvenlik', label: 'Güvenlik Ayarları' },
              ]}
              {...form.getInputProps('grup')}
            />

            <Textarea
              label="Açıklama"
              placeholder="Bu parametrenin sistemde ne amaçla kullanıldığını açıklayın."
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
