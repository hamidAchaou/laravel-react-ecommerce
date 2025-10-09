import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../../features/products/productsThunks";

export default function Products() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts()).then((res) => console.log("🟢 Fetched products thunk result:", res));
  }, [dispatch]);

  console.log("🟣 Redux products state:", items);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Products</h2>
      {items.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {items.map((p) => (
            <li key={p.id}>
              {p.title ?? "(No name)"} — {p.price} MAD
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
