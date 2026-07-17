import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  Bell,
  Camera,
  Key,
  Mail,
  Phone,
  Save,
  Shield,
  User,
} from 'lucide-react'
import { useAuth } from '#/contexts/AuthContext'

export const Route = createFileRoute('/ayarlar')({
  component: AyarlarPage,
})

function AyarlarPage() {
  const { user } = useAuth()
  const [bildirimler, setBildirimler] = useState({
    emailBildirimleri: true,
    smsBildirimleri: false,
    uygulamaBildirimleri: true,
    islemBildirimleri: true,
    promosyonBildirimleri: false,
  })

  const profilForm = useForm({
    initialValues: {
      adSoyad: user?.username === 'admin' ? 'Admin Kullanıcı' : '',
      email: user?.email || 'admin@andromeda.com',
      telefon: '+90 532 123 4567',
      adres: 'İstanbul, Türkiye',
      notlar: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçersiz e-posta'),
      telefon: (value) =>
        value.length >= 10 ? null : 'Geçerli bir telefon numarası girin',
    },
  })

  const handleProfilKaydet = () => {
    notifications.show({
      title: 'Profil Güncellendi',
      message: 'Profil bilgileriniz başarıyla kaydedildi',
      color: 'green',
    })
  }

  const handleBildirimKaydet = () => {
    notifications.show({
      title: 'Bildirim Ayarları Güncellendi',
      message: 'Bildirim tercihleriniz kaydedildi',
      color: 'green',
    })
  }

  return (
    <div className="demo-page">
      <Stack gap="xl">
        <div>
          <Title order={2}>Ayarlar</Title>
          <Text c="dimmed">Hesap ayarlarınızı ve tercihlerinizi yönetin</Text>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md" mb="lg">
            <ActionIcon variant="light" color="green" size="lg">
              <User size={20} />
            </ActionIcon>
            <div>
              <Title order={4}>Profil Bilgileri</Title>
              <Text size="sm" c="dimmed">
                Kişisel bilgilerinizi güncelleyin
              </Text>
            </div>
          </Group>

          <form onSubmit={profilForm.onSubmit(handleProfilKaydet)}>
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="Ad Soyad"
                  placeholder="Adınız Soyadınız"
                  leftSection={<User size={16} />}
                  {...profilForm.getInputProps('adSoyad')}
                />
                <TextInput
                  label="E-posta"
                  placeholder="ornek@email.com"
                  leftSection={<Mail size={16} />}
                  {...profilForm.getInputProps('email')}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="Telefon"
                  placeholder="+90 5XX XXX XXXX"
                  leftSection={<Phone size={16} />}
                  {...profilForm.getInputProps('telefon')}
                />
                <TextInput
                  label="Adres"
                  placeholder="Adresiniz"
                  {...profilForm.getInputProps('adres')}
                />
              </SimpleGrid>

              <Textarea
                label="Notlar"
                placeholder="Ek notlarınız..."
                rows={3}
                {...profilForm.getInputProps('notlar')}
              />

              <Group justify="flex-end">
                <Button
                  type="submit"
                  color="green"
                  leftSection={<Save size={16} />}
                >
                  Kaydet
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md" mb="lg">
            <ActionIcon variant="light" color="green" size="lg">
              <Bell size={20} />
            </ActionIcon>
            <div>
              <Title order={4}>Bildirim Ayarları</Title>
              <Text size="sm" c="dimmed">
                Bildirim tercihlerinizi yönetin
              </Text>
            </div>
          </Group>

          <Stack gap="md">
            <Paper p="sm" bg="var(--mantine-color-gray-0)" radius="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>E-posta Bildirimleri</Text>
                  <Text size="sm" c="dimmed">
                    Önemli güncellemeler e-posta ile gönderilsin
                  </Text>
                </div>
                <Switch
                  checked={bildirimler.emailBildirimleri}
                  onChange={(event) =>
                    setBildirimler({
                      ...bildirimler,
                      emailBildirimleri: event.currentTarget.checked,
                    })
                  }
                  color="green"
                />
              </Group>
            </Paper>

            <Paper p="sm" bg="var(--mantine-color-gray-0)" radius="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>SMS Bildirimleri</Text>
                  <Text size="sm" c="dimmed">
                    İşlem onayları SMS ile gelsin
                  </Text>
                </div>
                <Switch
                  checked={bildirimler.smsBildirimleri}
                  onChange={(event) =>
                    setBildirimler({
                      ...bildirimler,
                      smsBildirimleri: event.currentTarget.checked,
                    })
                  }
                  color="green"
                />
              </Group>
            </Paper>

            <Paper p="sm" bg="var(--mantine-color-gray-0)" radius="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Uygulama Bildirimleri</Text>
                  <Text size="sm" c="dimmed">
                    Anlık bildirimler uygulamada gösterilsin
                  </Text>
                </div>
                <Switch
                  checked={bildirimler.uygulamaBildirimleri}
                  onChange={(event) =>
                    setBildirimler({
                      ...bildirimler,
                      uygulamaBildirimleri: event.currentTarget.checked,
                    })
                  }
                  color="green"
                />
              </Group>
            </Paper>

            <Divider />

            <Paper p="sm" bg="var(--mantine-color-gray-0)" radius="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>İşlem Bildirimleri</Text>
                  <Text size="sm" c="dimmed">
                    Para yatırma/çekme, havale gibi işlemler
                  </Text>
                </div>
                <Switch
                  checked={bildirimler.islemBildirimleri}
                  onChange={(event) =>
                    setBildirimler({
                      ...bildirimler,
                      islemBildirimleri: event.currentTarget.checked,
                    })
                  }
                  color="green"
                />
              </Group>
            </Paper>

            <Paper p="sm" bg="var(--mantine-color-gray-0)" radius="md">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Promosyon Bildirimleri</Text>
                  <Text size="sm" c="dimmed">
                    Kampanya ve indirim haberleri
                  </Text>
                </div>
                <Switch
                  checked={bildirimler.promosyonBildirimleri}
                  onChange={(event) =>
                    setBildirimler({
                      ...bildirimler,
                      promosyonBildirimleri: event.currentTarget.checked,
                    })
                  }
                  color="green"
                />
              </Group>
            </Paper>

            <Group justify="flex-end">
              <Button
                color="green"
                leftSection={<Save size={16} />}
                onClick={handleBildirimKaydet}
              >
                Bildirimleri Kaydet
              </Button>
            </Group>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md" mb="lg">
            <ActionIcon variant="light" color="green" size="lg">
              <Shield size={20} />
            </ActionIcon>
            <div>
              <Title order={4}>Güvenlik Ayarları</Title>
              <Text size="sm" c="dimmed">
                Hesap güvenliğinizi yönetin
              </Text>
            </div>
          </Group>

          <Stack gap="md">
            <Paper p="md" withBorder radius="md">
              <Group justify="space-between">
                <Group gap="md">
                  <ActionIcon variant="light" color="blue" size="lg">
                    <Key size={20} />
                  </ActionIcon>
                  <div>
                    <Text fw={500}>Şifre Değiştir</Text>
                    <Text size="sm" c="dimmed">
                      Son değişiklik: 30 gün önce
                    </Text>
                  </div>
                </Group>
                <Button variant="light" color="blue" size="sm">
                  Değiştir
                </Button>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group justify="space-between">
                <Group gap="md">
                  <ActionIcon variant="light" color="green" size="lg">
                    <Shield size={20} />
                  </ActionIcon>
                  <div>
                    <Text fw={500}>İki Faktörlü Doğrulama</Text>
                    <Text size="sm" c="dimmed">
                      Hesabınıza ekstra güvenlik katmanı ekleyin
                    </Text>
                  </div>
                </Group>
                <Badge color="green" variant="light">
                  Aktif
                </Badge>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group justify="space-between">
                <Group gap="md">
                  <ActionIcon variant="light" color="orange" size="lg">
                    <Camera size={20} />
                  </ActionIcon>
                  <div>
                    <Text fw={500}>Oturum Geçmişi</Text>
                    <Text size="sm" c="dimmed">
                      Son giriş: Bu gün 14:32 - İstanbul, Türkiye
                    </Text>
                  </div>
                </Group>
                <Button variant="light" color="orange" size="sm">
                  Görüntüle
                </Button>
              </Group>
            </Paper>
          </Stack>
        </Card>
      </Stack>
    </div>
  )
}
