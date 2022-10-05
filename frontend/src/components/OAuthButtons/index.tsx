import {
    Button,
    ButtonGroup,
    Icon,
    Link,
    Tooltip,
    VisuallyHidden,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa';
import { apiUrl } from 'services/api';

function OAuthButtons() {
    const { t } = useTranslation('oauth');

    const oauthProviders = useMemo(
        () => [
            {
                name: 'GitHub',
                href: `${apiUrl}/auth/github`,
                icon: <Icon as={FaGithub} w={6} h={6} />,
                tooltip: t('github'),
            },
            {
                name: 'Discord',
                href: `${apiUrl}/auth/discord`,
                icon: <Icon as={FaDiscord} w={6} h={6} />,
                tooltip: t('discord'),
            },
            {
                name: 'Google',
                href: `${apiUrl}/auth/google`,
                icon: <Icon as={FaGoogle} w={6} h={6} />,
                tooltip: t('google'),
            },
        ],
        [t],
    );

    return (
        <ButtonGroup variant="outline" spacing="4">
            {oauthProviders.map(({ name, href, icon, tooltip }) => (
                <Tooltip key={name} label={tooltip} width="full">
                    <Button as={Link} href={href}>
                        <VisuallyHidden>{tooltip}</VisuallyHidden>
                        {icon}
                    </Button>
                </Tooltip>
            ))}
        </ButtonGroup>
    );
}

export default OAuthButtons;
