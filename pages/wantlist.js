import React from 'react';
import Layout from '../components/Layout';

const Wantlist = () => {
  return (
    <Layout>
      <div className="max-w-7xl  mx-auto px-4 py-5 lg:py-10">
        <h1 className="mb-10 text-center text-3xl font-bold">WANTLIST</h1>
      </div>
    </Layout>
  );
};

export default Wantlist;

export async function getServerSideProps(context) {
  const { getValidSessionByToken } = await import('../util/database');

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: '/login?returnTo=/wantlist',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
