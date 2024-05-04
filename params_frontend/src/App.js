import Wrapper from "./Wrapping/Wrapper";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from "./Content/Main";

function App() {
  let chainId = parseInt(process.env.CHAIN_ID);
  let chainName = process.env.CHAIN_NAME;
  console.log(`Launching app for chain-id=[${chainId}] chain-name=[${chainName}]`)
  return (
    <Wrapper expectedChainId={chainId} expectedChainName={chainName}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </Wrapper>
  );
}

export default App;
