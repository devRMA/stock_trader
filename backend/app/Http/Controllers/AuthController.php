<?php

namespace App\Http\Controllers;

use App\Models\User;
use F9Web\ApiResponseHelpers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * @group Auth
 *
 * Authentication endpoints
 */
class AuthController extends Controller
{
    use ApiResponseHelpers;

    /**
     * Register
     *
     * Create a new user in database.
     *
     * @unauthenticated
     *
     * @bodyParam name string required The user name.
     * @bodyParam email string required The user email. Example: test@email.com
     * @bodyParam password string required The user password. Example: password
     *
     * @response 422 scenario="failed validation of some field" {
     *     "message": "The given data was invalid.",
     *     "errors": {
     *         "name": [
     *             "The name field is required.",
     *             "The name must be at least 4 characters.",
     *             "The name must not be greater than 255 characters."
     *         ],
     *         "email": [
     *             "The email field is required.",
     *             "The email must be a valid email address.",
     *             "The email must not be greater than 255 characters.",
     *             "The email has already been taken."
     *         ],
     *         "password": [
     *             "The password field is required.",
     *             "The password must be at least 4 characters."
     *         ]
     *     }
     * }
     * @response 500 scenario="There was an error creating the user." {
     *     "error": "register new user failed"
     * }
     * @response 201 scenario="success" []
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $this->validate($request, [
            'name'     => [
                'required',
                'min:4',
                'max:255',
            ],
            'email'    => [
                'required',
                'email',
                'max:255',
                'unique:' . User::class,
            ],
            'password' => [
                'required',
                'min:4',
            ],
        ]);
        $createdUser = User::create([
            'name'     => $request->get('name'),
            'email'    => $request->get('email'),
            'password' => Hash::make($request->get('password')),
        ]);
        if ($createdUser) {
            return $this->respondCreated();
        } else {
            return response()->json([
                'error' => 'register new user failed',
            ]);
        }
    }

    /**
     * Login
     *
     * Get a JWT via given credentials.
     *
     * @unauthenticated
     *
     * @bodyParam email string required The user email. Example: test@email.com
     * @bodyParam password string required The user password. Example: password
     *
     * @responseField access_token string The token to use for the next request.
     * @responseField expires_in integer The number of seconds for the token to expire.
     * @responseField blacklist_in integer The number of seconds for the token to be blacklisted
     * (when the token is blacklisted, it is not possible to refresh the token,
     * it is necessary to login again).
     *
     * @response 422 scenario="failed validation of some field" {
     *     "message": "The given data was invalid.",
     *     "errors": {
     *         "email": [
     *             "The email field is required.",
     *         ],
     *         "password": [
     *             "The password field is required.",
     *         ]
     *     }
     * }
     * @response 403 scenario="failed to login" {
     *     "error": "e-mail or password is invalid."
     * }
     * @response 200 scenario="success" {
     *    "access_token": "json web token (jwt)",
     *    "expires_in": 7200,
     *    "blacklist_in": 14400
     * }
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $this->validate($request, [
            'email'    => [
                'required',
            ],
            'password' => [
                'required',
            ],
        ]);
        $credenciais = $request->only(['email', 'password']);
        $token       = Auth::attempt($credenciais);
        if ($token) {
            return $this->respondWithToken($token);
        } else {
            return $this->respondForbidden('e-mail or password is invalid.');
        }
    }

    /**
     * Logout
     *
     * Log the user out (Invalidate the token).
     *
     * @authenticated
     *
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 200 scenario="success" {
     *     "success": "logout successful."
     * }
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(): JsonResponse
    {
        Auth::logout();

        return $this->respondOk('logout successful.');
    }

    /**
     * Refresh
     *
     * Refresh the token.
     *
     * @authenticated
     *
     * @responseField access_token string The token to use for the next request.
     * @responseField expires_in integer The number of seconds for the token to expire.
     * @responseField blacklist_in integer The number of seconds for the token to be blacklisted
     * (when the token is blacklisted, it is not possible to refresh the token,
     * it is necessary to login again).
     *
     * @response 401 scenario="Invalid Token" {"message": "..."}
     * @response 200 scenario="success" {
     *    "access_token": "json web token (jwt)",
     *    "expires_in": 7200,
     *    "blacklist_in": 14400
     * }
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(Auth::refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token): JsonResponse
    {
        return $this->respondWithSuccess([
            'access_token' => $token,
            'expires_in'   => config('jwt.ttl') * 60,
            'blacklist_in' => config('jwt.refresh_ttl') * 60,
        ]);
    }
}
