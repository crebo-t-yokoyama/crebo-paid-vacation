import { ChakraProvider, Container, Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

import { Header } from "@/components/header";

import "@/styles/globals.css";
import "@/styles/date-picker.css";
import "react-datepicker/dist/react-datepicker.css";

import type { AppProps } from "next/app";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Box bgColor="silver" h="100vh">
            <Container maxW="600px" h="100vh" bgColor="white" px={0}>
              <Header />
              <Component {...pageProps} />
            </Container>
          </Box>
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
