import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Navbar';

type Props = {
  notificationLength?: number;
  // Only if you're using props.children
  children: ReactNode;
};

const Layout = (props: Props) => {
  return (
    <div>
      <Header notificationLength={props.notificationLength} />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
