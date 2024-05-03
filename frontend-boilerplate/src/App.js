import Wrapper from "./Wrapping/Wrapper";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Wrapper expectedChainId={80002} expectedChainName={"Polygon Amoy"}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </Wrapper>
  );
}

export default App;
