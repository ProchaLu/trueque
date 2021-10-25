import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { Fragment } from 'react';

const navigation = [
  { name: 'Item Page', href: '/itempage', current: false },
  { name: 'Add Item', href: '/addItem', current: false },
  { name: 'Trade Overview', href: '/tradeOverview', current: false },
  { name: 'Wantlist', href: '/wantlist', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  return (
    <Disclosure as="nav" className="bg-blue-dark">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 bg-blue-dark">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-bright hover:text-bright hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-bright">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="/images/logo_white_large.png"
                    alt="trueque Logo"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="/images/logo_white_large.png"
                    alt="trueque Logo"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-blue-light text-bright'
                            : 'text-bright hover:bg-blue-light hover:text-dark',
                          'px-3 py-2 rounded-md text-base font-medium',
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link href="/notifications" passHref>
                  <button
                    type="button"
                    className="bg-blue-dark p-1 rounded-full text-bright hover:text-bright focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bright focus:ring-bright"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Link>
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-dark flex text-base rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="/images/logo_small_icon_only.png"
                        alt="personal information"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-bright ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/">
                            <a
                              className={classNames(
                                active ? 'bg-blue-light' : '',
                                'block px-4 py-2 text-base text-dark',
                              )}
                            >
                              Your Profile
                            </a>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/">
                            <a
                              className={classNames(
                                active ? 'bg-blue-light' : '',
                                'block px-4 py-2 text-base text-dark',
                              )}
                            >
                              Sign out
                            </a>
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-light text-dark'
                      : 'text-bright hover:bg-blue-light hover:text-dark',
                    'block px-3 py-2 rounded-md text-base font-medium',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
