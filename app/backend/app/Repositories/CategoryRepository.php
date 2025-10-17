<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CategoryRepository extends BaseRepository
{
    protected function model(): string
    {
        return Category::class;
    }

    /**
     * ✅ Create category with proper image handling
     */
    public function create(array $data): Model
    {
        try {
            // Handle image upload
            if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
                $imagePath = $data['image']->store('categories', 'public');
                $data['image'] = $imagePath;
            } else {
                // Remove image key if it's not a valid file
                unset($data['image']);
            }

            // Handle parent_id - convert empty string to null
            if (isset($data['parent_id']) && $data['parent_id'] === '') {
                $data['parent_id'] = null;
            }

            Log::info('Creating category with data:', $data);

            return parent::create($data);
        } catch (\Exception $e) {
            Log::error('CategoryRepository::create failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * ✅ Update category with image handling
     */
    public function update(array $data, mixed $id): Model
    {
        try {
            $category = $this->findOrFail($id);

            // Handle new image upload
            if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
                // Delete old image if exists
                if ($category->image && Storage::disk('public')->exists($category->image)) {
                    Storage::disk('public')->delete($category->image);
                }

                // Store new image
                $data['image'] = $data['image']->store('categories', 'public');
            } else {
                // Don't update image field if no new image provided
                unset($data['image']);
            }

            // Handle parent_id
            if (isset($data['parent_id']) && $data['parent_id'] === '') {
                $data['parent_id'] = null;
            }

            Log::info('Updating category with data:', $data);

            return parent::update($data, $id);
        } catch (\Exception $e) {
            Log::error('CategoryRepository::update failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * ✅ Delete category with image cleanup
     */
    public function delete(mixed $id): bool
    {
        try {
            $category = $this->find($id);

            if (!$category) {
                return false;
            }

            // Delete image from storage
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }

            return parent::delete($id);
        } catch (\Exception $e) {
            Log::error('CategoryRepository::delete failed: ' . $e->getMessage());
            throw $e;
        }
    }
}