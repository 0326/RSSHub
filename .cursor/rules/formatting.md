# 代码格式化与 Lint 规范

## 工具链

- **Lint**: oxlint (配合 ESLint 插件)
- **Format**: oxfmt
- **Type Check**: TypeScript 编译器

## 格式化命令

```bash
# 检查格式
pnpm format:check

# 自动修复格式
pnpm format

# 运行 lint
pnpm lint

# 运行 ESLint
pnpm eslint
```

## 代码风格规则

### 命名规范

| 类型      | 规范                 | 示例                              |
| --------- | -------------------- | --------------------------------- |
| 变量/函数 | camelCase            | `userName`, `getUserData`         |
| 类/类型   | PascalCase           | `UserProfile`, `ApiResponse`      |
| 常量      | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| 文件名    | kebab-case           | `user-profile.ts`, `api-utils.ts` |

### 命名空间目录

```typescript
// 路由文件: lib/routes/bilibili/video.ts
// namespace.ts: 命名空间定义
// utils.ts: 共享工具函数
```

### 引号使用

- 字符串优先使用单引号
- JSX/TSX 中使用双引号

```typescript
// 字符串
const message = 'Hello World';
const template = '<div class="container">';

// 避免不必要的模板字符串
const url = 'https://api.example.com'; // 而非 `https://api.example.com`
```

### 分号

使用分号结尾。

### 缩进

使用 4 空格缩进。

### 括号

```typescript
// 条件语句
if (condition) {
    doSomething();
}

// 箭头函数参数始终加括号
const fn = (x) => x * 2;
const asyncFn = async (data) => {
    return process(data);
};
```

### 空格

```typescript
// 函数调用
fn(arg1, arg2);

// 运算符
const sum = a + b;
const hasItems = items.length > 0;

// 对象
const obj = { key: 'value', count: 42 };
```

### 导入排序

```typescript
// 1. 内置模块
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// 2. 外部依赖
import ofetch from 'ofetch';
import { load } from 'cheerio';

// 3. 内部别名导入 (@/)
import type { Route } from '@/lib/types';
import cache from '@/utils/cache';

// 4. 相对导入
import { parseDate } from './utils';
```

### 导出

```typescript
// 命名导出
export const route: Route = { ... };
export function handler() { ... }

// 默认导出
export default route;

// 类型导出
export type { Route, DataItem };
```

### 注释规范

```typescript
// 单行注释

/**
 * 多行注释
 * @param input - 输入参数
 * @returns 处理结果
 */
```

### 控制流

```typescript
// 提前返回，减少嵌套
function process(data: unknown[]) {
    if (!data.length) {
        return [];
    }

    return data.map((item) => transform(item));
}

// 使用可选链替代条件判断
const userName = user?.profile?.name ?? 'Anonymous';

// 使用逻辑运算符简化
const isActive = isEnabled && hasPermission;
```

### 错误处理

```typescript
// 使用 try-catch
async function fetchData(url: string) {
    try {
        const response = await ofetch(url);
        return response;
    } catch (error) {
        logger.error(`Failed to fetch ${url}`, error);
        throw new Error(`Fetch failed: ${url}`);
    }
}

// 自定义错误类型
class RouteError extends Error {
    constructor(
        message: string,
        public statusCode = 500
    ) {
        super(message);
        this.name = 'RouteError';
    }
}
```

### 性能优化

```typescript
// 避免在循环中 await
const results = await Promise.all(items.map((item) => processItem(item)));

// 缓存计算结果
const cache = new Map();
function getCachedValue(key: string) {
    if (!cache.has(key)) {
        cache.set(key, expensiveCalculation(key));
    }
    return cache.get(key);
}

// 使用对象展开而非多次赋值
const defaults = { timeout: 5000, retries: 3 };
const config = { ...defaults, userConfig };
```
