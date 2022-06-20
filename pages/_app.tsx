import '../styles/global.css';
import { AppProps } from 'next/app';
import { useState } from 'react';
import TruckContext from '../components/context';
import { Truck } from '../types/common';

export default function App({ Component, pageProps }: AppProps) {
  const [TruckState, setTruckState] = useState({
    name: '',
    imageUrl: '',
  } as Truck);

  return (
    <>
      <TruckContext.Provider value={{ TruckState, setTruckState }}>
        <Component {...pageProps} />
      </TruckContext.Provider>
    </>
  );
}
