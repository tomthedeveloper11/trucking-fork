import {
  HomeIcon,
  TruckIcon,
  ClipboardIcon,
  ViewGridIcon,
  UserAddIcon,
} from '@heroicons/react/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SidebarComponent() {
  const router = useRouter();

  return (
    <aside className="w-48 fixed left-0 top-0" aria-label="Sidebar">
      <div className="pb-52 overflow-y-auto py-[5vh] px-3 bg-gray-50 rounded dark:bg-gray-800">
        <ul className="space-y-7">
          <Link href="/">
            <li
              className={
                router.pathname == '/' ? 'sidebarActiveLink' : 'sidebarLink'
              }
            >
              <span className="flex">
                <HomeIcon
                  className={
                    router.pathname == '/' ? 'sidebarActiveIcon' : 'sidebarIcon'
                  }
                />
                <span
                  className={
                    router.pathname == '/' ? 'sidebarActiveText' : 'sidebarText'
                  }
                >
                  Home
                </span>
              </span>
            </li>
          </Link>
          <Link href="/trucks">
            <li
              className={
                router.pathname == '/trucks'
                  ? 'sidebarActiveLink'
                  : 'sidebarLink'
              }
            >
              <span className="flex">
                <TruckIcon
                  className={
                    router.pathname == '/trucks'
                      ? 'sidebarActiveIcon'
                      : 'sidebarIcon'
                  }
                />
                <span
                  className={
                    router.pathname == '/trucks'
                      ? 'sidebarActiveText'
                      : 'sidebarText'
                  }
                >
                  Semua Truk
                </span>
              </span>
            </li>
          </Link>
          <Link href="">
            <li
              className={
                router.pathname == '/others'
                  ? 'sidebarActiveLink'
                  : 'sidebarLink'
              }
            >
              <ClipboardIcon
                className={
                  router.pathname == '/others'
                    ? 'sidebarActiveIcon'
                    : 'sidebarIcon'
                }
              />
              <span
                className={
                  router.pathname == '/others'
                    ? 'sidebarActiveText'
                    : 'sidebarText'
                }
              >
                Pengeluaran Lain
              </span>
            </li>
          </Link>

          <Link href="/customers">
            <li
              className={
                router.pathname == '/customers'
                  ? 'sidebarActiveLink'
                  : 'sidebarLink'
              }
            >
              <ViewGridIcon
                className={
                  router.pathname == '/customers'
                    ? 'sidebarActiveIcon'
                    : 'sidebarIcon'
                }
              />
              <span
                className={
                  router.pathname == '/customers'
                    ? 'sidebarActiveText'
                    : 'sidebarText'
                }
              >
                EMKL
              </span>
            </li>
          </Link>
          <Link href="/register">
            <li
              className={
                router.pathname == '/register'
                  ? 'sidebarActiveLink'
                  : 'sidebarLink'
              }
            >
              <UserAddIcon
                className={
                  router.pathname == '/register'
                    ? 'sidebarActiveIcon'
                    : 'sidebarIcon'
                }
              />
              <span
                className={
                  router.pathname == '/register'
                    ? 'sidebarActiveText'
                    : 'sidebarText'
                }
              >
                Tambah User Baru
              </span>
            </li>
          </Link>
        </ul>
        <ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
            >
              <svg
                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:group-hover:text-white dark:text-gray-400"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="gem"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M378.7 32H133.3L256 182.7L378.7 32zM512 192l-107.4-141.3L289.6 192H512zM107.4 50.67L0 192h222.4L107.4 50.67zM244.3 474.9C247.3 478.2 251.6 480 256 480s8.653-1.828 11.67-5.062L510.6 224H1.365L244.3 474.9z"
                ></path>
              </svg>
              <span className="ml-4">Upgrade to Pro</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
            >
              <svg
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-3">Documentation</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
            >
              <svg
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
              <span className="ml-3">Components</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 mt-5 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
            >
              <Image
                className="rounded-full object-scale-down bg-blue-400"
                src="https://cdn.pixabay.com/photo/2018/08/28/13/29/avatar-3637561_960_720.png"
                alt="Rounded avatar"
                width={45}
                height={45}
              />

              <span className="ml-3">Tommy</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
