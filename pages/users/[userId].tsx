import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { User } from '../../util/database';

type Props = {
  user: User;
};

const SingleUser = (props: Props) => {
  const router = useRouter();
  return (
    <Layout>
      <div className="max-w-7xl  mx-auto p-4 md:p-10 text-center">
        <h1 className="font-bold text-3xl m-10">Welcome {props.user.name}!</h1>
        <h2 className="font-bold text-2xl m-10">Let us start trading</h2>
        <button
          onClick={() => router.push('/addItem/')}
          className="w-full bg-blue text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
        >
          ADD ITEM
        </button>
      </div>
    </Layout>
  );
};

export default SingleUser;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getUser, getUserBySessionToken } = await import(
    '../../util/database'
  );

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
      props: {
        errors: [{ message: 'Not allowed' }],
      },
    };
  }

  const user = await getUser(Number(context.query.userId));

  return {
    props: {
      user: user,
    },
  };
}
