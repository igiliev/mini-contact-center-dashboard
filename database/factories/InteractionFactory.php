<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

class InteractionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'contact_id' => Contact::factory(),
            'type' => fake()->randomElement(['call', 'email', 'chat', 'ticket']),
            'timestamp' => fake()->dateTimeBetween('-30 days', 'now'),
            'note' => fake()->optional()->sentence(12),
        ];
    }
}
