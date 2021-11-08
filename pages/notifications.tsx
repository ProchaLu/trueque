import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';

const Notifications = (props) => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-5 lg:py-10">
        <h1 className="mb-10 text-center text-3xl font-bold">NOTIFICATIONS</h1>
        <div>
          {props.notificationsArray.map((list) => {
            return (
              <div key={`list-li-${list.id}`}>
                <div>
                  User {list.username} wants your Item {list.itemName}!
                </div>
                <Link href={`mailto:${list.mail}`} passHref>
                  <button className="w-full shadow-lg bg-blue-dark text-bright text-xl font-bold py-2 mb-10 px-10 rounded hover:bg-blue-light hover:text-dark">
                    MAIL TO USER {list.username}
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

export default Notifications;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken, getWantlistbyItemUserId, getAll } =
    await import('../util/database');

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

  console.log(notificationUserList);

  const notificationsArray = [];

  for (let i = 0; i < notificationUserList.length; i++) {
    notificationsArray.push(
      await getAll(
        notificationUserList[i].userId,
        notificationUserList[i].itemId,
      ),
    );
  }

  console.log(notificationsArray);

  return {
    props: { notificationsArray, notificationUserList },
  };
}
