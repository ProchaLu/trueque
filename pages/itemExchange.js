import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Errors } from '../util/types';

const ItemExchange = (props) => {
  const router = useRouter();

  const [errors, setErrors] = useState < Errors > [];

  const onClickYes = async () => {
    const registerResponse = await fetch('api/wantlist/addWantlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.user,
        userExchangeItemId: props.exchangeItem.id,
        itemUserId: props.itemPriceRange.userId,
        itemId: props.itemPriceRange.id,
      }),
    });
    const addWantlistJson = await registerResponse.json();
    if ('errors' in addWantlistJson) {
      setErrors(addWantlistJson.errors);
      return;
    }
  };

  const onClickYesWithRouting = () => {
    onClickYes();
    router.reload();
  };

  return (
    <Layout notificationLength={props.notificationLength}>
      <div className="max-w-7xl text-center  mx-auto p-4    md:p-10">
        <h1 className="mb-2 text-3xl font-bold">ITEM EXCHANGE</h1>
        <h2 className="text-2xl text-left font-bold">
          exchange "{props.exchangeItem.itemName}" for:
        </h2>
        <div>
          <div className="text-left text-xl font-bold">
            {props.itemPriceRange.itemName}
          </div>
          <div className="text-left font-bold">
            {props.itemPriceRange.itemPrice}€
          </div>
          <div className="border my-5 mx-auto max-w-lg">
            <img
              src={props.itemPriceRange.image}
              alt={props.itemPriceRange.itemName}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 place-items-center justify-items-center">
        <button
          onClick={() => router.reload()}
          className="rounded-full h-40 w-40 border-2 border-dark flex items-center justify-center bg-red text-bright text-3xl"
        >
          NO
        </button>
        <button
          onClick={onClickYesWithRouting}
          className="rounded-full h-40 w-40 border-2 border-dark  flex items-center justify-center bg-green text-bright text-3xl"
        >
          YES
        </button>
        <div className="text-red mb-2">
          {errors.map((error) => (
            <div key={`error-${error.message}`}>{error.message}</div>
          ))}
        </div>
      </div>
      <div className="m-5 text-left">
        Description: {props.itemPriceRange.description}
      </div>
    </Layout>
  );
};

export default ItemExchange;

export async function getServerSideProps(context) {
  const {
    getValidSessionByToken,
    getItemsRandomPriceRangeNotUserId,
    getItemByItemId,
    getItemsRandomNotUserId,
  } = await import('../util/database');

  const exchangeItemId = context.req.cookies.item;

  const exchangeItem = await getItemByItemId(Number(exchangeItemId));

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

  const priceMin = Math.floor(
    exchangeItem.itemPrice -
      (exchangeItem.itemPrice * exchangeItem.priceRange) / 100,
  );

  const priceMax = Math.ceil(
    exchangeItem.itemPrice +
      (exchangeItem.itemPrice * exchangeItem.priceRange) / 100,
  );

  /* const item = await getItemsRandomNotUserId(session.userId); */

  let itemPriceRange = await getItemsRandomPriceRangeNotUserId(
    session.userId,
    priceMin,
    priceMax,
  );

  if (itemPriceRange === undefined) {
    itemPriceRange = await getItemsRandomNotUserId(session.userId);
  }

  const user = session.userId;

  return {
    props: { itemPriceRange, user, exchangeItem },
  };
}
