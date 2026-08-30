// Express server for Railway deployment
// Serves landing page at / and SARMS React app at /portal
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// Serve static assets (JS, CSS, images from dist/assets)
app.use('/assets', express.static(join(__dirname, 'dist/assets')))

// Landing page at root /
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'landing.html'))
})

// SARMS app at /portal (and all sub-routes for React Router)
app.get('/portal*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/index.html'))
})

// API proxy or direct (if PHP not available, return 503)
app.use('/api', (req, res) => {
  res.status(503).json({ error: 'API not available in this deployment mode' })
})

// Catch-all: redirect to landing
app.get('*', (req, res) => {
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`🏫 Genius Model School server running on port ${PORT}`)
  console.log(`   Landing page: http://localhost:${PORT}/`)
  console.log(`   SARMS portal: http://localhost:${PORT}/portal`)
})
