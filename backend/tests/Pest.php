<?php

use function Pest\Laravel\seed;

uses(Tests\TestCase::class)
    ->in('Feature');

uses(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->beforeEach(fn () => seed())
    ->in('Feature');
