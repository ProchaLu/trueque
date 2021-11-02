import Link from 'next/link';
import React, { useState } from 'react';
import { List, ListItem, Range } from 'tailwind-mobile/react';
import Layout from '../components/Layout';

const AddItem = (props) => {
  const [priceRange, setPriceRange] = useState(10);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(0);
  const [itemDescription, setItemDescription] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const uploadImage = async (e) => {
    const files = e.currentTarget.files;
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

  return (
    <Layout>
      <div className="max-w-7xl my-2 mx-auto px-4 py-5 text-xl lg:py-10 ">
        <h1 className="mb-10 text-center text-3xl font-bold">ADD ITEM</h1>
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
            onChange={(e) => setItemPrice(e.currentTarget.value)}
          />
        </div>
        <div className="mb-10">
          <label
            htmlFor="itemDescription"
            className="block text-dark text-normal font-bold mb-2"
          >
            Description
            <span className="text-sm font-normal">
              (optional. Keep it short)
            </span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
            id="itemDescription"
            placeholder="Description"
            required
            onChange={(e) => setItemDescription(e.currentTarget.value)}
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
        <div>
          {itemName && itemPrice > 0 ? (
            <button
              className="w-full bg-blue text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
              onClick={() =>
                console.log(
                  itemName,
                  image,
                  itemPrice,
                  itemDescription,
                  priceRange,
                )
              }
            >
              ADD ITEM
            </button>
          ) : (
            ''
          )}
        </div>
        <Link href="/itempage/" passHref>
          <button className="w-full mt-10 bg-blue-dark text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark">
            BACK
          </button>
        </Link>
      </div>
    </Layout>
  );
};

export default AddItem;

export async function getServerSideProps(context) {
  const { getValidSessionByToken } = await import('../util/database');

  const sessionToken = context.req.cookies.sessionToken;

  const session = await getValidSessionByToken(sessionToken);

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
    props: {},
  };
}
