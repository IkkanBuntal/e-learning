<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => static::$password ??= Hash::make('password'),
            'role_id'           => null, // override per seeder
            'kelas_id'          => null,
            'nip'               => null,
            'nis'               => null,
            'foto'              => null,
            'jenis_kelamin'     => fake()->randomElement(['L', 'P']),
            'alamat'            => fake()->address(),
            'no_telp'           => fake()->phoneNumber(),
            'tanggal_lahir'     => fake()->date('Y-m-d', '2005-01-01'),
            'tempat_lahir'      => fake()->city(),
            'aktif'             => true,
            'remember_token'    => Str::random(10),
        ];
    }

    /**
     * State: Admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id'  => Role::where('nama', 'admin')->first()?->id,
            'kelas_id' => null,
            'nip'      => null,
            'nis'      => null,
        ]);
    }

    /**
     * State: Guru user.
     */
    public function guru(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id'  => Role::where('nama', 'guru')->first()?->id,
            'kelas_id' => null,
            'nip'      => fake()->unique()->numerify('19######0001'),
            'nis'      => null,
        ]);
    }

    /**
     * State: Siswa user.
     */
    public function siswa(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id'  => Role::where('nama', 'siswa')->first()?->id,
            'kelas_id' => null, // set after kelas seeder runs
            'nip'      => null,
            'nis'      => fake()->unique()->numerify('20######001'),
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
