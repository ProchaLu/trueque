import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import LayoutBeforeLogin from '../components/LayoutBeforeLogin';
import { Errors } from '../util/types';
import { LoginResponse } from './api/login';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  return (
    <LayoutBeforeLogin>
      <div className="max-w-7xl my-2 mx-auto px-4 py-5 text-xl lg:py-10">
        <h1 className="mb-10 text-center text-3xl font-bold">LOGIN</h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const loginResponse = await fetch('/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                password: password,
              }),
            });

            const loginJson = (await loginResponse.json()) as LoginResponse;

            if ('errors' in loginJson) {
              setErrors(loginJson.errors);
              return;
            }
            router.push('/itempage/');
          }}
        >
          <div className="mb-10">
            <label className="block text-dark text-normal font-bold mb-2">
              Username
              <input
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </label>
          </div>
          <button className="w-full bg-blue text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark">
            LOG IN
          </button>
        </form>
        <button
          onClick={() => router.push('/')}
          className="w-full mt-10 bg-blue-dark text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
        >
          BACK
        </button>

        <div className="text-dark">
          {errors.map((error) => (
            <div key={`error-${error.message}`}>{error.message}</div>
          ))}
        </div>
      </div>
    </LayoutBeforeLogin>
  );
};

export default LoginPage;
