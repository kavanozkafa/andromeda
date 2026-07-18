import { useCallback, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { protectedRouteOptions } from '#/lib/auth-guard'
import { PageSkeleton } from '#/components/Skeleton'
import { RouteErrorComponent } from '#/components/ErrorBoundary'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Code,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  ArrowRightLeft,
  Copy,
  FileDown,
  FileUp,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react'

export const Route = createFileRoute('/araclar')({
  ...protectedRouteOptions,
  pendingComponent: PageSkeleton,
  errorComponent: RouteErrorComponent,
  component: AraclarPage,
})

interface DiffEntry {
  key: string
  type: 'added' | 'removed' | 'modified' | 'unchanged'
  oldValue?: unknown
  newValue?: unknown
}

function parseJsonSafe(text: string): { data: unknown; error: string | null } {
  try {
    const data = JSON.parse(text)
    return { data, error: null }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      value !== null
    ) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, fullKey))
    } else {
      result[fullKey] = value
    }
  }
  return result
}

function compareJson(
  left: unknown,
  right: unknown,
): DiffEntry[] {
  const leftObj =
    left && typeof left === 'object' && !Array.isArray(left)
      ? (left as Record<string, unknown>)
      : { value: left }
  const rightObj =
    right && typeof right === 'object' && !Array.isArray(right)
      ? (right as Record<string, unknown>)
      : { value: right }

  const flatLeft = flattenObject(leftObj)
  const flatRight = flattenObject(rightObj)

  const allKeys = new Set([...Object.keys(flatLeft), ...Object.keys(flatRight)])
  const entries: DiffEntry[] = []

  for (const key of Array.from(allKeys).sort()) {
    const inLeft = key in flatLeft
    const inRight = key in flatRight

    if (inLeft && !inRight) {
      entries.push({ key, type: 'removed', oldValue: flatLeft[key] })
    } else if (!inLeft && inRight) {
      entries.push({ key, type: 'added', newValue: flatRight[key] })
    } else if (inLeft && inRight) {
      const leftVal = JSON.stringify(flatLeft[key])
      const rightVal = JSON.stringify(flatRight[key])
      if (leftVal === rightVal) {
        entries.push({ key, type: 'unchanged', oldValue: flatLeft[key], newValue: flatRight[key] })
      } else {
        entries.push({
          key,
          type: 'modified',
          oldValue: flatLeft[key],
          newValue: flatRight[key],
        })
      }
    }
  }

  return entries
}

function formatValue(val: unknown): string {
  if (val === undefined) return '—'
  if (val === null) return 'null'
  if (typeof val === 'string') return val
  return JSON.stringify(val, null, 2)
}

const sampleLeft = `{
  "ad": "Ahmet",
  "soyad": "Yılmaz",
  "yas": 30,
  "adres": {
    "sehir": "İstanbul",
    "ilce": "Kadıköy"
  },
  "telefon": "0532 123 4567"
}`

const sampleRight = `{
  "ad": "Ahmet",
  "soyad": "Demir",
  "yas": 31,
  "adres": {
    "sehir": "İstanbul",
    "ilce": "Beşiktaş"
  },
  "eposta": "ahmet@email.com"
}`

