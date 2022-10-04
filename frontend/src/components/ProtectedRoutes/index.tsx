import minimatch from 'minimatch';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useRef } from 'react';
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
    const canAccess = useRef(true);

    const middlewares = useMemo<RouteMiddleware[]>(
        () => [
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
        ],
        [logged, router, user.banned, user.bans.length],
    );

    useEffect(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const [pattern, callback] of middlewares) {
            if (minimatch(router.pathname, pattern)) {
                canAccess.current = callback();
                if (!canAccess.current) {
                    break;
                }
            }
        }
    }, [middlewares, router.pathname]);

    return canAccess ? (
        children
    ) : (
        <Error statusCode={401} title="Unauthorized access" />
    );
}

export default ProtectedRoutes;
