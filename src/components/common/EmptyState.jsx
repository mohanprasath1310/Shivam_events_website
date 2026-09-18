import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-14 w-14 rounded-full bg-offwhite flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-black/40" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-black">{title}</h3>
      {description && <p className="text-sm text-black/50 mt-1 max-w-sm">{description}</p>}
    </div>
  )
}
