import { memo } from 'react'
import { Card, Group, Skeleton, Stack, SimpleGrid } from '@mantine/core'

export const PageSkeleton = memo(function PageSkeleton() {
  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Skeleton height={28} width={200} />
            <Skeleton height={16} width={300} />
          </Stack>
          <Skeleton height={36} width={120} />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Skeleton height={20} width="60%" />
                  <Skeleton height={24} width={60} circle />
                </Group>
                <Skeleton height={14} width="80%" />
                <Skeleton height={14} width="50%" />
                <Group justify="flex-end">
                  <Skeleton height={28} width={28} circle />
                  <Skeleton height={28} width={28} circle />
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </div>
  )
})

export const TableSkeleton = memo(function TableSkeleton({
  cols = 6,
}: {
  rows?: number
  cols?: number
}) {
  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Skeleton height={28} width={200} />
            <Skeleton height={16} width={300} />
          </Stack>
          <Skeleton height={36} width={180} />
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            {Array.from({ length: 5 }).map((_, i) => (
              <Group key={i} justify="space-between">
                {Array.from({ length: cols }).map((_, j) => (
                  <Skeleton key={j} height={16} width={`${100 / cols}%`} />
                ))}
              </Group>
            ))}
          </Stack>
        </Card>
      </Stack>
    </div>
  )
})

export const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div className="demo-page-wide">
      <Stack gap="xl">
        <Stack gap="xs">
          <Skeleton height={28} width={200} />
          <Skeleton height={16} width={300} />
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Skeleton height={14} width="50%" />
                <Skeleton height={28} width="70%" />
                <Skeleton height={12} width="40%" />
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Skeleton height={300} />
          </Card>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Skeleton height={300} />
          </Card>
        </SimpleGrid>
      </Stack>
    </div>
  )
})
