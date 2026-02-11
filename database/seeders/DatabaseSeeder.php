x<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Interaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{<Canvas></Canvas>0 218        nmuj
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'agent@example.com'],
            ['name' => 'Demo Agent', 'password' => Hash::make('password')]xxxxxxxxxxxxxx
        );

        Contact::factory()xxx
            ->count(25)xxx
            ->create()xxx
            ->each(function (Contact $contact) {xxx
                Interaction::factory()xxx
                    ->count(rand(1, 6))xxx
                    ->create(['contact_id' => $contact->id]);xxx
            });xxx
    }xxx
}
