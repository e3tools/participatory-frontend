import { createContext, useState } from 'react';
import React from 'react';

/**
 * Export the NetworkContext.
 */
export const NetworkContext = createContext({
  isConnected: false,
  setIsConnected: () => null,
});

/**
 * Export the NetworkProvider, passing the isConnected and the setConnected as values of the NetworkContext Provider.
 * @param param0
 * @returns
 */
export const NetworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const value = { isConnected, setIsConnected };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};
