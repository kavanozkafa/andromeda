import { memo, useRef } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Table as MantineTable, Text } from '@mantine/core'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  emptyMessage?: string
}

function DataTableInner<T>({
  data,
  columns,
  emptyMessage = 'Kayıt bulunamadı',
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 10,
  })

  const useVirtual = rows.length > 50

  if (useVirtual) {
    return (
      <div
        ref={tableContainerRef}
        style={{ maxHeight: '500px', overflow: 'auto' }}
      >
        <MantineTable striped highlightOnHover withTableBorder>
          <MantineTable.Thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <MantineTable.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <MantineTable.Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </MantineTable.Th>
                ))}
              </MantineTable.Tr>
            ))}
          </MantineTable.Thead>
          <MantineTable.Tbody>
            <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              <td colSpan={columns.length} style={{ padding: 0 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index]
                    return (
                      <div
                        key={row.id}
                        data-index={virtualRow.index}
                        ref={rowVirtualizer.measureElement}
                        style={{
                          position: 'absolute',
                          top: 0,
                          transform: `translateY(${virtualRow.start}px)`,
                          width: '100%',
                        }}
                      >
                        <MantineTable.Tr>
                          {row.getVisibleCells().map((cell) => (
                            <MantineTable.Td key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </MantineTable.Td>
                          ))}
                        </MantineTable.Tr>
                      </div>
                    )
                  })}
                </div>
              </td>
            </tr>
          </MantineTable.Tbody>
        </MantineTable>
      </div>
    )
  }

  return (
    <div ref={tableContainerRef} style={{ overflow: 'auto' }}>
      <MantineTable striped highlightOnHover withTableBorder>
        <MantineTable.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <MantineTable.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <MantineTable.Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </MantineTable.Th>
              ))}
            </MantineTable.Tr>
          ))}
        </MantineTable.Thead>
        <MantineTable.Tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <MantineTable.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <MantineTable.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </MantineTable.Td>
                ))}
              </MantineTable.Tr>
            ))
          ) : (
            <MantineTable.Tr>
              <MantineTable.Td colSpan={columns.length}>
                <Text ta="center" c="dimmed" py="xl">
                  {emptyMessage}
                </Text>
              </MantineTable.Td>
            </MantineTable.Tr>
          )}
        </MantineTable.Tbody>
      </MantineTable>
    </div>
  )
}

export const DataTable = memo(DataTableInner) as <T>(
  props: DataTableProps<T>,
) => JSX.Element
