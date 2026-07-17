import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { Edit, Plus, Trash } from 'lucide-react'
import { makeDuyurular } from '#/data/mock-data'
import type { Duyuru } from '#/data/mock-data'

export const Route = createFileRoute('/duyurular')({
  component: DuyurularPage,
})

function DuyurularPage() {
  const [duyurular, setDuyurular] = useState<Duyuru[]>(() => makeDuyurular(8))
  const [modalOpened, setModalOpened] = useState(false)
  const [editingDuyuru, setEditingDuyuru] = useState<Duyuru | null>(null)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [deletingDuyuru, setDeletingDuyuru] = useState<Duyuru | null>(null)

  const form = useForm({
    initialValues: {
      baslik: '',
      icerik: '',
      durum: 'aktif' as Duyuru['durum'],
    },
    validate: {
      baslik: (value) =>
        value.length < 3 ? 'Başlık en az 3 karakter olmalı' : null,
      icerik: (value) =>
        value.length < 10 ? 'İçerik en az 10 karakter olmalı' : null,
    },
  })

  const handleOpenCreate = () => {
    setEditingDuyuru(null)
    form.reset()
    setModalOpened(true)
  }

  const handleOpenEdit = (duyuru: Duyuru) => {
    setEditingDuyuru(duyuru)
    form.setValues({
      baslik: duyuru.baslik,
      icerik: duyuru.icerik,
      durum: duyuru.durum,
    })
    setModalOpened(true)
  }

  const handleSubmit = (values: typeof form.values) => {
    if (editingDuyuru) {
      setDuyurular((prev) =>
        prev.map((d) =>
          d.id === editingDuyuru.id
            ? {
                ...d,
                baslik: values.baslik,
                icerik: values.icerik,
                durum: values.durum,
              }
            : d,
        ),
      )
      notifications.show({
        title: 'Güncellendi',
        message: 'Duyuru başarıyla güncellendi',
        color: 'green',
      })
    } else {
      const newDuyuru: Duyuru = {
        id: crypto.randomUUID(),
        baslik: values.baslik,
        icerik: values.icerik,
        tarih: new Date(),
        durum: values.durum,
      }
      setDuyurular((prev) => [newDuyuru, ...prev])
      notifications.show({
        title: 'Eklendi',
        message: 'Yeni duyuru başarıyla eklendi',
        color: 'green',
      })
    }
    setModalOpened(false)
    form.reset()
  }

  const handleDelete = () => {
    if (deletingDuyuru) {
      setDuyurular((prev) => prev.filter((d) => d.id !== deletingDuyuru.id))
      notifications.show({
        title: 'Silindi',
        message: 'Duyuru başarıyla silindi',
        color: 'red',
      })
      setDeleteModalOpened(false)
      setDeletingDuyuru(null)
    }
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

  return (
    <div className="demo-page">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Duyurular</Title>
            <Text c="dimmed">Sistem duyurularını yönetin</Text>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            onClick={handleOpenCreate}
            color="green"
          >
            Yeni Duyuru
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {duyurular.map((duyuru) => (
            <Card
              key={duyuru.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Title order={4}>{duyuru.baslik}</Title>
                <Badge color={getDurumColor(duyuru.durum)} variant="light">
                  {duyuru.durum}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                {duyuru.icerik}
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                {duyuru.tarih.toLocaleDateString('tr-TR')}
              </Text>
              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={() => handleOpenEdit(duyuru)}
                >
                  <Edit size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    setDeletingDuyuru(duyuru)
                    setDeleteModalOpened(true)
                  }}
                >
                  <Trash size={16} />
                </ActionIcon>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingDuyuru ? 'Duyuruyu Güncelle' : 'Yeni Duyuru Ekle'}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Başlık"
              placeholder="Duyuru başlığı"
              {...form.getInputProps('baslik')}
            />
            <Textarea
              label="İçerik"
              placeholder="Duyuru içeriği"
              minRows={4}
              {...form.getInputProps('icerik')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setModalOpened(false)}>
                İptal
              </Button>
              <Button type="submit" color="green">
                {editingDuyuru ? 'Güncelle' : 'Ekle'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Duyuruyu Sil"
        centered
      >
        <Stack gap="md">
          <Text>
            <strong>{deletingDuyuru?.baslik}</strong> başlıklı duyuruyu silmek
            istediğinizden emin misiniz?
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => setDeleteModalOpened(false)}
            >
              İptal
            </Button>
            <Button color="red" onClick={handleDelete}>
              Sil
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  )
}
