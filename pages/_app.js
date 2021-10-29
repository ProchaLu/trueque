import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

const MyApp = ({ Component, pageProps }) => {
  const [username, setUsername] = useState();

  const refreshUsername = useCallback(async () => {
    const response = await fetch('/api/profile');
    const profile = await response.json();

    if ('errors' in profile) {
      return;
    }
    setUsername(profile.user.username);
  }, []);

  useEffect(() => {
    refreshUsername();
  }, []);

  return (
    <>
      <Head>
        <title>trueque</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          title="trueque"
          description="exchange platform for everybody, exchange items with just view clicks"
        />
      </Head>
      <Component
        {...pageProps}
        username={username}
        refreshUsername={refreshUsername}
      />
    </>
  );
};

export default MyApp;
