<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Get all subcategories (exclude parent category)
        $subCategories = Category::whereNotNull('parent_id')->get();

        foreach ($subCategories as $category) {
            $productsData = $this->getProductsByCategory($category->name);

            foreach ($productsData as $data) {
                // Create or update product
                $product = Product::updateOrCreate(
                    ['title' => $data['title'], 'category_id' => $category->id],
                    [
                        'description' => $data['description'] ?? "High-quality Moroccan {$category->name} product.",
                        'price'       => $data['price'],
                        'stock'       => $data['stock'],
                        'category_id' => $category->id,
                    ]
                );

                // Attach images
                $this->attachImages($product, $data['images'] ?? []);
            }
        }
    }

    /**
     * Return product array for each category
     */
    private function getProductsByCategory(string $categoryName): array
    {
        $imageBasePath = 'products/'; // storage/app/public/products/

        $products = [
            'Textiles & Weaving' => [
                [
                    'title' => 'Handwoven Moroccan Carpet',
                    'price' => 120,
                    'stock' => 10,
                    'images' => [
                        $imageBasePath . 'handwoven_carpet_1.jpg',
                        $imageBasePath . 'handwoven_carpet_2.jpg',
                        $imageBasePath . 'handwoven_carpet_3.jpg',
                    ],
                ],
                [
                    'title' => 'Traditional Jellaba',
                    'price' => 80,
                    'stock' => 15,
                    'images' => [
                        $imageBasePath . 'traditional_jellaba_1.jpg',
                        $imageBasePath . 'traditional_jellaba_2.jpg',
                    ],
                ],
            ],
            'Leatherwork' => [
                [
                    'title' => 'Moroccan Leather Bag',
                    'price' => 90,
                    'stock' => 12,
                    'images' => [
                        $imageBasePath . 'leather_bag_1.jpg',
                        $imageBasePath . 'leather_bag_2.jpg',
                    ],
                ],
            ],
            'Woodwork' => [
                [
                    'title' => 'Carved Cedar Table',
                    'price' => 250,
                    'stock' => 5,
                    'images' => [
                        $imageBasePath . 'cedar_table_1.jpg',
                        $imageBasePath . 'cedar_table_2.jpg',
                    ],
                ],
            ],
            'Metalwork' => [
                [
                    'title' => 'Brass Moroccan Lantern',
                    'price' => 70,
                    'stock' => 20,
                    'images' => [
                        $imageBasePath . 'brass_lantern_1.jpg',
                        $imageBasePath . 'brass_lantern_2.jpg',
                    ],
                ],
            ],
            'Pottery & Ceramics' => [
                [
                    'title' => 'Handcrafted Tagine',
                    'price' => 35,
                    'stock' => 20,
                    'images' => [
                        $imageBasePath . 'tagine_1.jpg',
                        $imageBasePath . 'tagine_2.jpg',
                        $imageBasePath . 'tagine_3.jpg',
                    ],
                ],
            ],
            'Jewelry & Accessories' => [
                [
                    'title' => 'Amazigh Silver Bracelet',
                    'price' => 70,
                    'stock' => 25,
                    'images' => [
                        $imageBasePath . 'bracelet_1.jpg',
                        $imageBasePath . 'bracelet_2.jpg',
                    ],
                ],
            ],
            'Traditional Clothing' => [
                [
                    'title' => 'Embroidered Caftan',
                    'price' => 150,
                    'stock' => 8,
                    'images' => [
                        $imageBasePath . 'caftan_1.jpg',
                        $imageBasePath . 'caftan_2.jpg',
                    ],
                ],
            ],
            'Basketry' => [
                [
                    'title' => 'Handwoven Basket',
                    'price' => 25,
                    'stock' => 30,
                    'images' => [
                        $imageBasePath . 'basket_1.jpg',
                        $imageBasePath . 'basket_2.jpg',
                    ],
                ],
            ],
            'Musical Instruments' => [
                [
                    'title' => 'Traditional Oud',
                    'price' => 180,
                    'stock' => 7,
                    'images' => [
                        $imageBasePath . 'oud_1.jpg',
                        $imageBasePath . 'oud_2.jpg',
                    ],
                ],
            ],
            'Tadelakt' => [
                [
                    'title' => 'Tadelakt Wall Finish Sample',
                    'price' => 300,
                    'stock' => 3,
                    'images' => [
                        $imageBasePath . 'tadelakt_1.jpg',
                        $imageBasePath . 'tadelakt_2.jpg',
                    ],
                ],
            ],
        ];

        return $products[$categoryName] ?? [];
    }

    /**
     * Attach images to a product
     */
    private function attachImages(Product $product, array $images)
    {
        foreach ($images as $index => $path) {
            ProductImage::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'image_path' => $path,
                ],
                [
                    'alt_text'   => $product->title . ($index ? " secondary" : " primary"),
                    'is_primary' => $index === 0,
                ]
            );
        }
    }
}