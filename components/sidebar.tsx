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
import { getCookie } from 'cookies-next';
import * as jwt from 'jsonwebtoken';

export default function SidebarComponent() {
  const access_token = getCookie('access_token');
  const user = jwt.decode(access_token, process.env.SECRET_KEY);

  const router = useRouter();

  return (
    <div className="scrollbar fixed w-[17vw] max-w-[155px] overflow-y-scroll top-0 bottom-0 left-0 py-10 bg-gray-50 rounded scroll">
      <ul className="mb-5 border-b border-gray-200">
        <li>
          <a className="flex items-center p-2 mt-5 text-base font-normal text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 group">
            <Image
              className="rounded-full object-scale-down bg-blue-400"
              src="https://cdn.pixabay.com/photo/2018/08/28/13/29/avatar-3637561_960_720.png"
              alt="Rounded avatar"
              width={45}
              height={45}
            />
            <span className="ml-3">{user?.username}</span>
          </a>
        </li>
      </ul>
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
              router.pathname == '/trucks' ? 'sidebarActiveLink' : 'sidebarLink'
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
        <Link href="/misc">
          <li
            className={
              router.pathname == '/misc' ? 'sidebarActiveLink' : 'sidebarLink'
            }
          >
            <ClipboardIcon
              className={
                router.pathname == '/misc' ? 'sidebarActiveIcon' : 'sidebarIcon'
              }
            />
            <span
              className={
                router.pathname == '/misc' ? 'sidebarActiveText' : 'sidebarText'
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
    </div>
  );
}
