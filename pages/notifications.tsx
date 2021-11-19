import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Errors } from '../util/types';
import { RegisterResponse } from './api/tradelist/tradelist';

const Notifications = (props) => {
  const router = useRouter();

  const [errors, setErrors] = useState<Errors>([]);

  return (
    <Layout notificationLength={props.notificationLength}>
      <div className="max-w-7xl mx-auto px-4 py-5 lg:py-10">
        <h1 className="mb-10 text-center text-3xl font-bold">NOTIFICATIONS</h1>
        {props.wantlist.length === 0 ? (
          <div className="text-bold text-center mb-4">EMPTY</div>
        ) : (
          <div>
            {props.wantlist.map((list) => {
              return (
                <div
                  key={`list-li-${list.wantUserId}-${list.haveUserId}-${list.wantUserItemId}-${list.haveUserItemId}`}
                >
                  <div className="bg-blue-light">
                    <div className="m-4 py-2 grid grid-cols-2 gap-2 place-content-center">
                      <div className="my-auto">
                        <h3 className="text-2xl font-bold">
                          {list.wantUserItemName}
                        </h3>
                        <div>{list.wantUserItemPrice}€</div>
                        <div>{list.wantUserItemDescription}</div>
                      </div>
                      <div className="w-full">
                        <img
                          className="object-scale-down"
                          src={list.wantUserItemImage}
                          alt={list.wantUserItemName}
                        />
                      </div>
                    </div>
                    <div className="font-bold text-center">
                      {list.wantUserName} WANTS A TRADE WITH YOUR
                    </div>
                    <div className="m-4 py-2 grid grid-cols-2 gap-2 place-content-center">
                      <div className="my-auto">
                        <h3 className="text-2xl font-bold">
                          {list.haveUserItemName}
                        </h3>
                        <div>{list.haveUserItemPrice}€</div>
                        <div>{list.haveUserItemDescription}</div>
                      </div>
                      <div className="w-full">
                        <img
                          className="object-scale-down"
                          src={list.haveUserItemImage}
                          alt={list.haveUserItemName}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        router.push(
                          `mailto:${list.wantUserMail}?subject=Trueque%20Item%20Change%20${list.wantUserItemName}%20with%20${list.haveUserItemName}`,
                        )
                      }
                      className="w-full shadow-lg bg-blue text-bright text-xl font-bold py-2 mb-5 px-10 rounded hover:bg-blue-light hover:text-dark"
                    >
                      MAIL
                    </button>
                    <button
                      onClick={async (event) => {
                        event.preventDefault();
                        await fetch(
                          `http://localhost:3000/api/wantlist/${list.id}`,
                          {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                          },
                        );
                        router.reload();
                      }}
                      className="w-auto shadow-lg bg-red text-bright text-xl font-bold py-2 mb-5 px-10 rounded hover:bg-red-light hover:text-dark"
                    >
                      DELETE
                    </button>
                  </div>
                  <button
                    onClick={async (event) => {
                      event.preventDefault();
                      await fetch(
                        `http://localhost:3000/api/wantlist/${list.id}`,
                        {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                        },
                      );
                      const registerResponse = await fetch(
                        'api/tradelist/tradelist',
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            userId: list.wantUserId,
                            userExchangeItemId: list.wantUserItemId,
                            itemUserId: list.haveUserId,
                            itemId: list.haveUserItemId,
                          }),
                        },
                      );
                      const addTradelistJson =
                        (await registerResponse.json()) as RegisterResponse;
                      if ('errors' in addTradelistJson) {
                        setErrors(addTradelistJson.errors);
                        return;
                      }
                      router.reload();
                    }}
                    className="w-full shadow-lg bg-blue-dark text-bright text-xl font-bold py-2 mb-5 px-10 rounded hover:bg-blue-light hover:text-dark"
                  >
                    TRADE
                  </button>
                  <div className="text-red mb-2">
                    {errors.map((error) => (
                      <div key={`error-${error.message}`}>{error.message}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    getValidSessionByToken,
    getWantlistbyItemUserId,
    getWantlistAll,
    getHavelistAll,
  } = await import('../util/database');

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

  const notificationUserList = await getWantlistbyItemUserId(session.userId);

  const wantlistArray = [];

  for (let i = 0; i < notificationUserList.length; i++) {
    wantlistArray.push(
      await getWantlistAll(
        notificationUserList[i].id,
        notificationUserList[i].userId,
        notificationUserList[i].userExchangeItemId,
      ),
    );
  }

  const havelistArray = [];

  for (let i = 0; i < notificationUserList.length; i++) {
    havelistArray.push(
      await getHavelistAll(
        notificationUserList[i].itemUserId,
        notificationUserList[i].itemId,
      ),
    );
  }

  const wantlist = [];

  for (let i = 0; i < wantlistArray.length; i++) {
    wantlist[i] = Object.assign(wantlistArray[i], havelistArray[i]);
  }

  return {
    props: { wantlist },
  };
}
