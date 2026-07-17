import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ActionIcon,
  Avatar,
  Badge,
  Divider,
  Menu,
  Modal,
  PasswordInput,
  Stack,
  Text,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  Bell,
  CreditCard,
  HelpCircle,
  Leaf,
  LogOut,
  Moon,
  Palette,
  Shield,
  Sun,
  User,
  Menu as MenuIcon,
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import NavigationDrawer from './NavigationDrawer'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const [passwordModalOpened, setPasswordModalOpened] = useState(false)
  const [profileModalOpened, setProfileModalOpened] = useState(false)
  const { user, logout } = useAuth()

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value) =>
        value.length < 1 ? 'Mevcut şifre gerekli' : null,
      newPassword: (value) =>
        value.length < 6 ? 'Yeni şifre en az 6 karakter olmalı' : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Şifreler eşleşmiyor' : null,
    },
  })

  const handleLogin = () => {
    window.location.href = '/login'
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const handlePasswordChange = (values: typeof passwordForm.values) => {
    if (values.currentPassword !== 'admin123') {
      notifications.show({
        title: 'Hata',
        message: 'Mevcut şifre yanlış',
        color: 'red',
      })
      return
    }
    notifications.show({
      title: 'Başarılı',
      message: 'Şifre başarıyla güncellendi',
      color: 'green',
    })
    setPasswordModalOpened(false)
    passwordForm.reset()
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
        <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => setDrawerOpened(true)}
            aria-label="Ana menüyü aç"
          >
            <MenuIcon size={24} />
          </ActionIcon>

          <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
            >
              <Leaf size={16} className="text-green-600" />
              Andromeda
            </Link>
          </h2>

          <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/about"
              className="nav-link"
              activeProps={{ className: 'nav-link is-active' }}
            >
              Hakkında
            </Link>
            <a
              href="https://tanstack.com/start/latest/docs/framework/react/overview"
              className="nav-link"
              target="_blank"
              rel="noreferrer"
            >
              Dokümantasyon
            </a>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />

            <Menu shadow="md" width={260}>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  aria-label="Profil"
                >
                  <Avatar size="sm" radius="xl" color="green">
                    {user ? user.username.charAt(0).toUpperCase() : 'G'}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {user ? (
                  <>
                    <Menu.Label>
                      <div className="flex items-center gap-2">
                        <Avatar size="md" radius="xl" color="green">
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={600}>
                            {user.username}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {user.email}
                          </Text>
                        </div>
                      </div>
                    </Menu.Label>
                    <Divider />
                    <Menu.Item
                      leftSection={<User size={14} />}
                      onClick={() => setProfileModalOpened(true)}
                    >
                      Profilim
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<Shield size={14} />}
                      onClick={() => setPasswordModalOpened(true)}
                    >
                      Şifre Değiştir
                    </Menu.Item>
                    <Menu.Item leftSection={<Bell size={14} />}>
                      Bildirimler
                      <Badge size="xs" color="green" ml="auto">
                        3
                      </Badge>
                    </Menu.Item>
                    <Menu.Item leftSection={<CreditCard size={14} />}>
                      Ödeme Yöntemleri
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label> Görünüm</Menu.Label>
                    <Menu.Item leftSection={<Palette size={14} />}>
                      Tema Değiştir
                    </Menu.Item>
                    <Menu.Item leftSection={<Sun size={14} />}>
                      Açık Tema
                    </Menu.Item>
                    <Menu.Item leftSection={<Moon size={14} />}>
                      Koyu Tema
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item leftSection={<HelpCircle size={14} />}>
                      Yardım
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<LogOut size={14} />}
                      color="red"
                      onClick={handleLogout}
                    >
                      Çıkış Yap
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Label>Henüz giriş yapmadınız</Menu.Label>
                    <Menu.Item
                      leftSection={<User size={14} />}
                      onClick={handleLogin}
                    >
                      Giriş Yap
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </div>
        </nav>
      </header>

      <NavigationDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
      />

      <Modal
        opened={passwordModalOpened}
        onClose={() => setPasswordModalOpened(false)}
        title="Şifre Değiştir"
        centered
      >
        <form onSubmit={passwordForm.onSubmit(handlePasswordChange)}>
          <Stack gap="md">
            <PasswordInput
              label="Mevcut Şifre"
              placeholder="Mevcut şifrenizi girin"
              {...passwordForm.getInputProps('currentPassword')}
            />
            <PasswordInput
              label="Yeni Şifre"
              placeholder="Yeni şifrenizi girin"
              {...passwordForm.getInputProps('newPassword')}
            />
            <PasswordInput
              label="Şifre Tekrar"
              placeholder="Yeni şifrenizi tekrar girin"
              {...passwordForm.getInputProps('confirmPassword')}
            />
            <Stack gap="xs">
              <Text size="xs" c="dimmed">
                • En az 6 karakter
              </Text>
              <Text size="xs" c="dimmed">
                • En az bir harf ve bir rakam içermeli
              </Text>
            </Stack>
            <Stack gap="sm">
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
              >
                Şifreyi Güncelle
              </button>
              <button
                type="button"
                onClick={() => setPasswordModalOpened(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                İptal
              </button>
            </Stack>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={profileModalOpened}
        onClose={() => setProfileModalOpened(false)}
        title="Profil Bilgileri"
        centered
      >
        <Stack gap="md">
          <div className="flex items-center gap-4">
            <Avatar size="xl" radius="xl" color="green">
              {user?.username.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Text fw={600} size="lg">
                {user?.username}
              </Text>
              <Text c="dimmed" size="sm">
                {user?.email}
              </Text>
            </div>
          </div>
          <Divider />
          <Stack gap="sm">
            <div className="flex items-center justify-between">
              <Text size="sm">Kullanıcı Adı:</Text>
              <Text size="sm" fw={500}>
                {user?.username}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="sm">E-posta:</Text>
              <Text size="sm" fw={500}>
                {user?.email}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="sm">Rol:</Text>
              <Badge color="green" variant="light">
                {user?.role}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <Text size="sm">Durum:</Text>
              <Badge color="green" variant="light">
                Aktif
              </Badge>
            </div>
          </Stack>
          <button
            onClick={() => setProfileModalOpened(false)}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Kapat
          </button>
        </Stack>
      </Modal>
    </>
  )
}
