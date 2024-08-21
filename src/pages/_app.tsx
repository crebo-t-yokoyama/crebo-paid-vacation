import { ChakraProvider, Container, Box } from "@chakra-ui/react";

import { Header } from "@/components/header";

import "@/styles/globals.css";
import "@/styles/date-picker.css";
import "react-datepicker/dist/react-datepicker.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Box bgColor="silver" h="100vh">
        <Container maxW="600px" h="100vh" bgColor="white" px={0}>
          <Header />
          <Component {...pageProps} />
        </Container>
      </Box>
    </ChakraProvider>
  );
}
