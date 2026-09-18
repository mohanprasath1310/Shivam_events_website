// supabase/functions/send-notification/index.ts
//
// Deploy with the Supabase CLI:
//   supabase functions deploy send-notification
//   supabase secrets set RESEND_API_KEY=your_resend_api_key
//
// Sign up free at https://resend.com (100 emails/day on the free tier),
// verify a sending domain (or use their onboarding@resend.dev for testing),
// and set NOTIFY_TO / NOTIFY_FROM below via secrets too if you want to
// avoid hardcoding them.
//
// This function is called from the frontend via:
//   supabase.functions.invoke('send-notification', { body: { type, ...data } })
// and never exposes the Resend API key to the browser.

import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFY_TO = Deno.env.get('NOTIFY_TO') || 'mohanmoovai6384@gmail.com'
const NOTIFY_FROM = Deno.env.get('NOTIFY_FROM') || 'onboarding@resend.dev'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function bookingEmailHtml(b: Record<string, unknown>) {
  const rows = [
    ['Customer Name', b.customer_name],
    ['Phone', b.phone],
    ['Email', b.email],
    ['Selected Service', b.event_type],
    ['Event Date', b.event_date],
    ['Event Time', b.event_time],
    ['Event Location', b.location],
    ['Expected Budget', b.expected_budget ? `₹${b.expected_budget}` : b.budget],
    ['Paper Blast Quantity', b.paper_blast_quantity],
    ['Decoration Description', b.decoration_description],
    ['Decoration Special Requirements', b.decoration_special_requirements],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '')

  const imageLinks = Array.isArray(b.decoration_images) && b.decoration_images.length > 0
    ? `<p><strong>Inspiration Images:</strong></p><ul>${b.decoration_images
        .map((url: string) => `<li><a href="${url}">${url}</a></li>`)
        .join('')}</ul>`
    : ''

  return `
    <h2>New Booking Request — Shivam Events</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows.map(([label, value]) => `
        <tr>
          <td style="font-weight:600;border-bottom:1px solid #eee">${label}</td>
          <td style="border-bottom:1px solid #eee">${value}</td>
        </tr>`).join('')}
    </table>
    ${imageLinks}
  `
}

function contactEmailHtml(c: Record<string, unknown>) {
  return `
    <h2>New Contact Message — Shivam Events</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td style="font-weight:600;border-bottom:1px solid #eee">Name</td><td style="border-bottom:1px solid #eee">${c.name}</td></tr>
      <tr><td style="font-weight:600;border-bottom:1px solid #eee">Phone</td><td style="border-bottom:1px solid #eee">${c.phone}</td></tr>
      <tr><td style="font-weight:600;border-bottom:1px solid #eee">Email</td><td style="border-bottom:1px solid #eee">${c.email || '—'}</td></tr>
      <tr><td style="font-weight:600;vertical-align:top">Message</td><td>${c.message}</td></tr>
    </table>
  `
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!RESEND_API_KEY) {
      // Fail quietly — the booking/message is already saved in the DB
      // regardless of whether email sending is configured.
      return new Response(JSON.stringify({ skipped: true, reason: 'RESEND_API_KEY not set' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { type, ...data } = body

    const subject = type === 'booking'
      ? `New Booking: ${data.customer_name} — ${data.event_type}`
      : `New Contact Message: ${data.name}`

    const html = type === 'booking' ? bookingEmailHtml(data) : contactEmailHtml(data)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: NOTIFY_TO,
        subject,
        html,
      }),
    })

    const result = await res.json()

    return new Response(JSON.stringify({ sent: res.ok, result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 200, // still 200 so the frontend's fire-and-forget call doesn't surface an error to the customer
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
