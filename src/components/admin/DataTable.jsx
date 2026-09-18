import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { SkeletonRow } from '../common/SkeletonLoader'
import EmptyState from '../common/EmptyState'

export default function DataTable({ columns, rows, loading, onEdit, onDelete, emptyMessage = 'No records found' }) {
  return (
    <div className="rounded-2xl border border-black/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-offwhite">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="text-left font-medium text-black/60 px-4 py-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <motion.tbody initial="hidden" animate="visible">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <EmptyState title={emptyMessage} />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-black/5 hover:bg-offwhite/60 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            aria-label="Edit"
                            className="h-8 w-8 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors"
                          >
                            <Pencil className="h-4 w-4 text-black/60" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            aria-label="Delete"
                            className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  )
}
