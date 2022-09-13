<?php

use Illuminate\Http\UploadedFile;

dataset('invalidAvatars', fn () => [
    '20Mb image' => fn () => UploadedFile::fake()->image('avatar.jpg', 200, 200)->size(1024 * 20),
    '1024x1024 image' => fn () => UploadedFile::fake()->image('avatar.jpg', 1024, 1024),
    '100x100 image' => fn () => UploadedFile::fake()->image('avatar.jpg', 100, 100),
    'PHP file' => fn () => UploadedFile::fake()->create('avatar.php', 200, 'text/x-php'),
]);
