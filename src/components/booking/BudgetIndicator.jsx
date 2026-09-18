import { motion } from 'framer-motion'

// Purely visual — shows the customer's typed budget as a position along a bar
// scaled to the service's admin-configured maximum charge. Never displays the
// service's actual price, only a relative comparison.
export default function BudgetIndicator({ budget, maxCharge }) {
  if (!maxCharge || !budget || isNaN(budget)) return null

  const numericBudget = Number(budget)
  const percent = Math.min(100, Math.max(4, (numericBudget / maxCharge) * 100))
  const withinRange = numericBudget <= maxCharge

  return (
    <div className="rounded-xl border border-black/10 p-4 bg-offwhite/60">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-black/60">Your Expected Budget</span>
        <span className="font-semibold">₹{numericBudget.toLocaleString('en-IN')}</span>
      </div>

      <div className="h-2.5 w-full rounded-full bg-black/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${withinRange ? 'bg-emerald-500' : 'bg-amber-500'}`}
        />
      </div>

      <p className={`text-xs mt-2 ${withinRange ? 'text-emerald-600' : 'text-amber-600'}`}>
        {withinRange
          ? 'Your budget fits within our standard service range for this event type.'
          : 'Your budget is above our standard range — we\'ll reach out to discuss a custom quotation.'}
      </p>
    </div>
  )
}
