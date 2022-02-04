import React from 'react';
import { ChainId, DAppProvider } from "@usedapp/core"
import { Header } from "./component/Header"
import { Main } from './component/Main';
import { Container } from "@material-ui/core"

function App() {
  return (
    <DAppProvider config={{
      //supportedChains: [ChainId.Kovan],
      //networks: [ChainId.Kovan],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      }
    }}>
      <Header />
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>

  );
}

export default App;
