import { createContext } from 'react';

const ContractWindowContext = createContext({
    wrappedCall: (f) => f,
});

export default ContractWindowContext;