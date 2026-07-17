import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { Edit, Search, User } from 'lucide-react'
import { makeKullanicilar, type Kullanici } from '#/data/mock-data'

export const Route = createFileRoute('/kullanicilar')({
  component: KullanicilarPage,
})

function KullanicilarPage() {
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>(() =>
    makeKullanicilar(15),
  )
  const [modalOpened, setModalOpened] = useState(false)
  const [editingKullanici, setEditingKullanici] = useState<Kullanici | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm({
    initialValues: {
      adSoyad: '',
      email: '',
      telefon: '',
      hesapNo: '',
      bakiye: 0,
    },
    validate: {
      adSoyad: (value) =>
        value.length < 2 ? 'Ad Soyad en az 2 karakter olmalı' : null,
      email: (value) =>
        !/^\S+@\S+\.\S+$/.test(value) ? 'Geçerli bir email girin' : null,
      telefon: (value) =>
        value.length < 10 ? 'Geçerli bir telefon numarası girin' : null,
      hesapNo: (value) =>
        value.length < 10 ? 'Hesap numarası en az 10 karakter olmalı' : null,
    },
  })

  const filteredKullanicilar = kullanicilar.filter(
    (k) =>
      k.adSoyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.hesapNo.includes(searchTerm),
  )

  const handleOpenEdit = (kullanici: Kullanici) => {
    setEditingKullanici(kullanici)
    form.setValues({
      adSoyad: kullanici.adSoyad,
      email: kullanici.email,
      telefon: kullanici.telefon,
      hesapNo: kullanici.hesapNo,
      bakiye: kullanici.bakiye,
    })
    setModalOpened(true)
  }

  const handleSubmit = (values: typeof form.values) => {
    if (editingKullanici) {
      setKullanicilar((prev) =>
        prev.map((k) =>
          k.id === editingKullanici.id
            ? {
                ...k,
                adSoyad: values.adSoyad,
                email: values.email,
                telefon: values.telefon,
                hesapNo: values.hesapNo,
                bakiye: values.bakiye,
              }
            : k,
        ),
      )
      notifications.show({
        title: 'Güncellendi',
        message: 'Kullanıcı bilgileri başarıyla güncellendi',
        color: 'green',
      })
      setModalOpened(false)
      form.reset()
    }
  }

  return (
    <div className="demo-page">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Kullanıcı İşlemleri</Title>
            <Text c="dimmed">
              Müşteri bilgilerini görüntüleyin ve güncelleyin
            </Text>
          </div>
          <TextInput
            placeholder="Müşteri ara..."
            leftSection={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            w={300}
          />
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {filteredKullanicilar.map((kullanici) => (
            <Card
              key={kullanici.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Group>
                  <User size={24} color="var(--mantine-color-green-6)" />
                  <div>
                    <Title order={4}>{kullanici.adSoyad}</Title>
                    <Text size="sm" c="dimmed">
                      {kullanici.email}
                    </Text>
                  </div>
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={() => handleOpenEdit(kullanici)}
                >
                  <Edit size={16} />
                </ActionIcon>
              </Group>

              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Telefon:
                  </Text>
                  <Text size="sm">{kullanici.telefon}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Hesap No:
                  </Text>
                  <Badge variant="light">{kullanici.hesapNo}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Bakiye:
                  </Text>
                  <Text size="sm" fw={700} c="green">
                    {kullanici.bakiye.toLocaleString('tr-TR')} ₺
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    Kayıt Tarihi:
                  </Text>
                  <Text size="sm">
                    {kullanici.kayitTarihi.toLocaleDateString('tr-TR')}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Kullanıcı Bilgilerini Güncelle"
        centered
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Ad Soyad"
              placeholder="Müşteri adı"
              {...form.getInputProps('adSoyad')}
            />
            <TextInput
              label="E-posta"
              placeholder="ornek@email.com"
              {...form.getInputProps('email')}
            />
            <TextInput
              label="Telefon"
              placeholder="0532 123 45 67"
              {...form.getInputProps('telefon')}
            />
            <TextInput
              label="Hesap Numarası"
              placeholder="1234567890"
              {...form.getInputProps('hesapNo')}
            />
            <NumberInput
              label="Bakiye (₺)"
              placeholder="0"
              min={0}
              decimalSeparator=","
              thousandSeparator="."
              {...form.getInputProps('bakiye')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setModalOpened(false)}>
                İptal
              </Button>
              <Button type="submit" color="green">
                Güncelle
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </div>
  )
}
