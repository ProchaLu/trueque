import { GetServerSidePropsContext } from 'next';
import Layout from '../components/Layout';

const tradeOverview = (props) => {
  return (
    <Layout>
      <div className="max-w-7xl  mx-auto px-4 py-5 lg:py-10">
        <h1 className="mb-5 text-center text-3xl font-bold">TRADE OVERVIEW</h1>
        <h3 className="text-2xl font-bold text-center mb-4">
          You confirmed the trade
        </h3>
        {props.tradelistHave.length === 0 ? (
          <div className="text-bold text-center mb-4">NONE</div>
        ) : (
          <div>
            {props.tradelistHave.map((tradelist) => {
              return (
                <div
                  key={`list-li-${tradelist.haveUserItemId}-${tradelist.wantUserId}-${tradelist.wantUserItemId}`}
                >
                  <div className="bg-blue-light">
                    <div className="text-center font-bold pt-2 ">
                      trade your "{tradelist.haveUserItemName}" for "
                      {tradelist.wantUserItemName}"
                    </div>
                    <div className="m-4 py-2 grid grid-cols-2 gap-2 place-content-center">
                      <div className="my-auto">
                        <h3 className="text-2xl font-bold">
                          {tradelist.haveUserItemName}
                        </h3>
                        <div>{tradelist.haveUserItemPrice}€</div>
                        <div>{tradelist.haveUserItemDescription}</div>
                      </div>
                      <div className="w-full">
                        <img
                          className="object-scale-down"
                          src={tradelist.haveUserItemImage}
                          alt={tradelist.haveUserItemName}
                        />
                      </div>
                    </div>
                    <div className="font-bold text-center">
                      YOU CONFIRMED THE TRADE WITH {tradelist.wantUserName}
                    </div>
                    <div className="m-4 py-2 grid grid-cols-2 gap-2 place-content-center">
                      <div className="my-auto">
                        <h3 className="text-2xl font-bold">
                          {tradelist.wantUserItemName}
                        </h3>
                        <div>{tradelist.wantUserItemPrice}€</div>
                        <div>{tradelist.wantUserItemDescription}</div>
                      </div>
                      <div className="w-full">
                        <img
                          className="object-scale-down"
                          src={tradelist.wantUserItemImage}
                          alt={tradelist.wantUserItemName}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <h3 className="text-2xl font-bold text-center mb-4">
          You started the trade
        </h3>
        {props.tradelistWant.length === 0 ? (
          <div className="text-bold text-center mb-4">NONE</div>
        ) : (
          <div>
            {props.tradelistWant.map((tradelist) => {
              return (
                <div
                  key={`list-li-${tradelist.wantUserId}-${tradelist.haveUserId}`}
                >
                  <div className="bg-blue-light">
                    <div className="text-center font-bold pt-2 ">
                      trade your "{tradelist.wantUserItemName}" for "
                      {tradelist.haveUserItemName}"
                    </div>
                    <div className="m-4 py-2 grid grid-cols-2 gap-2 place-content-center">
                      <div className="my-auto">
                        <h3 className="text-2xl font-bold">
                          {tradelist.wantUserItemName}
                        </h3>
                        <div>{tradelist.wantUserItemPrice}€</div>
                        <div>{tradelist.wantUserItemDescription}</div>
                      </div>
                      <div className="w-full">
                        <img
                          className="object-scale-down"
                          src={tradelist.wantUserItemImage}
                          alt={tradelist.wantUserItemName}
                        />
                      </div>
                    </div>
                    <div className="font-bold text-center">
                      {tradelist.haveUserName} CONFIRMED THE TRADE
                    </div>
                    <div className="m-4 py-2 grid grid-cols-2 gap-2 place-content-center">
                      <div className="my-auto">
                        <h3 className="text-2xl font-bold">
                          {tradelist.haveUserItemName}
                        </h3>
                        <div>{tradelist.haveUserItemPrice}€</div>
                        <div>{tradelist.haveUserItemDescription}</div>
                      </div>
                      <div className="w-full">
                        <img
                          className="object-scale-down"
                          src={tradelist.haveUserItemImage}
                          alt={tradelist.haveUserItemName}
                        />
                      </div>
                    </div>
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

export default tradeOverview;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    getValidSessionByToken,
    getTradelistByItemUserId,
    getTradelistByUserId,
    getTradelistForUserWant,
    getTradelistForUserHave,
  } = await import('../util/database');

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

  const tradelistByUserWant = await getTradelistByUserId(session.userId);

  const tradelistByUserHave = await getTradelistByItemUserId(session.userId);

  // TRADELIST BY WANT ITEM

  const tradelistWantArrayByWantItem = [];

  for (let i = 0; i < tradelistByUserWant.length; i++) {
    tradelistWantArrayByWantItem.push(
      await getTradelistForUserWant(
        tradelistByUserWant[i].userId,
        tradelistByUserWant[i].userExchangeItemId,
      ),
    );
  }

  const tradelistWantArrayByHaveItem = [];

  for (let i = 0; i < tradelistByUserWant.length; i++) {
    tradelistWantArrayByHaveItem.push(
      await getTradelistForUserHave(
        tradelistByUserWant[i].itemUserId,
        tradelistByUserWant[i].itemId,
      ),
    );
  }

  const tradelistWant = [];

  for (let i = 0; i < tradelistByUserWant.length; i++) {
    tradelistWant[i] = Object.assign(
      tradelistWantArrayByWantItem[i],
      tradelistWantArrayByHaveItem[i],
    );
  }

  // TRADELIST BY HAVE ITEM

  const tradelistHaveArrayByWanttItem = [];

  for (let i = 0; i < tradelistByUserHave.length; i++) {
    tradelistHaveArrayByWanttItem.push(
      await getTradelistForUserWant(
        tradelistByUserHave[i].userId,
        tradelistByUserHave[i].userExchangeItemId,
      ),
    );
  }

  const tradelistHaveArrayByHaveItem = [];

  for (let i = 0; i < tradelistByUserHave.length; i++) {
    tradelistHaveArrayByHaveItem.push(
      await getTradelistForUserHave(
        tradelistByUserHave[i].itemUserId,
        tradelistByUserHave[i].itemId,
      ),
    );
  }

  const tradelistHave = [];

  for (let i = 0; i < tradelistByUserHave.length; i++) {
    tradelistHave[i] = Object.assign(
      tradelistHaveArrayByWanttItem[i],
      tradelistHaveArrayByHaveItem[i],
    );
  }

  return {
    props: { tradelistWant, tradelistHave },
  };
}
