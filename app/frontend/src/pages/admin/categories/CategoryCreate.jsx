// src/pages/admin/categories/CategoryCreate.jsx
import React from "react";
import CategoriesForm from "./CategoryForm";
import { useDispatch } from "react-redux";
import { createCategory } from "../../../features/categories/categoriesThunks";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export default function CategoryCreate() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await dispatch(createCategory(data)).unwrap();
      enqueueSnackbar("Category created successfully!", { variant: "success" });
      navigate("/admin/categories");
    } catch (err) {
      enqueueSnackbar(err.message || "Failed to create category", {
        variant: "error",
      });
    }
  };

  return <CategoriesForm mode="create" onSubmit={handleCreate} />;
}
