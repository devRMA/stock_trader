import minimatch from 'minimatch';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useEffectOnce } from 'react-use';
import { selectUser, useAppSelector } from 'store/hooks';

interface Props {
    children: ReactElement;
}

type RoutePattern = string;
type Callback = () => boolean;
type RouteMiddleware = [RoutePattern, Callback];

function ProtectedRoutes({ children }: Props) {
    const router = useRouter();
    const { logged, user } = useAppSelector(selectUser);
    let canAccess = true;

    const middlewares: RouteMiddleware[] = [
        [
            '/login',
            () => {
                if (logged) {
                    router.push('/');
                }

                return !logged;
            },
        ],
        [
            '/banned',
            () => {
                if (!logged || !user.banned || user.bans.length === 0) {
                    router.push('/');

                    return false;
                }

                return true;
            },
        ],
    ];

    useEffectOnce(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const [pattern, callback] of middlewares) {
            if (minimatch(router.pathname, pattern)) {
                canAccess = callback();
                if (!canAccess) {
                    break;
                }
            }
        }
    });

    return canAccess ? (
        children
    ) : (
        <Error statusCode={401} title="Unauthorized access" />
    );
}

export default ProtectedRoutes;
