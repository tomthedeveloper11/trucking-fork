import '../styles/global.css';
import { AppProps } from 'next/app';
import { TruckContext, UserContext } from '../lib/context';
import { ToastContextProvider } from '../lib/toast-context';
import SidebarComponent from '../components/sidebar';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps, router }: AppProps) {
  const showSidebar = router.pathname === '/login' ? false : true;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <ToastContextProvider>
        <UserContext.Provider value={{}}>
          <TruckContext.Provider value={[]}>
            <div className="flex">
              {showSidebar && <SidebarComponent />}
              <Component {...pageProps} />
            </div>
          </TruckContext.Provider>
        </UserContext.Provider>
      </ToastContextProvider>
    </>
  );
}
