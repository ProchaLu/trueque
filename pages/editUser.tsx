import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { User } from '../util/database';
import { Errors } from '../util/types';

type Props = {
  notificationLength?: number;
  user: User;
};

const EditUser = (props: Props) => {
  const [newName, setNewName] = useState('');
  const [newMail, setNewMail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [errors] = useState<Errors>([]);

  const router = useRouter();

  const updateUser = async (
    id: number,
    name: string,
    mail: string,
    address: string,
  ) => {
    await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        mail: mail,
        address: address,
      }),
    });
  };

  return (
    <Layout notificationLength={props.notificationLength}>
      <div className="max-w-7xl my-2 mx-auto px-4 py-5 text-xl lg:py-10 ">
        <h1 className="mb-10 text-center text-3xl font-bold">EDIT USER</h1>
        <form>
          <div className="mb-10">
            <label
              htmlFor="name"
              className="block text-dark text-normal font-bold mb-2"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              placeholder="Name"
              required
              onChange={(e) => setNewName(e.currentTarget.value)}
            />
            <div>
              Name now: <span className="font-bold">{props.user.name}</span>
            </div>
          </div>
          <div className="mb-10">
            <label
              htmlFor="mail"
              className="block text-dark text-normal font-bold mb-2"
            >
              Mail
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
              id="mail"
              placeholder="Mail"
              required
              onChange={(e) => setNewMail(e.currentTarget.value)}
            />
            <div>
              Mail now: <span className="font-bold">{props.user.mail}</span>
            </div>
          </div>
          <div className="mb-10">
            <label
              htmlFor="address"
              className="block text-dark text-normal font-bold mb-2"
            >
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
              id="itemName"
              placeholder="Name"
              required
              onChange={(e) => setNewAddress(e.currentTarget.value)}
            />
            <div>
              Address now:{' '}
              <span className="font-bold">{props.user.address}</span>
            </div>
          </div>
          <div className="text-red mb-5">
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </div>
        </form>

        <div>
          {newName.length && newMail.length && newAddress.length > 0 ? (
            <button
              onClick={() =>
                updateUser(props.user.id, newName, newMail, newAddress)
              }
              className="w-full bg-blue shadow-lg text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
            >
              EDIT USER
            </button>
          ) : (
            ''
          )}
        </div>
        <button
          onClick={() => router.push('/users/')}
          className="w-full shadow-lg mt-5 bg-blue-dark text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
        >
          BACK
        </button>
      </div>
    </Layout>
  );
};

export default EditUser;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken, getUser } = await import('../util/database');

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

  const user = await getUser(session.userId);

  return {
    props: { user },
  };
}
