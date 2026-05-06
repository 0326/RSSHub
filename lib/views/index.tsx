import type { FC } from 'hono/jsx';

import { config } from '@/config';
import type { NamespacesType } from '@/registry';
import { getDebugInfo } from '@/utils/debug-info';
import { gitHash } from '@/utils/git-hash';
import { Layout } from '@/views/layout';

const CATEGORIES = [
    { id: 'all', label: '全部' },
    { id: 'social-media', label: '社交媒体' },
    { id: 'new-media', label: '新媒体' },
    { id: 'traditional-media', label: '传统媒体' },
    { id: 'anime', label: '动漫' },
    { id: 'blog', label: '博客' },
    { id: 'design', label: '设计' },
    { id: 'finance', label: '金融' },
    { id: 'forecast', label: '天气预报' },
    { id: 'game', label: '游戏' },
    { id: 'government', label: '政府' },
    { id: 'journal', label: '学术期刊' },
    { id: 'live', label: '直播' },
    { id: 'multimedia', label: '多媒体' },
    { id: 'other', label: '其他' },
    { id: 'picture', label: '图片' },
    { id: 'program-update', label: '程序更新' },
    { id: 'programming', label: '编程' },
    { id: 'reading', label: '阅读' },
    { id: 'shopping', label: '购物' },
    { id: 'sport', label: '体育' },
    { id: 'study', label: '学习' },
    { id: 'travel', label: '旅行' },
    { id: 'university', label: '大学' },
    { id: 'bbs', label: '论坛' },
];

const startTime = Date.now();

