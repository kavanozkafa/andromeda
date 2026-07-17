import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Button,
  Card,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { AlertCircle, Leaf } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length < 1 ? 'Kullanıcı adı gerekli' : null),
      password: (value) => (value.length < 1 ? 'Şifre gerekli' : null),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    setError('')
    const success = login(values.username, values.password)
    if (success) {
      navigate({ to: '/' })
    } else {
      setError('Geçersiz kullanıcı adı veya şifre')
    }
  }

  return (
    <Container size="xs" py="xl">
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="lg" align="center">
          <div className="flex items-center gap-2">
            <Leaf size={32} className="text-green-600" />
            <Title order={2}>Andromeda</Title>
          </div>

          <Text c="dimmed" ta="center">
            Bankacılık sistemine giriş yapın
          </Text>

          {error && (
            <Alert
              icon={<AlertCircle size={16} />}
              title="Hata"
              color="red"
              w="100%"
            >
              {error}
            </Alert>
          )}

          <form
            onSubmit={form.onSubmit(handleSubmit)}
            style={{ width: '100%' }}
          >
            <Stack gap="md">
              <TextInput
                label="Kullanıcı Adı"
                placeholder="admin"
                {...form.getInputProps('username')}
              />
              <PasswordInput
                label="Şifre"
                placeholder="admin123"
                {...form.getInputProps('password')}
              />
              <Button type="submit" color="green" fullWidth size="md">
                Giriş Yap
              </Button>
            </Stack>
          </form>

          <Text size="xs" c="dimmed" ta="center">
            Demo: admin / admin123
          </Text>
        </Stack>
      </Card>
    </Container>
  )
}
