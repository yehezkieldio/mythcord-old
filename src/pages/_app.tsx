import type { AppProps } from 'next/app';
import { Provider } from "next-auth/client";
import "../structures/dashboard/styles/index.scss";

function MythcordApp({ Component, pageProps }: AppProps) {
  return (
      <Provider session={pageProps.session}>
          <Component {...pageProps} />
      </Provider>
  )
}

export default MythcordApp;