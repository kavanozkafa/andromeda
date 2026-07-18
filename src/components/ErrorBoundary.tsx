import { Button, Group, Stack, Text, Title, Paper } from '@mantine/core'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useNavigate, useRouter } from '@tanstack/react-router'

export function RouteErrorComponent({ error }: { error: Error }) {
  const navigate = useNavigate()
  const router = useRouter()

  return (
    <div className="demo-page">
      <Stack gap="xl" align="center" py="xl">
        <Paper
          p="xl"
          radius="lg"
          withBorder
          style={{
            backgroundColor: 'var(--mantine-color-red-0)',
            maxWidth: 500,
            width: '100%',
          }}
        >
          <Stack gap="md" align="center">
            <AlertTriangle size={48} color="var(--mantine-color-red-6)" />
            <Title order={3} ta="center">
              Bir Hata Oluştu
            </Title>
            <Text c="dimmed" ta="center" size="sm">
              {error.message || 'Beklenmeyen bir hata meydana geldi.'}
            </Text>
            <Group mt="md">
              <Button
                variant="light"
                color="gray"
                leftSection={<ArrowLeft size={16} />}
                onClick={() => navigate({ to: '/' })}
              >
                Ana Sayfaya Dön
              </Button>
              <Button
                color="green"
                leftSection={<RefreshCw size={16} />}
                onClick={() => router.invalidate()}
              >
                Tekrar Dene
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </div>
  )
}

export function RootErrorComponent({ error }: { error: Error }) {
  return (
    <html lang="tr">
      <body>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <Paper
            p="xl"
            radius="lg"
            withBorder
            style={{ maxWidth: 500, width: '100%' }}
          >
            <Stack gap="md" align="center">
              <AlertTriangle size={48} color="#e03131" />
              <Title order={3} ta="center">
                Uygulama Hatası
              </Title>
              <Text c="dimmed" ta="center" size="sm">
                {error.message ||
                  'Uygulama yüklenirken kritik bir hata oluştu.'}
              </Text>
              <Button
                color="green"
                onClick={() => window.location.reload()}
                leftSection={<RefreshCw size={16} />}
              >
                Sayfayı Yenile
              </Button>
            </Stack>
          </Paper>
        </div>
      </body>
    </html>
  )
}
