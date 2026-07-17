import { Drawer, NavLink, Stack, Text, ThemeIcon } from '@mantine/core'
import { Bell, ExternalLink, FileCode, Leaf, Users } from 'lucide-react'

interface NavigationDrawerProps {
  opened: boolean
  onClose: () => void
}

const technologies = [
  { name: 'React', url: 'https://react.dev', color: '#61DAFB' },
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
    color: '#3178C6',
  },
  { name: 'Vite', url: 'https://vitejs.dev', color: '#646CFF' },
  { name: 'TanStack', url: 'https://tanstack.com', color: '#EF4444' },
  { name: 'Mantine', url: 'https://mantine.dev', color: '#339AF0' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com', color: '#06B6D4' },
  { name: 'Vitest', url: 'https://vitest.dev', color: '#729B1B' },
  { name: 'ESLint', url: 'https://eslint.org', color: '#4B32C3' },
  { name: 'Zod', url: 'https://zod.dev', color: '#3068B7' },
]

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
      title={
        <div className="flex items-center gap-2">
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

      <Text size="xs" fw={700} c="dimmed" mt="xl" mb="xs">
        KULLANILAN TEKNOLOJİLER
      </Text>
      <Stack gap={4}>
        {technologies.map((tech) => (
          <a
            key={tech.name}
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm no-underline transition hover:bg-gray-100"
            style={{ color: tech.color }}
          >
            <span
              className="font-medium"
              style={{ color: 'var(--mantine-color-gray-7)' }}
            >
              {tech.name}
            </span>
            <ExternalLink size={12} className="text-gray-400" />
          </a>
        ))}
      </Stack>

      <Text size="xs" c="dimmed" ta="center" mt="xl">
        Andromeda Bankacılık Sistemi v1.0
      </Text>
    </Drawer>
  )
}
