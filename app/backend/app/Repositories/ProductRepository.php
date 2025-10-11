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
     * Update product with provided data and optionally handle images.
     */
    public function update(array $data, mixed $id): Model
    {
        $product = $this->findOrFail($id);

        // Update main fields
        $fields = ['title', 'description', 'price', 'stock', 'category_id'];
        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $product->$field = $data[$field];
            }
        }

        $product->save();

        // Handle images if included
        if (isset($data['images']) && is_array($data['images'])) {
            $primaryIndex = $data['primary_image_index'] ?? 0;

            // Reset old primary flags
            $product->images()->update(['is_primary' => false]);

            foreach ($data['images'] as $index => $img) {
                if (isset($img['file'])) {
                    $path = $img['file']->store('products', 'public');

                    $product->images()->create([
                        'image_path' => $path,
                        'is_primary' => $index === $primaryIndex,
                    ]);
                } else if (isset($img['id'])) {
                    // If existing image, just update primary flag
                    $product->images()->where('id', $img['id'])
                        ->update(['is_primary' => $index === $primaryIndex]);
                }
            }
        }

        return $product->fresh(['category', 'images']);
    }
}