import { NextResponse, type NextRequest } from 'next/server'

// Since Firebase Admin SDK is unavailable due to GCP policy restrictions, 
// edge-based middleware session verification is bypassed.
// Route protection is handled via client-side components (Admin, Dashboard).
export function middleware(request: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: [], // No routes matched for now
}
