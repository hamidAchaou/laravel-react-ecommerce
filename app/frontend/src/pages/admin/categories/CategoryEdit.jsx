// src/pages/admin/categories/CategoryEdit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CategoriesForm from "./CategoryForm";
import { updateCategory } from "../../../features/categories/categoriesThunks";
import { useSnackbar } from "notistack";

export default function CategoryEdit() {
  const { id } = useParams();
  const { items: categories = [] } = useSelector((state) => state.categories);
  const [category, setCategory] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const found = categories.find((c) => c.id === parseInt(id));
    if (found) setCategory(found);
  }, [id, categories]);

  if (!category) return <div>Loading...</div>;

  const handleUpdate = async (data) => {
    try {
      await dispatch(updateCategory({ id: category.id, data })).unwrap();
      enqueueSnackbar("Category updated successfully!", { variant: "success" });
      navigate("/admin/categories");
    } catch (err) {
      enqueueSnackbar(err.message || "Update failed", { variant: "error" });
    }
  };

  return (
    <CategoriesForm
      mode="edit"
      defaultValues={category}
      onSubmit={handleUpdate}
    />
  );
}
