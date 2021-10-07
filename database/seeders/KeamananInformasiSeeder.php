<?php

namespace Database\Seeders;

use App\Models\Layanan\KeamananInformasi;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class KeamananInformasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $keamananInformasi = [];

        $status = [
            'Normal',
            'Deface',
            'Tidak Bisa Diakses'
        ];

        $link_website = [
            'https://google.com',
            'https://facebook.com',
            'https://instagram.com',
            'https://twitter.com',
        ];

        for ($i = 1; $i <= 1000; $i++) {
            $keamananInformasi[] = [
                'tanggal' => Carbon::now()->addDay(rand(-30, 0))->toDateString(),
                'jam' => Carbon::now()->addHour(rand(-7, 7))->toTimeString(),
                'link_website' => $link_website[rand(0, 3)],
                'status_website' => $status[rand(0, 2)],
                'keterangan' => 'Keterangan Dummy',
                'capture' => 'default-laporan.png',
                'id_user' => rand(1, 2)
            ];
        }

        KeamananInformasi::truncate();

        foreach ($keamananInformasi as $keamanan) {
            KeamananInformasi::create($keamanan);
        }
    }
}
