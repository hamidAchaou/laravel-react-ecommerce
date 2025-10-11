<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

class ProductRepository extends BaseRepository
{
    protected function model(): string
    {
        return Product::class;
    }

    /**
     * Update product with only provided data.
     */
    public function update(array $data, mixed $id): Model
    {
        $product = $this->findOrFail($id);

        $product->fill([
            'title' => $data['title'] ?? $product->title,
            'description' => $data['description'] ?? $product->description,
            'price' => $data['price'] ?? $product->price,
            'stock' => $data['stock'] ?? $product->stock,
            'category_id' => $data['category_id'] ?? $product->category_id,
        ]);

        $product->save();

        return $product->fresh(['category', 'images']);
    }
}