import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Navbar';

type Props = { children: ReactNode };

const Layout = (props: Props) => {
  return (
    <div>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
