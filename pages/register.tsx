import { useLoadScript } from '@react-google-maps/api';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import LayoutBeforeLogin from '../components/LayoutBeforeLogin';
import { Errors } from '../util/types';
import { RegisterResponse } from './api/register';

type Props = {
  refreshUsername: () => void;
  csrfToken: string;
  googleAPI: string;
};

const RegisterPage = (props: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const router = useRouter();

  const libraries: string[] = ['places'];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: props.googleAPI,
    libraries,
  });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  const handleChange = (value: string) => {
    setAddress(value);
  };

  const handleSelect = async (value: string) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setLat(latLng.lat);
    setLng(latLng.lng);
  };

  return (
    <LayoutBeforeLogin>
      <div className="max-w-7xl my-2 mx-auto px-4 py-5 text-xl lg:py-10 ">
        <h1 className="mb-10 text-center text-3xl font-bold">
          USER REGISTRATION
        </h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const registerResponse = await fetch('/api/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: password,
                name: name,
                mail: mail,
                address: address,
                lat: lat,
                lng: lng,
                csrfToken: props.csrfToken,
              }),
            });

            const registerJson =
              (await registerResponse.json()) as RegisterResponse;

            if ('errors' in registerJson) {
              setErrors(registerJson.errors);
              return;
            }

            const destination =
              typeof router.query.returnTo === 'string' && router.query.returnTo
                ? router.query.returnTo
                : `/users/${registerJson.user.id}`;

            props.refreshUsername();

            router.push(destination);
          }}
        >
          <div className="mb-10">
            <label className="block text-dark text-normal font-bold mb-2">
              Username
              <input
                data-cy="registerUsername"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Username"
                value={username}
                required
                onChange={(event) => setUsername(event.currentTarget.value)}
              />
            </label>
          </div>
          <div className="mb-10">
            <label className="block text-dark text-normal font-bold mb-2">
              Password
              <input
                data-cy="registerPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </label>
          </div>
          <div className="mb-10">
            <label className="block text-dark text-normal font-bold mb-2">
              Name
              <input
                data-cy="registerName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Name"
                value={name}
                required
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </label>
          </div>
          <div className="mb-10">
            <label className="block text-dark text-normal font-bold mb-2">
              E-Mail
              <input
                data-cy="registerMail"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                placeholder="E-Mail"
                value={mail}
                required
                onChange={(event) => setMail(event.currentTarget.value)}
              />
            </label>
          </div>
          <div className="mb-10">
            <div className="block text-dark text-normal font-bold mb-2">
              Address
              <div>
                <PlacesAutocomplete
                  value={address}
                  onChange={handleChange}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <input
                        data-cy="registerAddress"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                        {...getInputProps({ placeholder: 'Address' })}
                      />
                      <div>
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const style = suggestion.active
                            ? { backgroundColor: '#BBE1FA', cursor: 'pointer' }
                            : { backgroundColor: '#fff', cursor: 'pointer' };
                          return (
                            <div key={`li-suggestion-${suggestion.placeId}`}>
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  style,
                                })}
                              >
                                {suggestion.description}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
            </div>
          </div>
          <div className="text-red mb-5">
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </div>
          <button
            data-cy="registerButton"
            className="w-full bg-blue text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
          >
            REGISTER
          </button>
        </form>
        <button
          onClick={() => router.push('/')}
          className=" w-full mt-10 bg-blue-dark text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
        >
          BACK
        </button>
      </div>
    </LayoutBeforeLogin>
  );
};

export default RegisterPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../util/database');
  const { createToken } = await import('../util/csrf');

  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/register`,
        permanent: true,
      },
    };
  }
  const googleAPI = process.env.GOOGLE_API_KEY;

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

  if (session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: createToken(),
      googleAPI,
    },
  };
}
