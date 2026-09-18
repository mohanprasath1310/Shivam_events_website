export function SkeletonCard() {
  return (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-black/5 bg-white">
      <div className="skeleton h-28 sm:h-40 lg:h-52 w-full" />
      <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
        <div className="skeleton h-3.5 sm:h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-6 sm:h-8 w-20 sm:w-24 rounded-full mt-2" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonRow() {
  return (
    <tr>
      <td colSpan={100} className="p-0">
        <div className="skeleton h-12 w-full" />
      </td>
    </tr>
  )
}
