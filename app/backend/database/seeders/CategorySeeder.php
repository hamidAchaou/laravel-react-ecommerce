<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        // Base path for category images
        $basePath = 'assets/images/categories/';

        $defaultImages = [
            'Traditional Industry in Morocco' => $basePath . 'Traditional Industry.webp',
            'Textiles & Weaving'              => $basePath . 'Textiles-Weaving.webp',
            'Leatherwork'                     => $basePath . 'Leatherwork-morocco.webp',
            'Woodwork'                        => $basePath . 'Woodwork-morocco.webp',
            'Metalwork'                       => $basePath . 'Metalwork-morocco.webp',
            'Pottery & Ceramics'              => $basePath . 'Pottery & Ceramics-morocco.webp',
            'Zellige & Plaster'               => $basePath . 'Zellige & Plaster.webp',
            'Jewelry & Accessories'           => $basePath . 'Jewelry & Accessories.webp',
            'Traditional Clothing'            => $basePath . 'Traditional Clothing.png',
            'Basketry'                        => $basePath . 'Basketry.webp',
            'Musical Instruments'             => $basePath . 'Musical Instruments.webp',
        ];

        $descriptions = [
            'Traditional Industry in Morocco' => 'Moroccan craftsmanship is a reflection of centuries of heritage, blending Amazigh, Arab, and Andalusian traditions in artisanal work across the country.',
            'Textiles & Weaving'              => 'Handwoven textiles such as carpets, jellabas, and caftans are crafted with ancestral techniques, especially in regions like Fez, Rabat, and the Atlas Mountains.',
            'Leatherwork'                     => 'Famous for the tanneries of Fez, Moroccan leatherwork produces babouches, poufs, bags, and other goods using natural dyes and traditional methods.',
            'Woodwork'                        => 'Cedar and thuya wood are carved and painted to create intricate doors, furniture, mashrabiyas, and decorative ceilings found in Moroccan architecture.',
            'Metalwork'                       => 'Brass, copper, and silver are forged into lanterns, trays, teapots, and jewelry, often decorated with fine engravings and geometric patterns.',
            'Pottery & Ceramics'              => 'Cities like Safi and Fez are renowned for pottery and ceramics, producing colorful dishes, tagines, and zellige tiles with traditional motifs.',
            'Zellige & Plaster'               => 'Zellige tilework and carved plaster are iconic in Moroccan architecture, adorning mosques, palaces, and riads with geometric and floral designs.',
            'Jewelry & Accessories'           => 'Traditional Amazigh silver jewelry, coral, amber, and gold accessories represent Morocco’s diverse cultural identity and craftsmanship.',
            'Traditional Clothing'            => 'Moroccan clothing includes caftans, takchitas, and djellabas, often handmade with embroidery, beads, and luxurious fabrics.',
            'Basketry'                        => 'Woven from palm leaves, alfa grass, or reeds, Moroccan basketry includes storage baskets, mats, and decorative pieces found in rural souks.',
            'Musical Instruments'             => 'Traditional instruments such as the oud, bendir, guembri, and drums are central to Moroccan Gnawa, Amazigh, and Andalusian music.',        ];

        // Parent Category
        $parent = Category::updateOrCreate(
            ['name' => 'Traditional Industry in Morocco', 'type' => 'product', 'parent_id' => null],
            [
                'name'        => 'Traditional Industry in Morocco',
                'type'        => 'product',
                'parent_id'   => null,
                'image'       => $defaultImages['Traditional Industry in Morocco'],
                'description' => $descriptions['Traditional Industry in Morocco'],
            ]
        );

        // Sub Categories
        $subCategories = [
            'Textiles & Weaving',
            'Leatherwork',
            'Woodwork',
            'Metalwork',
            'Pottery & Ceramics',
            'Zellige & Plaster',
            'Jewelry & Accessories',
            'Traditional Clothing',
            'Basketry',
            'Musical Instruments',
        ];

        foreach ($subCategories as $childName) {
            Category::updateOrCreate(
                ['name' => $childName, 'type' => 'product', 'parent_id' => $parent->id],
                [
                    'name'        => $childName,
                    'type'        => 'product',
                    'parent_id'   => $parent->id,
                    'image'       => $defaultImages[$childName] ?? null,
                    'description' => $descriptions[$childName] ?? null,
                ]
            );
        }
    }
}