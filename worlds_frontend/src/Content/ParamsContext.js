import { createContext } from 'react';

const ParamsContext = createContext({
    wrappedCall: (f) => f,
});

export default ParamsContext;