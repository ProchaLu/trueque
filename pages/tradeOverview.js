import Layout from '../components/Layout';

const tradeOverview = () => {
  return (
    <Layout>
      <div className="max-w-7xl  mx-auto px-4 py-5 lg:py-10">
        TRADE OVERVIEW
      </div>
    </Layout>
  );
};

export default tradeOverview;

export async function getServerSideProps(context) {
  const { getValidSessionByToken, getTradelistByUserId, getItemByItemId } =
    await import('../util/database');

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: '/login?returnTo=/tradeOverview',
        permanent: false,
      },
    };
  }

  const tradelistRows = await getTradelistByUserId(session.userId);

  console.log(tradelistRows);

  return {
    props: {},
  };
}
