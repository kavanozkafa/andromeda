import { useNavigate } from '@tanstack/react-router'
import { Drawer, NavLink, Stack, Text, ThemeIcon } from '@mantine/core'
import {
  Bell,
  CreditCard,
  FileCode,
  FileText,
  History,
  LayoutDashboard,
  Leaf,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  UserCheck,
  Sliders,
  MessageSquare,
} from 'lucide-react'

interface NavigationDrawerProps {
  opened: boolean
  onClose: () => void
}

export default function NavigationDrawer({
  opened,
  onClose,
}: NavigationDrawerProps) {
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate({ to: path })
    onClose()
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center justify-center gap-2">
          <Leaf size={20} className="text-green-600" />
          <span>Ana Menü</span>
        </div>
      }
      position="left"
      size="md"
      styles={{
        title: {
          fontWeight: 700,
          fontSize: '1.2rem',
          justifyContent: 'center',
          width: '100%',
        },
      }}
    >
      <Stack gap="xs" align="center">
        <NavLink
          label="Dashboard"
          description="Genel durum ve analitikler"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <LayoutDashboard size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/dashboard')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Dijital Bankacılık"
          description="Giriş denemeleri ve hata analizi"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <ShieldCheck size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/dijital-bankacilik-dashboard')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="İşlemler"
          description="İşlem geçmişi ve filtreleme"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <History size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/islemler')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
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
          w="100%"
          style={{ justifyContent: 'center' }}
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
          w="100%"
          style={{ justifyContent: 'center' }}
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
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Kartlarım"
          description="Kredi ve banka kartları yönetimi"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <CreditCard size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/kartlar')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Telefon Bilgileri"
          description="Müşteri telefon modelleri ve marka dağılımı"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <Smartphone size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/musteri-telefon-bilgileri')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Aktif Kullanıcılar"
          description="Anlık aktif kullanıcı oturumları"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <UserCheck size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/aktif-kullanicilar')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Sistem Parametreleri"
          description="Uygulama limitleri ve genel ayarlar"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <Sliders size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/sistem-parametreleri')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Sistem Mesajları ve Etiketler"
          description="Hata kodları ve arayüz etiketleri"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <MessageSquare size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/mesajlar-ve-etiketler')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Ayarlar"
          description="Hesap ve bildirim ayarları"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <Settings size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/ayarlar')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Raporlar"
          description="Raporları oluşturun ve dışa aktarın"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <FileText size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/raporlar')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
        <NavLink
          label="Kısayollar"
          description="Kullanılan teknolojiler ve bağlantılar"
          leftSection={
            <ThemeIcon variant="light" color="green" size="lg">
              <Sparkles size={20} />
            </ThemeIcon>
          }
          onClick={() => handleNavigate('/kisayollar')}
          variant="subtle"
          w="100%"
          style={{ justifyContent: 'center' }}
        />
      </Stack>

      <Text size="xs" c="dimmed" ta="center" mt="xl">
        Andromeda Bankacılık Sistemi v1.0
      </Text>
    </Drawer>
  )
}
