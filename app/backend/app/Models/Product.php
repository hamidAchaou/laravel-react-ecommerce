<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Product extends Model
{
    protected $keyType = 'int';

    protected $fillable = [
        'title',
        'description',
        'price',
        'stock',
        'category_id',
    ];

    /**
     * Relationships
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'product_id', 'id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'id');
    }

    public function wishlists()
    {
        return $this->hasMany(\App\Models\Wishlist::class);
    }

    /**
     * Check if this product is in the current user's wishlist
     */
    public function isInWishlist(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return $this->wishlists()->where('user_id', Auth::id())->exists();
    }
    /**
     * Helpers
     */
    public function mainImageUrl(): string
    {
        // Try to get the primary image first
        $image = $this->images()->where('is_primary', true)->first();

        // If no primary, fallback to first image
        if (!$image) {
            $image = $this->images()->first();
        }

        // Return image path if exists, otherwise a placeholder
        return $image
            ? asset('storage/' . $image->image_path)  // assumes images are stored in storage/app/public
            : asset('images/placeholders/product-placeholder.png');
    }
}