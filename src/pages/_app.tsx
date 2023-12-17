import { Kanit } from 'next/font/google'
import type { AppProps } from 'next/app'
import '../styles/globals.css'

const kanit = Kanit({
  weight: ["400", "500", "600"],
  subsets: ["latin-ext", "thai"],
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={kanit.className} data-theme="night">
      <Component {...pageProps} />
    </main>
  )
}
