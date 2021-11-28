import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { List, ListItem, Range } from 'tailwind-mobile/react';
import Layout from '../components/Layout';
import { Item } from '../util/database';
import { Errors } from '../util/types';

type Props = {
  notificationLength?: number;
  editItem: Item;
};

const EditItem = (props: Props) => {
  const [newPriceRange, setNewPriceRange] = useState('10');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newDescription, setNewDescription] = useState('');
  const [errors] = useState<Errors>([]);

  const router = useRouter();

  const updateItem = async (
    id: number,
    itemName: string,
    itemPrice: number,
    description: string,
    priceRange: string,
  ) => {
    await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemName: itemName,
        itemPrice: itemPrice,
        description: description,
        priceRange: priceRange,
      }),
    });
  };

  return (
    <Layout notificationLength={props.notificationLength}>
      <div className="max-w-7xl my-2 mx-auto px-4 py-5 text-xl lg:py-10 ">
        <h1 className="mb-10 text-center text-3xl font-bold">EDIT ITEM</h1>
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
              onChange={(e) => setNewItemName(e.currentTarget.value)}
            />
            <div>
              Name now:{' '}
              <span className="font-bold">{props.editItem.itemName}</span>
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
              onChange={(e) => setNewItemPrice(Number(e.currentTarget.value))}
            />
            <div>
              Price now:{' '}
              <span className="font-bold">{props.editItem.itemPrice}€</span>
            </div>
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

            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Description"
              required
              onChange={(e) => setNewDescription(e.currentTarget.value)}
            />
            <div>
              Description now:{' '}
              <span className="font-bold">{props.editItem.description}</span>
            </div>
          </div>
          <div className="font-bold">
            <div>Price Range: {newPriceRange}%</div>
            <List className="range-thumb-bg-dark">
              <ListItem
                innerClassName="flex space-x-4"
                innerChildren={
                  <>
                    <span>0%</span>
                    <Range
                      className="border"
                      value={Number(newPriceRange)}
                      step={1}
                      min={0}
                      max={100}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewPriceRange(e.currentTarget.value)
                      }
                    />
                    <span>100%</span>
                  </>
                }
              />
            </List>
            <div>
              Range now:{' '}
              <span className="font-bold">{props.editItem.priceRange}%</span>
            </div>{' '}
          </div>
          <div className="text-red mb-5">
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </div>
          <div>
            {newItemName && newItemPrice > 0 ? (
              <button
                onClick={() =>
                  updateItem(
                    props.editItem.id,
                    newItemName,
                    newItemPrice,
                    newDescription,
                    newPriceRange,
                  )
                }
                className="w-full bg-blue shadow-lg text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
              >
                EDIT ITEM
              </button>
            ) : (
              ''
            )}
          </div>
          <button
            onClick={() => router.push('/itempage/')}
            className="w-full shadow-lg mt-5 bg-blue-dark text-bright text-xl font-bold py-2 px-10 rounded hover:bg-blue-light hover:text-dark"
          >
            BACK
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditItem;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken, getItemByItemId } = await import(
    '../util/database'
  );

  const editItemId: string = context.req.cookies.item;

  const editItem = await getItemByItemId(Number(editItemId));

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
    props: { editItem },
  };
}
