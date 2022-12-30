import { ChakraProvider } from '@chakra-ui/react';
import '../styles/scrollbar.css';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
