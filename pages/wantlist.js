import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';

const Wantlist = (props) => {
  const router = useRouter();
  return (
    <Layout notificationLength={props.notificationLength}>
      <div className="max-w-7xl  mx-auto px-4 py-5 lg:py-10">
        <h1 className="mb-10 text-center text-3xl font-bold">WANTLIST</h1>
        {props.likedItems.length === 0 ? (
          <div className="text-bold text-center mb-4">EMPTY</div>
        ) : (
          <div>
            <h2 className="text-2xl text-left font-bold">You pressed YES</h2>
            <div>
              {props.likedItems.map((likedItem) => {
                return (
                  <div
                    key={`item-li-${likedItem.id}-${likedItem.userId}-${likedItem.itemId}`}
                  >
                    <div className="bg-blue-light">
                      <div className="m-4 py-2 grid grid-cols-2 gap-2 place-content-center">
                        <div className="my-auto">
                          <h3 className="text-2xl font-bold">
                            {likedItem.itemName}
                          </h3>
                          <div>{likedItem.itemPrice}€</div>
                          <div>{likedItem.description}</div>
                        </div>
                        <div className="w-full">
                          <img
                            className="object-scale-down"
                            src={likedItem.image}
                            alt={likedItem.itemName}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={async (event) => {
                        event.preventDefault();
                        await fetch(`/api/wantlist/${likedItem.id}`, {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                        });
                        router.reload();
                      }}
                      className="w-full shadow-lg mb-5 bg-red text-bright text-xl font-bold py-2 px-10 rounded hover:bg-red-light hover:text-dark"
                    >
                      DELETE
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wantlist;

export async function getServerSideProps(context) {
  const { getValidSessionByToken, getWantlistByUserId, getItemsByWantlistId } =
    await import('../util/database');

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

  const wantlistRows = await getWantlistByUserId(session.userId);

  const itemsArray = [];

  for (let i = 0; i < wantlistRows.length; i++) {
    itemsArray.push(
      await getItemsByWantlistId(wantlistRows[i].id, wantlistRows[i].itemId),
    );
  }

  const likedItems = itemsArray;

  return {
    props: { likedItems },
  };
}
