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
        ['link', { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
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
            name: 'Teleport',
            denom: 'Teleport',
            ticker: 'Teleport',
            binary: 'teleport',
            testnet_denom: 'Tele',
            testnet_ticker: 'TELE',
            rpc_url: 'http://localhost:8545/',
            rpc_url_local: 'http://localhost:8545/',
            chain_id: '9001',
            testnet_chain_id: '9000',
            latest_version: 'v0.1.3',
            version_number: '1',
            testnet_version_number: '1',
        },
        logo: {
            src: '',
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
                    children: [{
                            title: 'Introduction',
                            directory: true,
                            path: '/intro'
                        },
                        {
                            title: 'Teleport Chain',
                            path: 'https://github.com/teleport-network/documents'
                        },
                        {
                            title: 'XIBC protocol',
                            path: 'https://github.com/teleport-network/documents/tree/main/modules/XIBC'
                        },
                        {
                            title: 'Relayers',
                            directory: true,
                            path: '/relayers'
                        },
                    ]
                },
                {
                    title: 'Resources',
                    children: [{
                            title: 'Develop your cross-chain dApps',
                            path: ''
                        }
                    ]
                }
            ]
        },  
        footer: {
            logo: '',
            textLink: {

            },
            services: [

            ],
            smallprint: 'This website is maintained by Teleport Network Ltd.',
            links: []
        },
        versions: [{
            "label": "main",
            "key": "main"
        }, ],
    }
};
