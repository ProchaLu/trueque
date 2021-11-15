import { GetServerSidePropsContext } from 'next';
import Layout from '../components/Layout';

const TradeDetails = (props) => {
  return (
    <Layout>
      <div className="max-w-7xl text-center  mx-auto p-4 md:p-10">
        <h1 className="mb-5 text-center text-3xl font-bold">DETAILS</h1>
        <h3 className="text-2xl font-bold text-center mb-4">
          You have accepted this item
        </h3>
        <div>
          <div className="text-left text-xl font-bold">
            {props.item.itemName}
          </div>
          <div className="text-left text-xl font-bold">
            {props.item.itemPrice}€
          </div>
          <div className="border my-2 mx-auto max-w-lg">
            <img src={props.item.image} alt={props.item.itemName} />
          </div>
          <div className="m-5 text-left">
            Description: {props.item.description}
          </div>
          <h3 className="text-2xl font-bold text-center mb-4">
            Middlewaypoint
          </h3>
          <iframe
            className="mx-auto"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.6940646226435!2d16.406720115650987!3d48.19324577922793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d075b1edff245%3A0xaef7a8ddf96bc82d!2sMarkhofgasse%2019%2C%201030%20Wien!5e0!3m2!1sde!2sat!4v1636728088678!5m2!1sde!2sat"
            width="auto"
            height="auto"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </Layout>
  );
};

export default TradeDetails;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken, getItemByItemId, getUser } = await import(
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
        destination: '/login?returnTo=/tradeOverview',
        permanent: false,
      },
    };
  }

  const itemId = Number(context.req.cookies.item);

  const item = await getItemByItemId(itemId);

  const user = await getUser(item.userId);

  return {
    props: { item, user },
  };
}
