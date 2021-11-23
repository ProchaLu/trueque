import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Item, User } from '../util/database';

type Props = {
  item: Item;
  notificationLength?: number;
  user: User;
  latSum: number;
  lngSum: number;
};

const mapContainerStyle = {
  width: '90vw',
  height: '90vh',
};

const libraries = ['places'];

const options = { disableDefaultUI: true, zoomControl: true };

const TradeDetails = (props: Props) => {
  const router = useRouter();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: YOUR_API_KEY,
    libraries,
  });

  const center = {
    lat: props.latSum,
    lng: props.lngSum,
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <Layout notificationLength={props.notificationLength}>
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
          <div className="mx-auto p-0">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={16}
              center={center}
              options={options}
            >
              {' '}
              <Marker
                position={{
                  lat: Number(props.latSum),
                  lng: Number(props.lngSum),
                }}
              />
            </GoogleMap>
          </div>
          <button
            onClick={() => router.push(`mailto:${props.user.mail}`)}
            className="w-full shadow-lg bg-blue-dark mt-5 text-bright text-xl font-bold py-2 mb-5 px-10 rounded hover:bg-blue-light hover:text-dark"
          >
            MAIL
          </button>
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

  const myUser = await getUser(session.userId);

  const latSum = (Number(user.lat) + Number(myUser.lat)) / 2;

  const lngSum = (Number(user.lng) + Number(myUser.lng)) / 2;

  return {
    props: { item, user, latSum, lngSum },
  };
}
