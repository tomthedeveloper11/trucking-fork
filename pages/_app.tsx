import '../styles/global.css';
import { AppProps } from 'next/app';
import TruckContext from '../lib/context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <TruckContext.Provider value={[]}>
        <Component {...pageProps} />
      </TruckContext.Provider>
    </>
  );
}
