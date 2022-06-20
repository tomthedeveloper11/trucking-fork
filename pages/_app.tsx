import '../styles/global.css';
import { AppProps } from 'next/app';
import { useState } from 'react';
import TruckContext from '../components/context';

export default function App({ Component, pageProps }: AppProps) {
  const [allTruckState, setAllTruckState] = useState([]);

  return (
    <>
      <TruckContext.Provider value={{ allTruckState, setAllTruckState }}>
        <Component {...pageProps} />
      </TruckContext.Provider>
    </>
  );
}
