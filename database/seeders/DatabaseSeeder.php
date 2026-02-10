<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Interaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'agent@example.com'],
            ['name' => 'Demo Agent', 'password' => Hash::make('password')]
        );

        Contact::factory()
            ->count(25)
            ->create()
            ->each(function (Contact $contact) {
                Interaction::factory()
                    ->count(rand(1, 6))
                    ->create(['contact_id' => $contact->id]);
            });
    }
}
