import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { PageSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NativeSelect,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Check, Plus, Trash, X } from 'lucide-react'
import {
  useDuyurular,
  useDuyuruCreate,
  useDuyuruUpdate,
  useDuyuruDelete,
} from '#/hooks/use-banking'
import type { Duyuru } from '#/data/mock-data'

export const Route = createFileRoute('/duyurular')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: DuyurularPage,
})

function DuyurularPage() {
  const { data: duyurular = [] } = useDuyurular()
  const createMutation = useDuyuruCreate()
  const updateMutation = useDuyuruUpdate()
  const deleteMutation = useDuyuruDelete()

  const [duzenlenenId, setDuzenlenenId] = useState<string | null>(null)
  const [duzenlenenBaslik, setDuzenlenenBaslik] = useState('')
  const [duzenlenenIcerik, setDuzenlenenIcerik] = useState('')
  const [duzenlenenDurum, setDuzenlenenDurum] = useState<string>('aktif')
  const [yeniBaslik, setYeniBaslik] = useState('')
  const [yeniIcerik, setYeniIcerik] = useState('')
  const [yeniSatirAcik, setYeniSatirAcik] = useState(false)

  const handleBaslaDuzenle = (duyuru: Duyuru) => {
    setDuzenlenenId(duyuru.id)
    setDuzenlenenBaslik(duyuru.baslik)
    setDuzenlenenIcerik(duyuru.icerik)
    setDuzenlenenDurum(duyuru.durum)
  }

  const handleIptal = () => {
    setDuzenlenenId(null)
    setDuzenlenenBaslik('')
    setDuzenlenenIcerik('')
    setDuzenlenenDurum('aktif')
  }

  const handleKaydet = (id: string) => {
    if (!duzenlenenBaslik.trim() || !duzenlenenIcerik.trim()) {
      notifications.show({
        title: 'Hata',
        message: 'Başlık ve içerik boş olamaz',
        color: 'red',
      })
      return
    }
    updateMutation.mutate(
      {
        id,
        data: {
          baslik: duzenlenenBaslik,
          icerik: duzenlenenIcerik,
          durum: duzenlenenDurum as Duyuru['durum'],
        },
      },
      { onSuccess: () => handleIptal() },
    )
  }

  const handleYeniEkle = () => {
    if (!yeniBaslik.trim() || !yeniIcerik.trim()) {
      notifications.show({
        title: 'Hata',
        message: 'Başlık ve içerik boş olamaz',
        color: 'red',
      })
      return
    }
    createMutation.mutate(
      {
        baslik: yeniBaslik,
        icerik: yeniIcerik,
        tarih: new Date(),
        durum: 'aktif',
      },
      {
        onSuccess: () => {
          setYeniBaslik('')
          setYeniIcerik('')
          setYeniSatirAcik(false)
        },
      },
    )
  }

  const handleSil = (id: string, baslik: string) => {
    deleteMutation.mutate(id)
    notifications.show({
      title: 'Silindi',
      message: `"${baslik}" başarıyla silindi`,
      color: 'red',
    })
  }

  const getDurumColor = (durum: Duyuru['durum']) => {
    switch (durum) {
      case 'aktif':
        return 'green'
      case 'pasif':
        return 'red'
      case 'taslak':
        return 'yellow'
    }
  }

  const getDurumLabel = (durum: Duyuru['durum']) => {
    switch (durum) {
      case 'aktif':
        return 'Aktif'
      case 'pasif':
        return 'Pasif'
      case 'taslak':
        return 'Taslak'
    }
  }

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Duyurular</Title>
            <Text c="dimmed">
              Sistem duyurularını yönetin — satırlara tıklayarak düzenleyin
            </Text>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            color="green"
            onClick={() => setYeniSatirAcik(!yeniSatirAcik)}
          >
            Yeni Duyuru
          </Button>
        </Group>

        <ScrollArea>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={200}>Başlık</Table.Th>
                <Table.Th>İçerik</Table.Th>
                <Table.Th w={100}>Durum</Table.Th>
                <Table.Th w={120}>Tarih</Table.Th>
                <Table.Th w={80}>İşlem</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {yeniSatirAcik && (
                <Table.Tr bg="green.0">
                  <Table.Td>
                    <TextInput
                      size="xs"
                      placeholder="Başlık"
                      value={yeniBaslik}
                      onChange={(e) => setYeniBaslik(e.currentTarget.value)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <TextInput
                      size="xs"
                      placeholder="İçerik"
                      value={yeniIcerik}
                      onChange={(e) => setYeniIcerik(e.currentTarget.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleYeniEkle()}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Badge color="green" variant="light">
                      Aktif
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date().toLocaleDateString('tr-TR')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        size="sm"
                        color="green"
                        variant="subtle"
                        onClick={handleYeniEkle}
                        loading={createMutation.isPending}
                      >
                        <Check size={14} />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        color="gray"
                        variant="subtle"
                        onClick={() => {
                          setYeniSatirAcik(false)
                          setYeniBaslik('')
                          setYeniIcerik('')
                        }}
                      >
                        <X size={14} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              )}

              {duyurular.map((duyuru) => {
                const duzenleniyor = duzenlenenId === duyuru.id
                return (
                  <Table.Tr key={duyuru.id}>
                    <Table.Td>
                      {duzenleniyor ? (
                        <TextInput
                          size="xs"
                          value={duzenlenenBaslik}
                          onChange={(e) =>
                            setDuzenlenenBaslik(e.currentTarget.value)
                          }
                        />
                      ) : (
                        <Text fw={500}>{duyuru.baslik}</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {duzenleniyor ? (
                        <TextInput
                          size="xs"
                          value={duzenlenenIcerik}
                          onChange={(e) =>
                            setDuzenlenenIcerik(e.currentTarget.value)
                          }
                        />
                      ) : (
                        <Text size="sm" lineClamp={1}>
                          {duyuru.icerik}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {duzenleniyor ? (
                        <NativeSelect
                          size="xs"
                          data={[
                            { value: 'aktif', label: 'Aktif' },
                            { value: 'pasif', label: 'Pasif' },
                            { value: 'taslak', label: 'Taslak' },
                          ]}
                          value={duzenlenenDurum}
                          onChange={(e) =>
                            setDuzenlenenDurum(e.currentTarget.value)
                          }
                        />
                      ) : (
                        <Badge
                          color={getDurumColor(duyuru.durum)}
                          variant="light"
                        >
                          {getDurumLabel(duyuru.durum)}
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {duyuru.tarih.toLocaleDateString('tr-TR')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {duzenleniyor ? (
                        <Group gap="xs">
                          <ActionIcon
                            size="sm"
                            color="green"
                            variant="subtle"
                            onClick={() => handleKaydet(duyuru.id)}
                            loading={updateMutation.isPending}
                          >
                            <Check size={14} />
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            color="gray"
                            variant="subtle"
                            onClick={handleIptal}
                          >
                            <X size={14} />
                          </ActionIcon>
                        </Group>
                      ) : (
                        <Group gap="xs">
                          <ActionIcon
                            size="sm"
                            color="blue"
                            variant="subtle"
                            onClick={() => handleBaslaDuzenle(duyuru)}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </ActionIcon>
                          <ActionIcon
                            size="sm"
                            color="red"
                            variant="subtle"
                            onClick={() => handleSil(duyuru.id, duyuru.baslik)}
                          >
                            <Trash size={14} />
                          </ActionIcon>
                        </Group>
                      )}
                    </Table.Td>
                  </Table.Tr>
                )
              })}

              {duyurular.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <Text ta="center" c="dimmed" py="xl">
                      Henüz duyuru eklenmemiş
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </div>
  )
}
