import Link from 'next/link';
import Layout from '../components/Layout';

const Itempage = (props) => {
  return (
    <Layout>
      <div className="max-w-7xl  mx-auto px-2 py-2 lg:py-10">
        <h1 className="mb-10 text-center text-3xl font-bold">ITEM PAGE</h1>
        <h2 className="mb-10 text-center text-2xl font-bold">
          YOUR ITEMS TO TRADE
        </h2>
        <div>
          {props.items.map((item) => {
            return (
              <div key={`item-li-${item.id}`}>
                <div className="bg-blue-light">
                  <div className="m-4 py-2 grid grid-cols-2 gap-2 place-content-center">
                    <div className="my-auto">
                      <h3 className="text-2xl font-bold">{item.itemName}</h3>
                      <div>{item.itemPrice}€</div>
                      <div>{item.description}</div>
                    </div>
                    <div className="w-full">
                      <img
                        className="object-scale-down"
                        src={item.image}
                        alt={item.itemName}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={async () => await console.log('EDIT')}
                    className="w-auto shadow-lg bg-blue text-bright text-xl font-bold py-2 mb-5 px-10 rounded hover:bg-blue-light hover:text-dark"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={async () => await console.log('DELETE')}
                    className="w-auto shadow-lg bg-red text-bright text-xl font-bold py-2 mb-5 px-10 rounded hover:bg-red-light hover:text-dark"
                  >
                    DELETE
                  </button>
                </div>
                <Link href="/itemExchange/" passHref>
                  <button className="w-full shadow-lg bg-blue-dark text-bright text-xl font-bold py-2 mb-10 px-10 rounded hover:bg-blue-light hover:text-dark">
                    START SEARCHING {item.id}
                  </button>
                </Link>
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
