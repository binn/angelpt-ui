import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { MultiSelectTheme } from "chakra-multiselect";
import Head from 'next/head';
import '../styles/scrollbar.css';

const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme
  }
});

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