function AraclarPage() {
  const [leftJson, setLeftJson] = useState('')
  const [rightJson, setRightJson] = useState('')
  const [diffs, setDiffs] = useState<DiffEntry[] | null>(null)
  const [showUnchanged, setShowUnchanged] = useState(false)
  const [leftError, setLeftError] = useState<string | null>(null)
  const [rightError, setRightError] = useState<string | null>(null)

  const handleCompare = useCallback(() => {
    setLeftError(null)
    setRightError(null)

    if (!leftJson.trim()) {
      setLeftError('JSON verisi girin')
      return
    }
    if (!rightJson.trim()) {
      setRightError('JSON verisi girin')
      return
    }

    const leftParsed = parseJsonSafe(leftJson)
    const rightParsed = parseJsonSafe(rightJson)

    if (leftParsed.error) {
      setLeftError(leftParsed.error)
      return
    }
    if (rightParsed.error) {
      setRightError(rightParsed.error)
      return
    }

    const result = compareJson(leftParsed.data, rightParsed.data)
    setDiffs(result)

    const added = result.filter((d) => d.type === 'added').length
    const removed = result.filter((d) => d.type === 'removed').length
    const modified = result.filter((d) => d.type === 'modified').length

    notifications.show({
      title: 'Karşılaştırma Tamamlandı',
      message: `${added} ekleme, ${removed} silme, ${modified} değişiklik bulundu.`,
      color: 'green',
    })
  }, [leftJson, rightJson])

  const handleReset = useCallback(() => {
    setLeftJson('')
    setRightJson('')
    setDiffs(null)
    setLeftError(null)
    setRightError(null)
  }, [])

  const handleLoadSample = useCallback(() => {
    setLeftJson(sampleLeft)
    setRightJson(sampleRight)
    setDiffs(null)
    setLeftError(null)
    setRightError(null)
  }, [])

  const handleCopyResult = useCallback(() => {
    if (!diffs) return
    const result = diffs
      .filter((d) => d.type !== 'unchanged')
      .map((d) => {
        if (d.type === 'added') return `+ ${d.key}: ${formatValue(d.newValue)}`
        if (d.type === 'removed') return `- ${d.key}: ${formatValue(d.oldValue)}`
        return `~ ${d.key}: ${formatValue(d.oldValue)} → ${formatValue(d.newValue)}`
      })
      .join('\n')
    navigator.clipboard.writeText(result)
    notifications.show({
      title: 'Kopyalandı',
      message: 'Farklar panoya kopyalandı.',
      color: 'green',
    })
  }, [diffs])

  const handleExportJson = useCallback(() => {
    if (!diffs) return
    const exportData = diffs
      .filter((d) => d.type !== 'unchanged')
      .map((d) => ({
        key: d.key,
        type: d.type,
        oldValue: d.oldValue,
        newValue: d.newValue,
      }))
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'json-diff-result.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [diffs])

  const stats = useMemo(() => {
    if (!diffs) return null
    const added = diffs.filter((d) => d.type === 'added').length
    const removed = diffs.filter((d) => d.type === 'removed').length
    const modified = diffs.filter((d) => d.type === 'modified').length
    const unchanged = diffs.filter((d) => d.type === 'unchanged').length
    return { added, removed, modified, unchanged, total: diffs.length }
  }, [diffs])

  const filteredDiffs = useMemo(() => {
    if (!diffs) return []
    if (showUnchanged) return diffs
    return diffs.filter((d) => d.type !== 'unchanged')
  }, [diffs, showUnchanged])

  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <div>
          <Group gap="md" align="center">
            <Title order={2}>Araçlar</Title>
          </Group>
          <Text c="dimmed">
            JSON verilerini karşılaştırın ve farkları görüntüleyin
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={600} size="sm">
                Sol JSON
              </Text>
              <Tooltip label="Örnek veri yükle">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={handleLoadSample}
                  size="sm"
                >
                  <FileUp size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Textarea
              placeholder='{"anahtar": "değer"}'
              value={leftJson}
              onChange={(e) => setLeftJson(e.currentTarget.value)}
              error={leftError}
              autosize
              minRows={12}
              maxRows={20}
              styles={{ input: { fontFamily: 'monospace' } }}
              size="sm"
            />
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={600} size="sm">
                Sağ JSON
              </Text>
              <Tooltip label="Örnek veri yükle">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={handleLoadSample}
                  size="sm"
                >
                  <FileUp size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Textarea
              placeholder='{"anahtar": "değer"}'
              value={rightJson}
              onChange={(e) => setRightJson(e.currentTarget.value)}
              error={rightError}
              autosize
              minRows={12}
              maxRows={20}
              styles={{ input: { fontFamily: 'monospace' } }}
              size="sm"
            />
          </Stack>
        </SimpleGrid>

        <Group justify="center" gap="md">
          <Button
            leftSection={<ArrowRightLeft size={18} />}
            onClick={handleCompare}
            size="md"
            radius="md"
          >
            Karşılaştır
          </Button>
          <Button
            leftSection={<RotateCcw size={16} />}
            variant="light"
            color="gray"
            onClick={handleReset}
            size="md"
            radius="md"
          >
            Sıfırla
          </Button>
        </Group>

        {stats && (
          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            <Card padding="md" radius="md" withBorder>
              <Text size="xs" c="dimmed">
                Ekleme
              </Text>
              <Group gap="xs" mt={4}>
                <Badge color="green" variant="light" size="lg">
                  <Plus size={12} /> {stats.added}
                </Badge>
              </Group>
            </Card>
            <Card padding="md" radius="md" withBorder>
              <Text size="xs" c="dimmed">
                Silme
              </Text>
              <Group gap="xs" mt={4}>
                <Badge color="red" variant="light" size="lg">
                  <Minus size={12} /> {stats.removed}
                </Badge>
              </Group>
            </Card>
            <Card padding="md" radius="md" withBorder>
              <Text size="xs" c="dimmed">
                Değişiklik
              </Text>
              <Group gap="xs" mt={4}>
                <Badge color="yellow" variant="light" size="lg">
                  ~ {stats.modified}
                </Badge>
              </Group>
            </Card>
            <Card padding="md" radius="md" withBorder>
              <Text size="xs" c="dimmed">
                Değişmeyen
              </Text>
              <Group gap="xs" mt={4}>
                <Badge color="gray" variant="light" size="lg">
                  = {stats.unchanged}
                </Badge>
              </Group>
            </Card>
          </SimpleGrid>
        )}

        {diffs && (
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Group gap="sm">
                <Text fw={600}>Sonuçlar</Text>
                <Button
                  size="compact-xs"
                  variant={showUnchanged ? 'filled' : 'subtle'}
                  color="gray"
                  onClick={() => setShowUnchanged(!showUnchanged)}
                >
                  Değişmeyenleri {showUnchanged ? 'Gizle' : 'Göster'}
                </Button>
              </Group>
              <Group gap="xs">
                <Tooltip label="Sonucu kopyala">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={handleCopyResult}
                  >
                    <Copy size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="JSON olarak indir">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={handleExportJson}
                  >
                    <FileDown size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <Stack gap="xs">
              {filteredDiffs.length === 0 && (
                <Text c="dimmed" ta="center" py="xl">
                  Fark bulunamadı. İki JSON birbiriyle aynı.
                </Text>
              )}
              {filteredDiffs.map((diff) => (
                <Paper
                  key={diff.key}
                  p="sm"
                  radius="sm"
                  style={{
                    borderLeft: `4px solid`,
                    borderColor:
                      diff.type === 'added'
                        ? 'var(--mantine-color-green-5)'
                        : diff.type === 'removed'
                          ? 'var(--mantine-color-red-5)'
                          : diff.type === 'modified'
                            ? 'var(--mantine-color-yellow-5)'
                            : 'var(--mantine-color-gray-4)',
                    backgroundColor:
                      diff.type === 'added'
                        ? 'var(--mantine-color-green-light)'
                        : diff.type === 'removed'
                          ? 'var(--mantine-color-red-light)'
                          : diff.type === 'modified'
                            ? 'var(--mantine-color-yellow-light)'
                            : 'transparent',
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Group gap="xs">
                        <Badge
                          color={
                            diff.type === 'added'
                              ? 'green'
                              : diff.type === 'removed'
                                ? 'red'
                                : diff.type === 'modified'
                                  ? 'yellow'
                                  : 'gray'
                          }
                          variant="dot"
                          size="sm"
                        >
                          {diff.type === 'added'
                            ? 'Yeni'
                            : diff.type === 'removed'
                              ? 'Silindi'
                              : diff.type === 'modified'
                                ? 'Değişti'
                                : 'Aynı'}
                        </Badge>
                        <Code fw={700} fz="sm">
                          {diff.key}
                        </Code>
                      </Group>

                      {diff.type === 'modified' && (
                        <Group gap="xs" ml="md">
                          <Stack gap={2}>
                            <Text size="xs" c="dimmed">
                              Eski:
                            </Text>
                            <Code
                              style={{
                                textDecoration: 'line-through',
                                opacity: 0.7,
                              }}
                            >
                              {formatValue(diff.oldValue)}
                            </Code>
                          </Stack>
                          <Text size="xs" c="dimmed" mt="lg">
                            →
                          </Text>
                          <Stack gap={2}>
                            <Text size="xs" c="dimmed">
                              Yeni:
                            </Text>
                            <Code color="green">
                              {formatValue(diff.newValue)}
                            </Code>
                          </Stack>
                        </Group>
                      )}

                      {diff.type === 'added' && (
                        <Code ml="md" color="green">
                          {formatValue(diff.newValue)}
                        </Code>
                      )}

                      {diff.type === 'removed' && (
                        <Code ml="md" color="red" style={{ textDecoration: 'line-through' }}>
                          {formatValue(diff.oldValue)}
                        </Code>
                      )}

                      {diff.type === 'unchanged' && (
                        <Code ml="md" c="dimmed">
                          {formatValue(diff.oldValue)}
                        </Code>
                      )}
                    </Stack>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Paper>
        )}
      </Stack>
    </div>
  )
}
