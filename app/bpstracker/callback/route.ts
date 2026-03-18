import { NextRequest, NextResponse } from 'next/server'

// Preserve OAuth callback compatibility for BPSTracker v1.x
// The iOS app uses ai-muninn.com/bpstracker/callback as the OAuth redirect URI.
// Until v1.3 updates the redirect URI to bpstracker.com, this route forwards the request.
export function GET(request: NextRequest) {
  const { search } = new URL(request.url)
  return NextResponse.redirect(`https://bpstracker.com/bpstracker/callback${search}`, 302)
}
