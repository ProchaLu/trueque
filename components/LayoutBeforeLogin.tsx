import { ReactNode } from 'react';
import Footer from './Footer';
import NavbarBeforeLogin from './NavbarBeforeLogin';

type Props = { children: ReactNode };

const Layout = (props: Props) => {
  return (
    <div>
      <NavbarBeforeLogin />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
