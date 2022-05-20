module.exports = {
    theme: 'cosmos',
    title: 'Teleport Documentation',
    locales: {
        '/': {
            lang: 'en-US'
        },
    },
    markdown: {
        extendMarkdown: (md) => {
            md.use(require("markdown-it-katex"));
        },
    },
    head: [
        [
            "link",
            {
                rel: "stylesheet",
                href: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css",
            },
        ],
        [
            "link",
            {
                rel: "stylesheet",
                href: "https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css",
            },
        ],
    ],
    base: process.env.VUEPRESS_BASE || '/',
    plugins: [
        'vuepress-plugin-element-tabs'
    ],
    head: [
        // ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }],
        ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon32.png" }],
        ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon16.png" }],
        ['link', { rel: "manifest", href: "/site.webmanifest" }],
        ['meta', { name: "msapplication-TileColor", content: "#2e3148" }],
        ['meta', { name: "theme-color", content: "#ffffff" }],
        ['link', { rel: "icon", type: "image/png", href: "/favicon.png" }],
        // ['link', { rel: "apple-touch-icon-precomposed", href: "/apple-touch-icon-precomposed.png" }],
    ],
    themeConfig: {
        repo: 'teleport-network/teleport',
        docsRepo: 'teleport-network/documents',
        docsBranch: 'main',
        docsDir: 'docs',
        editLinks: true,
        custom: true,
        project: {
            name: 'Teleport'
        },
        logo: {
            src: '/logo.png',
        },
        algolia: {
            id: 'BH4D9OD16A',
            key: 'a5d55fe5f540cc3bd28fa2c72f2b5bd8',
            index: 'teleport'
        },
        topbar: {
            banner: false
        },
        sidebar: {
            auto: false,
            nav: [{
                title: 'Reference',
                children: [
                    {
                    title: 'Introduction',
                    directory: true,
                    path: '/intro'
                },
                {
                    title: 'Teleport Chain',
                    path: 'https://chain-docs.teleport.network'
                },
                {
                    title: 'XIBC protocol',
                    path: 'https://chain-docs.teleport.network/modules/XIBC/index.html'
                },
                {
                    title: 'Relayers',
                    directory: true,
                    path: '/relayers'
                },
                ]
            },
            {
                title: 'Developer Docs',
                children:[
                    {
                        title: 'Concepts',
                        directory: true,
                        path: '/developer/1Concepts'

                    },
                    {
                        title: 'Integration Guide(Testnet)',
                        directory: true,
                        path: '/developer/2Integration Guide (Testnet)'
                    },
                    {
                        title: 'Fees',
                        directory: true,
                        path: '/developer/Fees'
                    },
                    {
                        title: 'Cross-Chain Tracking',
                        directory: true,
                        path: '/developer/Cross-Chain Tracking'
                    },
                    {
                        title: 'Error Handling',
                        directory: true,
                        path: '/developer/Error Handling'
                    },
                    {
                        title: 'Code Examples',
                        directory: true,
                        path: '/developer/Code Examples'
                    },
                    {
                        title: 'Resources',
                        directory: true,
                        path: '/developer/Resources'
                    },
                    {
                        title: 'Version',
                        directory: true,
                        path: '/developer/Version'
                    }
                ]
            }
            
            ]
        },
        footer: {
            logo: '/logo.png',
            textLink: {
                text: 'teleport.network',
                url: 'https://teleport.network'
            },
            services: [
                {
                    service: 'github',
                    url: 'https://github.com/teleport-network/teleport'
                },
                {
                    service: "discord",
                    url: "https://discord.gg/5YQtRDF4Rh",
                },
                {
                    service: "twitter",
                    url: "https://twitter.com/TeleportChain",
                },
                {
                    service: "telegram",
                    url: "https://t.me/TeleportNetwork",
                },
                {
                    service: "medium",
                    url: "https://medium.com/@TeleportNetwork",
                },
            ],
            smallprint: 'This website is maintained by Teleport Network'
        },
        versions: [{
            "label": "main",
            "key": "main"
        },],
    }
};
