# RSSHub 项目规范

## 项目概述

RSSHub 是一个开源的 RSS 生成器，能够从几乎任何网站生成 RSS 订阅源。

## 项目结构

- `lib/routes/` - 路由定义目录，包含各种网站的 RSS 路由实现
- `lib/routes-deprecated/` - 已废弃的路由
- `lib/utils/` - 工具函数库
- `lib/middleware/` - 中间件
- `lib/views/` - 前端视图模板
- `lib/types.ts` - 类型定义

## 技术栈

- **框架**: Hono (轻量级 Web 框架)
- **构建工具**: tsx, tsdown
- **包管理**: pnpm
- **主要依赖**: cheerio, ofetch, youtubei.js, twitter-api-v2 等

## 路由开发规范

### 文件组织

每个命名空间是一个目录，包含:

- `namespace.ts` - 命名空间定义
- `*.ts` - 各个路由实现

示例结构:

```
lib/routes/bilibili/
├── namespace.ts
├── video.ts
├── user.ts
├── live.ts
└── utils.ts (可选)
```

### namespace.ts 格式

```typescript
import type { Namespace } from '@/lib/types';

export const namespace: Namespace = {
    name: 'Bilibili',
    url: 'bilibili.com',
    description: 'Bilibili RSS routes.',
};
```

### 路由文件格式

```typescript
import type { Route } from '@/lib/types';

export const route: Route = {
    path: '/bilibili/user/:uid',
    name: 'User Videos',
    example: '/bilibili/user/2',
    maintainers: ['DIYgod'],
    handler,
    // ... 其他配置
};
```

### 必需字段

| 字段          | 说明                         |
| ------------- | ---------------------------- |
| `path`        | 路由路径，使用 Hono 路由语法 |
| `name`        | 路由名称，用于文档标题       |
| `maintainers` | 维护者 GitHub 用户名数组     |
| `example`     | 示例 URL，必须以 `/` 开头    |
| `handler`     | 处理函数                     |

### 可选字段

| 字段          | 说明                      |
| ------------- | ------------------------- |
| `url`         | 对应网站 URL（不含协议）  |
| `parameters`  | 路由参数说明              |
| `description` | 详细描述（支持 Markdown） |
| `categories`  | 分类数组                  |
| `features`    | 功能特性配置              |
| `radar`       | RSSHub Radar 规则         |
| `view`        | Follow 默认视图类型       |

### features 配置

```typescript
features: {
    requireConfig?: Array<{ name: string; optional?: boolean; description: string; }> | false;
    requirePuppeteer?: boolean;    // 使用浏览器自动化
    antiCrawler?: boolean;         // 反爬虫
    supportRadar?: boolean;        // 支持 Radar
    supportBT?: boolean;           // 支持 BT 下载
    supportPodcast?: boolean;     // 支持播客
    supportScihub?: boolean;      // 支持 Sci-Hub
    nsfw?: boolean;                // NSFW 内容
}
```

### Radar 规则格式

```typescript
radar: [
    {
        title: 'User Videos',
        source: ['bilibili.com/user/space/*'],
        target: '/bilibili/user/:uid',
    },
],
```

注意: `source` 使用相对路径（不含 `https://` 前缀）

## 路由 handler 实现规范

### 基本模式

```typescript
async function handler(ctx: Context): Promise<Data> {
    const { uid } = ctx.req.param();
    const response = await ofetch(`https://api.example.com/user/${uid}`);

    return {
        title: 'User Feed',
        link: `https://example.com/user/${uid}`,
        item: response.items.map((item) => ({
            title: item.title,
            description: item.content,
            pubDate: new Date(item.date),
            link: item.url,
        })),
    };
}
```

### 使用 Cheerio 解析 HTML

```typescript
import { load } from 'cheerio';

async function handler(ctx: Context) {
    const response = await ofetch('https://example.com');
    const $ = load(response);

    const items = $('article.item')
        .toArray()
        .map((element) => {
            const el = $(element);
            return {
                title: el.find('h2').text(),
                description: el.find('.content').html(),
                pubDate: el.find('time').attr('datetime'),
                link: el.find('a').attr('href'),
            };
        });

    return { title: 'Example', item: items };
}
```

### 数据缓存

使用 `cache.tryGet()` 缓存数据:

```typescript
import cache from '@/utils/cache';

async function handler(ctx: Context) {
    const key = `example:${ctx.req.param('id')}`;
    const data = await cache.tryGet(key, async () => {
        // fetch data
        return fetchedData;
    });

    return { title: 'Cached', item: data };
}
```

## DataItem 类型

返回的 item 必须符合 `DataItem` 类型:

| 字段             | 类型        | 说明                              |
| ---------------- | ----------- | --------------------------------- |
| `title`          | string      | 必填，标题                        |
| `description`    | string      | 内容（不含 title/author/pubDate） |
| `pubDate`        | Date/string | 发布日期                          |
| `link`           | string      | 链接（必须唯一）                  |
| `category`       | string[]    | 分类标签                          |
| `author`         | string      | 作者                              |
| `guid`           | string      | 全局唯一标识                      |
| `image`          | string      | 图片 URL                          |
| `enclosure_url`  | string      | 音频/视频 URL                     |
| `enclosure_type` | string      | MIME 类型                         |

## 常用工具函数

| 函数                          | 说明             |
| ----------------------------- | ---------------- |
| `parseDate(str, format?)`     | 解析日期字符串   |
| `getCurrentLocales()`         | 获取当前语言环境 |
| `convert(charset, html)`      | 字符集转换       |
| `art()`                       | 模板渲染         |
| `getParameterFromString(str)` | 从字符串提取参数 |

## 配置项

使用 `config` 对象访问环境变量:

```typescript
import { config } from '@/lib/config';

if (config.exampleApiKey) {
    // 使用 API Key
}
```

## 开发命令

| 命令                | 说明           |
| ------------------- | -------------- |
| `pnpm dev`          | 启动开发服务器 |
| `pnpm build:routes` | 构建路由文件   |
| `pnpm lint`         | 运行代码检查   |
| `pnpm format`       | 格式化代码     |
| `pnpm vitest`       | 运行测试       |

## 注意事项

1. **不要重复命名空间名称** - 路由名称不要包含命名空间名称
2. **使用绝对导入** - 使用 `@/` 前缀的绝对路径
3. **处理错误** - 返回清晰的错误信息
4. **避免硬编码** - 使用配置文件管理常量
5. **类型安全** - 使用 TypeScript 类型定义
