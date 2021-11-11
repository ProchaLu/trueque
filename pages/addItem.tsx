import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { List, ListItem, Range } from 'tailwind-mobile/react';
import Layout from '../components/Layout';
import { Errors } from '../util/types';
import { RegisterResponse } from './api/itemRegister';

type Props = {
  refreshUsername: () => void;
  userId: number;
};

const AddItem = (props: Props) => {
  const [priceRange, setPriceRange] = useState(10);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>([]);

  const router = useRouter();

  const userId = props.userId;

  const uploadImage = async (event) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'truequeUpload');
    setLoading(true);
    const res = await fetch(
      '	https://api.cloudinary.com/v1_1/trueque-image/upload',
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await res.json();

    setImage(file.secure_url);
    setLoading(false);
  };

  const AddItemWithImage = async () => {
    const registerResponse = await fetch('/api/itemRegister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName: itemName,
        userId: userId,
        itemPrice: itemPrice,
        description: description,
        priceRange: priceRange,
        image: image,
      }),
    });

    const addItemJson = (await registerResponse.json()) as RegisterResponse;

    if ('errors' in addItemJson) {
      setErrors(addItemJson.errors);
      return;
    }
    props.refreshUsername();
  };

  const onClickAddItem = () => {
    AddItemWithImage();
    router.push('/itempage/');
  };

  return (
    <Layout>
      <div className="max-w-7xl my-2 mx-auto px-4 py-5 text-xl lg:py-10 ">
        <h1 className="mb-10 text-center text-3xl font-bold">ADD ITEM</h1>
        <form>
          <div className="mb-10">
            <label
              htmlFor="itemName"
              className="block text-dark text-normal font-bold mb-2"
            >
              Item Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
              id="itemName"
              placeholder="Item Name"
              required
              onChange={(e) => setItemName(e.currentTarget.value)}
            />
          </div>
          <div className="mb-10">
            <label
              htmlFor="picture"
              className="block text-dark text-normal font-bold mb-2"
            >
              Image
            </label>
            <input
              className="w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
              id="file"
              type="file"
              required
              placeholder="Upload an image"
              onChange={uploadImage}
            />
            <div className="w-1/2 mx-auto">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <img src={image} className="mt-4" alt="upload" />
              )}
            </div>
          </div>
          <div className="mb-10">
            <label
              htmlFor="itemPrice"
              className="block text-dark text-normal font-bold mb-2"
            >
              Price in €
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
              id="itemPrice"
              type="number"
              placeholder="Price"
              required
              onChange={(e) => setItemPrice(Number(e.currentTarget.value))}
            />
          </div>
          <div className="mb-10">
            <label
              htmlFor="description"
              className="block text-dark text-normal font-bold mb-2"
            >
              Description
              <span className="text-sm font-normal">
                (optional. Keep it short)
              </span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Description"
              required
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </div>
          <div className="font-bold">
            <div>Price Range: {priceRange}%</div>
            <List className="range-thumb-bg-dark">
              <ListItem
                innerClassName="flex space-x-4"
                innerChildren={
                  <>
                    <span>0%</span>
                    <Range
                      className="border"
                      value={priceRange}
                      step={1}
                      min={0}
                      max={100}
                      onChange={(e) => setPriceRange(e.currentTarget.value)}
                    />
                    <span>100%</span>
                  </>
                }
              />
            </List>
          </div>
          <div className="text-red mb-5">
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </div>
          <div>
            {itemName && itemPrice > 0 ? (
              <button
                onClick={onClickAddItem}
                className="w-full bg-blue shadow-lg text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
              >
                ADD ITEM
              </button>
            ) : (
              ''
            )}
          </div>
          <button
            onClick={() => router.push('/itempage/')}
            className="w-full shadow-lg mt-10 bg-blue-dark text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
          >
            BACK
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddItem;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../util/database');

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

  const userId = session.userId;

  if (!session) {
    // Redirect the user when they have a session
    // token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: '/login?returnTo=/addItem',
        permanent: false,
      },
    };
  }

  return {
    props: { userId },
  };
}
