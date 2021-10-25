import 'tailwindcss/tailwind.css';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>trueque</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          lang="en"
          title="trueque"
          description="exchange platform for everybody, exchange items with just view clicks"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
