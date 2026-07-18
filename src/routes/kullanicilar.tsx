import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { PageSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Key, Search, Shield, ShieldCheck, ShieldX, User } from 'lucide-react'
import { useKullanicilar, useKullaniciUpdate } from '#/hooks/use-banking'
import type { Kullanici } from '#/data/mock-data'

export const Route = createFileRoute('/kullanicilar')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: KullanicilarPage,
})

function KullanicilarPage() {
  const { data: kullanicilar = [] } = useKullanicilar()
  const updateMutation = useKullaniciUpdate()
  const [searchTerm, setSearchTerm] = useState('')
  const [seciliKullanici, setSeciliKullanici] = useState<Kullanici | null>(null)
  const [aramaYapildi, setAramaYapildi] = useState(false)

  const handleSearch = () => {
    setAramaYapildi(true)
    const bulunan = kullanicilar.find((k) => k.hesapNo === searchTerm.trim())
    setSeciliKullanici(bulunan || null)
    if (!bulunan && searchTerm.trim()) {
      notifications.show({
        title: 'Bulunamadı',
        message: `"${searchTerm}" hesap numarasıyla eşleşen müşteri bulunamadı`,
        color: 'yellow',
      })
    }
  }

  const handleToggle2FA = (kullanici: Kullanici) => {
    updateMutation.mutate(
      {
        id: kullanici.id,
        data: { ikiAdimliDogrulama: !kullanici.ikiAdimliDogrulama },
      },
      {
        onSuccess: (updated) => {
          setSeciliKullanici(updated)
        },
      },
    )
  }

  const handleSifreSifirla = (kullanici: Kullanici) => {
    updateMutation.mutate(
      { id: kullanici.id, data: { sifreGuncellemeTarihi: new Date() } },
      {
        onSuccess: (updated) => {
          setSeciliKullanici(updated)
          notifications.show({
            title: 'Şifre Sıfırlandı',
            message: `${kullanici.adSoyad} kullanıcısının şifresi sıfırlandı`,
            color: 'green',
          })
        },
      },
    )
  }

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Kullanıcı İşlemleri</Title>
            <Text c="dimmed">
              Müşteri bilgilerini görüntüleyin ve güncelleyin
            </Text>
          </div>
          <Group>
            <TextInput
              placeholder="Müşteri numarası girin..."
              leftSection={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              w={300}
            />
            <Button
              color="green"
              leftSection={<Search size={16} />}
              onClick={handleSearch}
            >
              Ara
            </Button>
          </Group>
        </Group>

        {aramaYapildi && seciliKullanici ? (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start" mb="lg">
              <Group>
                <User size={32} color="var(--mantine-color-green-6)" />
                <div>
                  <Title order={3}>{seciliKullanici.adSoyad}</Title>
                  <Text size="sm" c="dimmed">
                    {seciliKullanici.email}
                  </Text>
                </div>
              </Group>
              <Button
                variant="light"
                color="gray"
                size="sm"
                onClick={() => {
                  setAramaYapildi(false)
                  setSeciliKullanici(null)
                  setSearchTerm('')
                }}
              >
                Tümünü Göster
              </Button>
            </Group>

            <Tabs defaultValue="bilgiler" color="green">
              <Tabs.List>
                <Tabs.Tab value="bilgiler" leftSection={<User size={16} />}>
                  Kullanıcı Bilgileri
                </Tabs.Tab>
                <Tabs.Tab
                  value="guvenlik-bilgi"
                  leftSection={<Shield size={16} />}
                >
                  Güvenlik Bilgileri
                </Tabs.Tab>
                <Tabs.Tab value="guvenlik-ayar" leftSection={<Key size={16} />}>
                  Güvenlik Ayarları
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="bilgiler" pt="md">
                <Table withTableBorder>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td fw={500} w={200}>
                        Ad Soyad
                      </Table.Td>
                      <Table.Td>{seciliKullanici.adSoyad}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>E-posta</Table.Td>
                      <Table.Td>{seciliKullanici.email}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>Telefon</Table.Td>
                      <Table.Td>{seciliKullanici.telefon}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>Hesap No</Table.Td>
                      <Table.Td>
                        <Badge variant="light" color="green">
                          {seciliKullanici.hesapNo}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>Bakiye</Table.Td>
                      <Table.Td fw={700} c="green">
                        {seciliKullanici.bakiye.toLocaleString('tr-TR')} ₺
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>Kayıt Tarihi</Table.Td>
                      <Table.Td>
                        {seciliKullanici.kayitTarihi.toLocaleDateString(
                          'tr-TR',
                        )}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Tabs.Panel>

              <Tabs.Panel value="guvenlik-bilgi" pt="md">
                <Table withTableBorder>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td fw={500} w={200}>
                        Son Giriş Tarihi
                      </Table.Td>
                      <Table.Td>
                        {seciliKullanici.sonGirisTarihi.toLocaleDateString(
                          'tr-TR',
                        )}{' '}
                        {seciliKullanici.sonGirisTarihi.toLocaleTimeString(
                          'tr-TR',
                        )}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>Son Giriş IP</Table.Td>
                      <Table.Td ff="monospace">
                        {seciliKullanici.sonGirisIp}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>Son Giriş Cihazı</Table.Td>
                      <Table.Td>{seciliKullanici.sonGirisCihaz}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>İki Adımlı Doğrulama</Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            seciliKullanici.ikiAdimliDogrulama ? 'green' : 'red'
                          }
                          variant="light"
                        >
                          {seciliKullanici.ikiAdimliDogrulama
                            ? 'Aktif'
                            : 'Pasif'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td fw={500}>Son Şifre Güncelleme</Table.Td>
                      <Table.Td>
                        {seciliKullanici.sifreGuncellemeTarihi.toLocaleDateString(
                          'tr-TR',
                        )}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Tabs.Panel>

              <Tabs.Panel value="guvenlik-ayar" pt="md">
                <Stack gap="lg" maw={500}>
                  <Card p="md" radius="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>İki Adımlı Doğrulama (2FA)</Text>
                        <Text size="sm" c="dimmed">
                          Giriş işlemlerinde ek güvenlik katmanı ekler
                        </Text>
                      </div>
                      <Switch
                        checked={seciliKullanici.ikiAdimliDogrulama}
                        color="green"
                        onChange={() => handleToggle2FA(seciliKullanici)}
                        disabled={updateMutation.isPending}
                      />
                    </Group>
                  </Card>

                  <Card p="md" radius="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Şifre Sıfırlama</Text>
                        <Text size="sm" c="dimmed">
                          Kullanıcıya sıfırlama bağlantısı e-posta ile
                          gönderilecek
                        </Text>
                      </div>
                      <Button
                        variant="light"
                        color="orange"
                        size="sm"
                        leftSection={<Key size={14} />}
                        onClick={() => handleSifreSifirla(seciliKullanici)}
                        loading={updateMutation.isPending}
                      >
                        Şifre Sıfırla
                      </Button>
                    </Group>
                  </Card>

                  <Card p="md" radius="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Hesap Dondurma</Text>
                        <Text size="sm" c="dimmed">
                          Hesabı geçici olarak askıya alır
                        </Text>
                      </div>
                      <Button
                        variant="light"
                        color="red"
                        size="sm"
                        leftSection={<ShieldX size={14} />}
                        onClick={() => {
                          notifications.show({
                            title: 'İşlem Başarılı',
                            message: `${seciliKullanici.adSoyad} hesabı donduruldu`,
                            color: 'red',
                          })
                        }}
                      >
                        Hesabı Dondur
                      </Button>
                    </Group>
                  </Card>

                  <Card p="md" radius="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Oturum Kapatma</Text>
                        <Text size="sm" c="dimmed">
                          Kullanıcının tüm aktif oturumlarını sonlandırır
                        </Text>
                      </div>
                      <Button
                        variant="light"
                        color="yellow"
                        size="sm"
                        leftSection={<ShieldCheck size={14} />}
                        onClick={() => {
                          notifications.show({
                            title: 'Oturumlar Kapatıldı',
                            message: `${seciliKullanici.adSoyad} kullanıcısının tüm oturumları kapatıldı`,
                            color: 'green',
                          })
                        }}
                      >
                        Oturumları Kapat
                      </Button>
                    </Group>
                  </Card>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
            {kullanicilar.map((kullanici) => (
              <Card
                key={kullanici.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSearchTerm(kullanici.hesapNo)
                  setAramaYapildi(true)
                  setSeciliKullanici(kullanici)
                }}
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
        )}
      </Stack>
    </div>
  )
}
