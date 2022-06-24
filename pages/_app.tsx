import '../styles/global.css';
import { AppProps } from 'next/app';
import { TruckContext } from '../lib/context';
import { ToastContextProvider } from '../lib/toast-context';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContextProvider>
        <TruckContext.Provider value={[]}>
          <Component {...pageProps} />
        </TruckContext.Provider>
      </ToastContextProvider>
    </>
  );
}
