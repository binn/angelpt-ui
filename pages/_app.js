import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import '../styles/scrollbar.css';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
