import { Disclosure } from '@headlessui/react';
import Link from 'next/link';

const NavbarBeforeLogin = () => {
  return (
    <Disclosure as="nav" className="bg-blue-dark">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="flex-shrink-0 flex items-center px-4">
          <img
            className="block h-8 w-auto"
            src="/images/logo_white_large.png"
            alt="trueque Logo"
          />
        </div>
        <Link href="/" passHref>
          <a className="absolute right-0 mx-4 text-bright px-3 py-2 rounded-md text-base font-medium hover:bg-blue-light hover:text-dark">
            LOGIN
          </a>
        </Link>
      </div>
    </Disclosure>
  );
};

export default NavbarBeforeLogin;
