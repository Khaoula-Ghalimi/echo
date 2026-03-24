"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { PromptUserContainer } from "../util/prompt-user-container";
import { WaitingMessage } from "../util/loader";

/**
 * Defines the mode the TokenVaultConsent component will use to prompt the user to connect a third-party account and
 * authorize the API access.
 * - `redirect` will redirect the user to the provider's authorization page.
 * - `popup` will open a popup window to prompt the user to authorize the API access.
 * - `auto` will automatically choose the best mode based on the user's device and browser.
 */
export type AuthComponentMode = "redirect" | "popup" | "auto";

export type TokenVaultAuthProps = {
    interrupt: {
        connection: string;
        requiredScopes: string[];
        authorizationParams?: Record<string, string>;
        resume?: () => void;
    };
    auth?: {
        connectPath?: string;
        returnTo?: string;
    };
    onFinish?: () => void;
    connectWidget: {
        icon?: ReactNode;
        title: string;
        description: string;
        action?: { label: string };
        containerClassName?: string;
    };
    mode?: AuthComponentMode;
};

export function TokenVaultConsentPopup({
    interrupt: { connection, requiredScopes, authorizationParams, resume },
    connectWidget: { icon, title, description, action, containerClassName },
    auth: { connectPath = "/auth/connect", returnTo = "/close" } = {},
    onFinish,
}: TokenVaultAuthProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [loginPopup, setLoginPopup] = useState<Window | null>(null);

    //Poll for the login process until the popup is closed
    // or the user is authorized
    useEffect(() => {
        if (!loginPopup) {
            return;
        }
        const interval = setInterval(async () => {
            if (loginPopup && loginPopup.closed) {
                setIsLoading(false);
                setLoginPopup(null);
                clearInterval(interval);
                if (typeof onFinish === "function") {
                    onFinish();
                } else if (typeof resume === "function") {
                    resume();
                }
            }
        }, 1000);
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [loginPopup, onFinish, resume]);

    //Open the login popup
    const startLoginPopup = useCallback(async () => {
        const search = new URLSearchParams({
            connection,
            returnTo,
            // Add all extra authorization parameters to the search params, they will be collected and submitted via the
            // authorization_params parameter of the connect account flow.
            ...authorizationParams,
        });
        for (const requiredScope of requiredScopes) {
            search.append("scopes", requiredScope);
        }

        const url = new URL(connectPath, window.location.origin);
        url.search = search.toString();

        const windowFeatures =
            "width=800,height=650,status=no,toolbar=no,menubar=no";
        const popup = window.open(url.toString(), "_blank", windowFeatures);
        if (!popup) {
            console.error("Popup blocked by the browser");
            return;
        } else {
            setLoginPopup(popup);
            setIsLoading(true);
        }
    }, [connection, requiredScopes, returnTo, authorizationParams, connectPath]);

    if (isLoading) {
        return <WaitingMessage />;
    }

    return (
        <PromptUserContainer
            title={title}
            description={description}
            icon={icon}
            containerClassName={containerClassName}
            action={{
                label: action?.label ?? "Connect",
                onClick: startLoginPopup,
            }}
        />
    );
}
