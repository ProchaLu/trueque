import Layout from '../components/Layout';

const Itempage = (props) => {
  return (
    <Layout>
      <div className="max-w-7xl  mx-auto px-4 py-5 lg:py-10">
        <h1 className="mb-10 text-center text-3xl font-bold">ITEM PAGE</h1>
        <h2 className="mb-10 text-center text-2xl font-bold">
          YOUR ITEMS TO TRADE
        </h2>
        <div>
          {props.items.map((item) => {
            return (
              <div key={`item-li-${item.id}`}>
                <div className="bg-blue-light m-4 p-4">
                  <h3 className="text-2xl font-bold">{item.itemName}</h3>
                  <img src={item.image} alt={item.itemName} />
                  <div>{item.itemPrice}</div>
                  <div>{item.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Itempage;

export async function getServerSideProps(context) {
  const { getValidSessionByToken, getItemsFromUserId } = await import(
    '../util/database'
  );

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: '/login?returnTo=/itempage',
        permanent: false,
      },
    };
  }

  const items = await getItemsFromUserId(session.userId);

  return {
    props: { items },
  };
}
