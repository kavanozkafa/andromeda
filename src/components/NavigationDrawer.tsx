import { Drawer, NavLink, Stack, Text, ThemeIcon } from '@mantine/core'
import { Bell, Users, FileCode } from 'lucide-react'

interface NavigationDrawerProps {
  opened: boolean
  onClose: () => void
}

export default function NavigationDrawer({
  opened,
  onClose,
}: NavigationDrawerProps) {
  const handleNavigate = (path: string) => {
    window.location.href = path
    onClose()
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Ana Menü"
      position="left"
      size="md"
      styles={{
        title: {
          fontWeight: 700,
          fontSize: '1.2rem',
        },
      }}
    >
      <Stack gap="xs">
        <NavLink
          label="Duyurular"
          description="Duyuru listesi, ekleme, silme, güncelleme"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <Bell size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/duyurular')}
          variant="subtle"
        />
        <NavLink
          label="Kullanıcı İşlemleri"
          description="Müşteri bilgileri ve güncelleme"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <Users size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/kullanicilar')}
          variant="subtle"
        />
        <NavLink
          label="Dijital Bankacılık Logları"
          description="Müşteri logları zamana göre sıralanmış"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <FileCode size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/bankacilik-loglari')}
          variant="subtle"
        />
      </Stack>

      <Text size="xs" c="dimmed" ta="center" mt="xl">
        Andromeda Banking System v1.0
      </Text>
    </Drawer>
  )
}
