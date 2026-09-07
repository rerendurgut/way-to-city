import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'WayToCity'

    const subtitle = searchParams.get('subtitle')?.slice(0, 150) ||
      'Urban Transit & Travel Guide'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'between',
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #18181b 2%, transparent 0%)',
            backgroundSize: '50px 50px',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
          }}
        >
          {/* Top Brand Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '9999px',
              padding: '10px 24px',
              fontSize: '20px',
              fontWeight: 700,
              color: '#34d399',
              letterSpacing: '0.05em',
            }}
          >
            <span>🟢 WAYTOCITY</span>
          </div>

          {/* Center Main Header */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '40px', gap: '16px' }}>
            <div
              style={{
                fontSize: '64px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: '#ffffff',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 500,
                color: '#a1a1aa',
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Footer Badge */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid #27272a',
              paddingTop: '32px',
              fontSize: '20px',
              color: '#71717a',
            }}
          >
            <span>Transit Routes • POIs • Local Food • Stays</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>waytocity.com</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (err: any) {
    return new Response(`Failed to generate the OG image`, {
      status: 500,
    })
  }
}
