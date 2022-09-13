<?php

use Illuminate\Http\UploadedFile;

dataset('validAvatars', fn () => [
    '200x200 image' => fn () => UploadedFile::fake()->image('avatar.jpg', 200, 200),
    '600x600 image' => fn () => UploadedFile::fake()->image('avatar.jpg', 600, 600),
    'jpg image' => fn () => UploadedFile::fake()->image('avatar.jpg', 200, 200),
    'jpeg image' => fn () => UploadedFile::fake()->image('avatar.jpeg', 200, 200),
    'png image' => fn () => UploadedFile::fake()->image('avatar.png', 200, 200),
    '3Mb image' => fn () => UploadedFile::fake()->image('avatar.jpg', 200, 200)->size(1024 * 3),
]);
