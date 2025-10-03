<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Payment;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'amount' => $this->faker->randomFloat(2, 10, 500),
            'status' => $this->faker->randomElement(['pending','completed','failed','refunded']), // must match DB ENUM
            'method' => $this->faker->randomElement(['card','cash','paypal']),
            'transaction_id' => $this->faker->uuid(),
        ];
    }
}