import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { getItemByItemId } from '../util/database';
import { Errors } from '../util/types';
import { RegisterResponse } from './api/wantlist';

const ItemExchange = (props) => {
  const router = useRouter();

  const [errors, setErrors] = useState<Errors>([]);

  const onClickYes = async (event) => {
    event.preventDefault();

    const registerResponse = await fetch('api/wantlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.user,
        userExchangeItemId: props.exchangeItem.id,
        itemUserId: props.item.userId,
        itemId: props.item.id,
      }),
    });
    const addWantlistJson = (await registerResponse.json()) as RegisterResponse;
    if ('errors' in addWantlistJson) {
      setErrors(addWantlistJson.errors);
      return;
    }
    const destination =
      typeof router.query.returnTo === 'string' && router.query.returnTo
        ? router.query.returnTo
        : '/itemExchange';

    props.refreshUsername();

    router.push(destination);
  };

  return (
    <Layout>
      <div className="max-w-7xl text-center  mx-auto p-4 md:p-10">
        <h1 className="mb-2 text-3xl font-bold">ITEM EXCHANGE</h1>
        <h2 className="text-2xl text-left font-bold">
          exchange "{props.exchangeItem.itemName}" for:
        </h2>

        <div className="text-left text-xl font-bold">{props.item.itemName}</div>
        <div className="text-left font-bold">{props.item.itemPrice}€</div>
        <div className="border my-5 mx-auto max-w-lg">
          <img src={props.item.image} alt={props.item.itemName} />
        </div>
        <div className="grid grid-cols-2 gap-2 place-items-center justify-items-center">
          <button
            onClick={() => router.reload()}
            className="rounded-full h-40 w-40 border-2 border-dark flex items-center justify-center bg-red text-bright text-3xl"
          >
            NO
          </button>
          <button
            onClick={onClickYes}
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
          Description: {props.item.description}
        </div>
      </div>
    </Layout>
  );
};

export default ItemExchange;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken, getItemsRandomNotUserId } = await import(
    '../util/database'
  );

  const exchangeItemId = context.req.cookies.item;

  const exchangeItem = await getItemByItemId(exchangeItemId);

  console.log(exchangeItem);

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

  const item = await getItemsRandomNotUserId(session.userId);

  console.log(item);

  const user = session.userId;

  return {
    props: { item, user, exchangeItem },
  };
}
