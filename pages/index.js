import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import LayoutBeforeLogin from '../components/LayoutBeforeLogin';
import ExampleImage1 from '../public/images/FRONTPAGE.jpg';
import Logo from '../public/images/logo_large.png';
import ExampleImage2 from '../public/images/TRADINGPAGE.png';

const Index = () => {
  const router = useRouter();

  return (
    <LayoutBeforeLogin>
      <div className="max-w-7xl  mx-auto p-4 md:p-10">
        <h1>
          <Image src={Logo} alt="trueque" />
        </h1>
        <h2 className="text-center p-10 text-5xl font-bold">
          DO NOT BUY, IF YOU CAN SWAP
        </h2>
        <div className="text-xl">
          TRUEQUE is an item exchange project. You can upload a picture of your
          item that you want to trade, give it a price tag and start to look at
          items in the same price category. When you like an item, you are able
          to press YES and the other user gets a notification that you are
          looking for a trade.
        </div>
        <h3 className="text-3xl my-4 font-bold mt-10">FEATURES</h3>
        <ul className="list-disc mx-10 text-xl">
          <li>Search or items the easy way</li>
          <li>Get in touch with the other trader</li>
          <li>Add / Edit and Delete your items easy</li>
        </ul>
        <div className="m-4 block sm:flex items-center justify-center">
          <div className="p-4 mx-auto flex justify-center">
            <Image src={ExampleImage1} alt="example of the front page" />
          </div>
          <div className="p-4 mx-auto flex justify-center">
            <Image src={ExampleImage2} alt="example of the item page" />
          </div>
        </div>
        <div>
          <button
            onClick={() => router.push('/register/')}
            className="w-full bg-blue text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </LayoutBeforeLogin>
  );
};

export default Index;
