import type { FC } from 'hono/jsx';

export const Layout: FC = (props) => (
    <html lang="zh">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>RSSHub - 路由列表</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                {`
                details::-webkit-scrollbar {
                    width: 0.25rem;
                }
                details::-webkit-scrollbar-thumb {
                    border-radius: 0.125rem;
                    background-color: #e4e4e7;
                }
                details::-webkit-scrollbar-thumb:hover {
                    background-color: #a1a1aa;
                }

                @font-face {
                    font-family: SN Pro;
                    font-style: normal;
                    font-display: swap;
                    font-weight: 400;
                    src: url(https://cdn.jsdelivr.net/fontsource/fonts/sn-pro@latest/latin-400-normal.woff2) format(woff2);
                }
                @font-face {
                    font-family: SN Pro;
                    font-style: normal;
                    font-display: swap;
                    font-weight: 500;
                    src: url(https://cdn.jsdelivr.net/fontsource/fonts/sn-pro@latest/latin-500-normal.woff2) format(woff2);
                }
                @font-face {
                    font-family: SN Pro;
                    font-style: normal;
                    font-display: swap;
                    font-weight: 700;
                    src: url(https://cdn.jsdelivr.net/fontsource/fonts/sn-pro@latest/latin-700-normal.woff2) format(woff2);
                }
                body {
                    font-family: SN Pro, sans-serif;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
        </head>
        <body className="antialiased min-h-screen text-zinc-700 flex flex-col">{props.children}</body>
    </html>
);
