import '../styles/global.css';
import { AppProps } from 'next/app';
import { TruckContext } from '../lib/context';
import { ToastContextProvider } from '../lib/toast-context';
import SidebarComponent from '../components/sidebar';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps, router }: AppProps) {
  const routes = ['home', 'trucks', 'misc', 'customers', 'register'];
  let showSidebar = false;

  if (routes.some((substring) => router.pathname.includes(substring))) {
    showSidebar = true;
  }

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <ToastContextProvider>
        <TruckContext.Provider value={[]}>
          <div className="flex">
            {showSidebar && <SidebarComponent />}
            <Component {...pageProps} />
          </div>
        </TruckContext.Provider>
      </ToastContextProvider>
    </>
  );
}
