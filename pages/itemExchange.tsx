import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Layout from '../components/Layout';
import image from '../public/images/NIKE.jpeg';

const itemExchange = () => {
  return (
    <Layout>
      <div className="max-w-7xl text-center  mx-auto p-4 md:p-10">
        <h1 className="mb-10 text-3xl font-bold">ITEM EXCHANGE</h1>
        <div className="text-left">ITEM NAME</div>
        <div className="">ITEM PRICE</div>
        <div className="border my-10 mx-auto max-w-lg">
          <Image src={image} alt="placeholder" />
        </div>
        <div className="m-10">ITEM DESCRIPTION</div>
        <div className="grid grid-cols-2 gap-2 place-items-center justify-items-center">
          <button className="rounded-full h-40 w-40 flex items-center justify-center bg-red text-bright text-3xl">
            NO
          </button>
          <button className="rounded-full h-40 w-40 flex items-center justify-center bg-green text-bright text-3xl">
            YES
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default itemExchange;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../util/database');

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

  return {
    props: {},
  };
}