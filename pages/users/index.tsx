const UserIndex = () => {
  return <div>UserIndex</div>;
};

export default UserIndex;

export async function getServerSideProps(context) {
  const { getValidSessionByToken } = await import('../../util/database');

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } else if (session) {
    return {
      redirect: {
        destination: `/users/${session.userId}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
