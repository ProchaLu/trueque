import 'tailwindcss/tailwind.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>trueque</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          lang="en"
        />
      </Head>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
