import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { it } from 'payload/i18n/it'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Activities } from './collections/Activities'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { ThemeColors } from './ThemeColors/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const smtpPort = Number(process.env.SMTP_PORT || 587)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  email: nodemailerAdapter({
    defaultFromAddress:
      process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER || 'no-reply@localhost',
    defaultFromName: process.env.SMTP_FROM_NAME || 'Hero 4 Gotham',
    skipVerify:
      process.env.SMTP_SKIP_VERIFY === 'true' || !process.env.SMTP_USER || !process.env.SMTP_PASS,
    transportOptions: {
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              pass: process.env.SMTP_PASS,
              user: process.env.SMTP_USER,
            }
          : undefined,
      host: process.env.SMTP_HOST || 'smtp.ionos.it',
      port: Number.isFinite(smtpPort) ? smtpPort : 587,
      requireTLS: process.env.SMTP_REQUIRE_TLS !== 'false',
      secure: process.env.SMTP_SECURE === 'true',
    },
  }),
  collections: [Pages, Posts, Activities, Events, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, ThemeColors],
  i18n: {
    fallbackLanguage: 'it',
    supportedLanguages: { it },
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
