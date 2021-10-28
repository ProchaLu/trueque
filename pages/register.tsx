import { useRouter } from 'next/router';
import React, { useState } from 'react';
import LayoutBeforeLogin from '../components/LayoutBeforeLogin';
import { Errors } from '../util/types';
import { RegisterResponse } from './api/register';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Errors>([]);

  const router = useRouter();

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
              }),
            });

            const registerJson =
              (await registerResponse.json()) as RegisterResponse;

            if ('errors' in registerJson) {
              setErrors(registerJson.errors);
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
          <div className="mb-10">
            <label className="block text-dark text-normal font-bold mb-2">
              Name
              <input
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                placeholder="E-Mail"
                value={mail}
                required
                onChange={(event) => setMail(event.currentTarget.value)}
              />{' '}
            </label>
          </div>
          <div className="mb-10">
            <label className="block text-dark text-normal font-bold mb-2">
              Address
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Address"
                value={address}
                onChange={(event) => setAddress(event.currentTarget.value)}
              />
            </label>
          </div>
          <div className="text-red mb-5">
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </div>
          <button className="w-full bg-blue text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark">
            REGISTER
          </button>
        </form>
        <button
          onClick={
            () =>
              console.log(
                `${username}, ${name}, ${password}, ${mail}, ${address} `,
              ) /* router.push('/') */
          }
          className=" w-full mt-10 bg-blue-dark text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
        >
          BACK
        </button>
      </div>
    </LayoutBeforeLogin>
  );
};

export default RegisterPage;
