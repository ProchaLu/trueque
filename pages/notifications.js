import Layout from '../components/Layout';

const Notifications = () => {
  return (
    <Layout>
      <div className="max-w-7xl  mx-auto px-4 py-5 lg:py-10">NOTIFICATIONS</div>
    </Layout>
  );
};

export default Notifications;

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
        destination: '/login?returnTo=/notifications',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