const Index: FC<{ debugQuery: string | undefined; namespaces: NamespacesType }> = ({ debugQuery, namespaces }) => {
    const debug = getDebugInfo();
    const showDebug = !config.debugInfo || config.debugInfo === 'false' ? false : config.debugInfo === 'true' || config.debugInfo === debugQuery;
    const duration = Date.now() - startTime;

    const categoryCount: Record<string, number> = {};
    for (const [, nsData] of Object.entries<{ routes: Record<string, unknown>; categories?: string[] }>(namespaces)) {
        const cats = nsData.categories || [];
        for (const c of cats) {
            categoryCount[c] = (categoryCount[c] || 0) + Object.keys(nsData.routes || {}).length;
        }
    }

    return (
        <Layout>
            {/* Header */}
            <div className="bg-[#F5712C] text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-4 mb-4">
                        <img src="./logo.png" alt="RSSHub" width="60" loading="lazy" />
                        <div>
                            <h1 className="text-3xl font-bold">RSSHub 路由列表</h1>
                            <p className="text-orange-100 text-sm mt-1">
                                共 {Object.keys(namespaces).length} 个数据源 · {Object.values<{ routes: Record<string, unknown> }>(namespaces).reduce((acc, ns) => acc + Object.keys(ns.routes || {}).length, 0)} 条路由
                            </p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-4">
                        <input
                            type="text"
                            id="search-input"
                            placeholder="搜索数据源名称、路由路径或描述..."
                            className="w-full max-w-xl px-4 py-2.5 rounded-lg text-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="bg-white border-b border-zinc-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide" id="category-tabs">
                        {CATEGORIES.map((cat) => (
                            <button key={cat.id} data-category={cat.id} className="category-tab whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-transparent hover:border-[#F5712C]">
                                {cat.label}
                                {cat.id !== 'all' && categoryCount[cat.id] !== undefined && <span className="ml-1 text-orange-400">{categoryCount[cat.id]}</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Route Grid */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="route-grid">
                    {Object.entries(namespaces).map(([nsKey, nsData]) => (
                        <NamespaceCard key={nsKey} nsKey={nsKey} nsData={nsData as unknown as NamespaceCardProps['nsData']} />
                    ))}
                </div>
                <div id="no-results" className="hidden text-center py-16 text-zinc-400">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-lg">没有找到匹配的路由</p>
                    <p className="text-sm mt-1">试试其他关键词或切换分类</p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 pb-8 w-full text-sm font-medium space-y-2 border-t border-zinc-200 mt-8">
                <div className="flex justify-center gap-6 mb-4">
                    <a target="_blank" href="https://docs.rsshub.app/zh/" className="text-[#F5712C] hover:underline">
                        文档
                    </a>
                    <a target="_blank" href="https://github.com/DIYgod/RSSHub" className="text-[#F5712C] hover:underline">
                        GitHub
                    </a>
                    <a target="_blank" href="https://t.me/rsshub" className="text-[#F5712C] hover:underline">
                        Telegram
                    </a>
                    <a target="_blank" href="https://folo.is/" className="text-[#F5712C] hover:underline">
                        Folo
                    </a>
                </div>
                {showDebug ? (
                    <details className="text-xs w-96 mx-auto !mt-4 max-h-[400px] overflow-auto">
                        <summary className="cursor-pointer text-zinc-400 hover:text-zinc-600">Debug Info</summary>
                        <div className="bg-zinc-50 p-3 rounded text-left mt-2">
                            <div className="grid grid-cols-2 gap-1">
                                <span className="text-zinc-500">Request:</span>
                                <span>{debug.request}</span>
                                <span className="text-zinc-500">Health:</span>
                                <span>{(100 - ((debug.error / debug.request) * 100 || 0)).toFixed(2)}%</span>
                                <span className="text-zinc-500">Uptime:</span>
                                <span>{(duration / 3_600_000).toFixed(2)}h</span>
                                <span className="text-zinc-500">Git:</span>
                                <span>
                                    {gitHash && (
                                        <a href={`https://github.com/DIYgod/RSSHub/commit/${gitHash}`} className="underline">
                                            {gitHash.slice(0, 7)}
                                        </a>
                                    )}
                                </span>
                            </div>
                        </div>
                    </details>
                ) : null}
                <p>
                    Made with ❤️ by{' '}
                    <a target="_blank" href="https://diygod.cc" className="text-[#F5712C]">
                        DIYgod
                    </a>{' '}
                    and{' '}
                    <a target="_blank" href="https://github.com/DIYgod/RSSHub/graphs/contributors" className="text-[#F5712C]">
                        Contributors
                    </a>
                </p>
            </div>

            {/* Client-side filtering script */}
            <script src="/routes-index.js" />
        </Layout>
    );
};

type RouteData = {
    name?: string;
    description?: string;
    example?: string;
    categories?: string[];
    maintainers?: string[];
    features?: Record<string, boolean>;
};

type NamespaceCardProps = {
    nsKey: string;
    nsData: {
        name?: string;
        routes: Record<string, RouteData>;
        categories?: string[];
        description?: string;
    };
};

const NamespaceCard = ({ nsKey, nsData }: NamespaceCardProps) => {
    const routeEntries = Object.entries(nsData.routes || {});
    if (routeEntries.length === 0) {
        return null;
    }

    const routePath = routeEntries[0]?.[0] || '/';
    const routeData = routeEntries[0]?.[1] as RouteData | undefined;
    const exampleUrl = routeData?.example || `/${nsKey}`;
    const description = routeData?.description || nsData.description || '';

    const plainDesc = description
        .replaceAll(/:::[\s\S]*?:::/g, '')
        .replaceAll(/`[^`]*`/g, '')
        .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replaceAll(/[#*_]/g, '')
        .trim()
        .slice(0, 100);

    return (
        <div
            className="ns-card bg-white rounded-xl border border-zinc-200 p-4 hover:border-[#F5712C] hover:shadow-md transition-all cursor-pointer group"
            data-ns={nsKey}
            data-name={nsData.name || nsKey}
            data-desc={plainDesc}
            data-cats={JSON.stringify(nsData.categories || [])}
            onclick="window.location.href='/rsshub/routes'"
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-zinc-800 text-sm leading-tight group-hover:text-[#F5712C] transition-colors">{nsData.name || nsKey}</h3>
                <span className="text-xs text-zinc-400 shrink-0">/{nsKey}</span>
            </div>

            {plainDesc && <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">{plainDesc}</p>}

            {routeEntries.length === 1 ? (
                <RouteBadge routePath={`/${nsKey}${routePath}`} example={exampleUrl} />
            ) : (
                <div className="space-y-1">
                    <p className="text-xs text-zinc-400">{routeEntries.length} 个路由</p>
                    {routeEntries.slice(0, 3).map(([rp, rd]) => (
                        <RouteBadge key={rp} routePath={`/${nsKey}${rp}`} example={(rd as RouteData).example} compact />
                    ))}
                    {routeEntries.length > 3 && <p className="text-xs text-zinc-400">+{routeEntries.length - 3} 更多</p>}
                </div>
            )}

            {nsData.categories?.length && (
                <div className="flex flex-wrap gap-1 mt-3">
                    {nsData.categories.map((cat) => (
                        <span key={cat} className="inline-block px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[10px] rounded font-medium">
                            {cat}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

type RouteBadgeProps = {
    routePath: string;
    example?: string;
    compact?: boolean;
};

const RouteBadge: FC<RouteBadgeProps> = ({ routePath, example, compact }) => (
    <div className={`flex items-center gap-1.5 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <code className="bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-mono truncate max-w-[180px]">{routePath}</code>
        <a href={example || routePath} className="text-[#F5712C] hover:underline shrink-0" onclick={(e) => e.stopPropagation()}>
            →
        </a>
    </div>
);

export default Index;
