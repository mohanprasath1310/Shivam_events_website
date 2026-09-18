// Supabase returns `null` for empty columns. Passing `null` straight through
// as a controlled <input>/<textarea>/<select> `value` triggers React's
// "value prop on input should not be null" warning, and — worse — makes
// React treat the field as effectively uncontrolled until the person types
// into it, which is why editing an existing row with blank fields could feel
// like some inputs just weren't responding. Run every row through this
// before putting it into form state so every field is always a real string.
export function sanitizeRow(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, value === null || value === undefined ? '' : value])
  )
}
