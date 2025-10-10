// src/pages/admin/Products/ProductEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductForm from "./ProductForm";

export default function ProductEdit() {
  const { id } = useParams();
  const { items: products } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find((p) => p.id === parseInt(id));
    if (found) setProduct(found);
  }, [id, products]);

  if (!product) return <div>Loading...</div>;

  return <ProductForm mode="edit" defaultValues={product} onSubmit={() => {}} />;
}
