<?php

use App\Models\User;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\postJson;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

beforeEach(function () {
    Storage::fake(config('media-library.disk_name'));
});

it('should be possible to update the avatar with a valid image', function (UploadedFile $avatar) {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    postJson(route('users.me.set_avatar'), compact('avatar'))
        ->assertOk();

    assertDatabaseCount(Media::class, 1);
    assertDatabaseHas(Media::class, [
        'id' => $user->getAvatar()->id,
    ]);
})->with('validAvatars');

it('should return error 422 if avatar is invalid', function (UploadedFile $avatar) {
    /** @var \App\Models\User */
    $user = User::factory()->create();

    Sanctum::actingAs($user, guard:'web');

    postJson(route('users.me.set_avatar'), compact('avatar'))
        ->assertUnprocessable();
})->with('invalidAvatars');

it('should go back to default avatar if no avatar is given', function (UploadedFile $avatar) {
    /** @var \App\Models\User */
    $user = User::factory()->create();
    $user->setAvatar($avatar);

    Sanctum::actingAs($user, guard:'web');

    postJson(route('users.me.set_avatar'), [
        'avatar' => null,
    ])
        ->assertOk();

    assertDatabaseCount(Media::class, 0);
    expect($user->getAvatarUrl())->toBeNull();
})->with('validAvatars');
