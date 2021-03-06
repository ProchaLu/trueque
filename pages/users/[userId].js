import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

const SingleUser = (props) => {
  const router = useRouter();
  const [notificationLength, setNotificationLength] = useState();

  const deleteUser = async (id) => {
    await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    router.push('/');
  };

  useEffect(() => {
    setNotificationLength(props.notificationLength);
  }, [props.notificationLength]);

  console.log(notificationLength);

  return (
    <Layout notificationLength={props.notificationLength}>
      <div className="max-w-7xl  mx-auto p-4 md:p-10 text-center">
        <h1 className="font-bold text-3xl m-10">Welcome {props.user.name}!</h1>
        <h2 className="font-bold text-2xl m-10">Let us start trading</h2>
        <button
          data-cy="itemPage"
          onClick={() => router.push('/itempage/')}
          className="w-full bg-blue text-bright text-xl font-bold py-2 px-10  mb-5 rounded hover:bg-blue-light hover:text-dark"
        >
          ITEM PAGE
        </button>
        <button
          onClick={() => router.push('/addItem/')}
          className="w-full bg-blue-dark text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
        >
          ADD ITEM
        </button>
        <h2 className="font-bold text-2xl m-10">{props.user.name}'s profile</h2>
        <button
          onClick={() => router.push('/editUser/')}
          className="w-full bg-blue text-bright text-xl font-bold py-2 px-10  mb-5 rounded hover:bg-blue-light hover:text-dark"
        >
          EDIT USER
        </button>
        <button
          data-cy="profileDelete"
          onClick={() => deleteUser(props.user.id)}
          className="w-full bg-red text-bright text-xl font-bold py-2 px-10 rounded hover:bg-red-light hover:text-dark"
        >
          DELETE USER
        </button>
      </div>
    </Layout>
  );
};

export default SingleUser;

export async function getServerSideProps(context) {
  const { getUser, getUserBySessionToken, getWantlistbyItemUserId } =
    await import('../../util/database');

  const sessionToken = context.req.cookies.sessionToken;

  // Authorization: Allow only specific user
  const sessionUser = await getUserBySessionToken(sessionToken);

  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?returnTo=${context.req.url}`,
      },
    };
  }

  if (sessionUser.id !== Number(context.query.userId)) {
    return {
      redirect: {
        permanent: false,
        destination: `/users/`,
      },
    };
  }

  const user = await getUser(Number(context.query.userId));

  const tradeNotification = await getWantlistbyItemUserId(user.id);

  const notificationLength = tradeNotification.length;

  return {
    props: {
      user: user,
      notificationLength: notificationLength,
    },
  };
}
