<?php

namespace App\Enums;

enum CompanyRisk: int
{
    case Low = 1;
    case Medium = 2;
    case High = 3;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
