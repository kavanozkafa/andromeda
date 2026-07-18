import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { PageSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import { Badge, Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import {
  Code2,
  Database,
  FileCode,
  Gauge,
  Globe,
  Palette,
  Rocket,
  Shield,
  TestTube,
} from 'lucide-react'

export const Route = createFileRoute('/kisayollar')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: KisayollarPage,
})

const technologies = [
  {
    name: 'React',
    url: 'https://react.dev',
    color: '#61DAFB',
    icon: Code2,
    description: 'UI kütüphanesi',
  },
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
    color: '#3178C6',
    icon: FileCode,
    description: 'Tip güvenliği',
  },
  {
    name: 'Vite',
    url: 'https://vitejs.dev',
    color: '#646CFF',
    icon: Rocket,
    description: 'Build aracı',
  },
  {
    name: 'TanStack',
    url: 'https://tanstack.com',
    color: '#EF4444',
    icon: Database,
    description: 'Router ve Query',
  },
  {
    name: 'Mantine',
    url: 'https://mantine.dev',
    color: '#339AF0',
    icon: Palette,
    description: 'UI bileşenleri',
  },
  {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    color: '#06B6D4',
    icon: Globe,
    description: 'Utility CSS',
  },
  {
    name: 'Vitest',
    url: 'https://vitest.dev',
    color: '#729B1B',
    icon: TestTube,
    description: 'Test framework',
  },
  {
    name: 'ESLint',
    url: 'https://eslint.org',
    color: '#4B32C3',
    icon: Shield,
    description: 'Kod kalitesi',
  },
  {
    name: 'Zod',
    url: 'https://zod.dev',
    color: '#3068B7',
    icon: Gauge,
    description: 'Validasyon şemaları',
  },
]

function KisayollarPage() {
  return (
    <div className="demo-page">
      <Stack gap="xl" align="center">
        <div style={{ textAlign: 'center' }}>
          <Title order={2}>Kısayollar</Title>
          <Text c="dimmed">
            Projede kullanılan teknolojiler ve faydalı bağlantılar
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} w="100%">
          {technologies.map((tech) => {
            const Icon = tech.icon
            return (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{ cursor: 'pointer', height: '100%' }}
                >
                  <Stack
                    gap="md"
                    align="center"
                    style={{ textAlign: 'center' }}
                  >
                    <div
                      style={{
                        backgroundColor: `${tech.color}20`,
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <Icon size={32} color={tech.color} />
                    </div>
                    <div>
                      <Text fw={700} size="lg" c="dark">
                        {tech.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {tech.description}
                      </Text>
                    </div>
                    <Badge variant="light" color="green" size="sm">
                      Teknoloji
                    </Badge>
                  </Stack>
                </Card>
              </a>
            )
          })}
        </SimpleGrid>
      </Stack>
    </div>
  )
}
