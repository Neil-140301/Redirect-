// @ts-nocheck
import { createContext, useContext, useState } from "react";

const VerifiedContext = createContext();

export const useVerifiedContext = () => {
  return useContext(VerifiedContext);
};

export const VerifiedProvider = ({ children }) => {
  // const [verified, setVerified] = useState(false);
  const [verified, setVerified] = useState(true);
  return (
    <VerifiedContext.Provider value={{ verified, setVerified }}>
      {children}
    </VerifiedContext.Provider>
  );
};
