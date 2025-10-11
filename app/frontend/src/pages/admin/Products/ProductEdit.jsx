// src/pages/admin/Products/ProductEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductForm from "./ProductForm";
import { updateProduct } from "../../../features/products/productsThunks";
import { useSnackbar } from "notistack";

export default function ProductEdit() {
  const { id } = useParams();
  const { items: products } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const found = products.find((p) => p.id === parseInt(id));
    if (found) setProduct(found);
  }, [id, products]);

  if (!product) return <div>Loading...</div>;

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateProduct({ id: product.id, data }));
      enqueueSnackbar("Product updated successfully!", { variant: "success" });
      navigate("/admin/products");
    } catch (err) {
      enqueueSnackbar(err.message || "Update failed", { variant: "error" });
    }
  };

  return (
    <ProductForm
      mode="edit"
      defaultValues={product}
      onSubmit={handleUpdate}
    />
  );
}
