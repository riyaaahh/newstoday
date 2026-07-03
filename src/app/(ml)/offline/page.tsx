export const metadata = { title: 'Offline — NewsToday', robots: { index: false } }

// Inline styles on purpose: when served offline by the service worker, the
// external CSS/JS chunks aren't cached, so this page must stand on its own.
export default function OfflinePage() {
  return (
    <main
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '80px 20px',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: '1.8rem', marginBottom: 8 }}>
        News<span style={{ color: '#c1121f' }}>Today</span>
      </div>
      <h1 style={{ fontSize: '1.4rem', margin: '16px 0 8px' }}>
        നിങ്ങൾ ഓഫ്‌ലൈനാണ് · You’re offline
      </h1>
      <p style={{ color: '#5b6671' }}>
        ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക. · Check your connection and try again.
      </p>
    </main>
  )
}
