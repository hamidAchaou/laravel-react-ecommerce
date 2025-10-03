<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Client;
use App\Models\Product;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {

            $clients = Client::all();
            $products = Product::all();

            if ($clients->isEmpty() || $products->isEmpty()) {
                $this->command->warn('No clients or products found, skipping orders seeding.');
                return;
            }

            foreach ($clients as $client) {
                $ordersCount = rand(1, 3);

                for ($i = 0; $i < $ordersCount; $i++) {

                    // Pick random products
                    $orderProducts = $products->random(rand(1, 5));

                    $totalAmount = $orderProducts->sum(fn($product) => $product->price);

                    // Create payment with valid status
                    $payment = Payment::factory()->create([
                        'amount' => $totalAmount,
                        'status' => 'completed', // match ENUM in DB
                    ]);

                    // Create order with valid status
                    $orderStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
                    $order = Order::create([
                        'client_id'    => $client->id,
                        'payment_id'   => $payment->id,
                        'total_amount' => $totalAmount,
                        'status'       => $orderStatuses[array_rand($orderStatuses)],
                    ]);

                    // Create order items
                    foreach ($orderProducts as $product) {
                        OrderItem::create([
                            'order_id'   => $order->id,
                            'product_id' => $product->id,
                            'quantity'   => rand(1, 3),
                            'price'      => $product->price,
                        ]);
                    }
                }
            }
        });
    }
}