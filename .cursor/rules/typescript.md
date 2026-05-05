# TypeScript 规范

## 类型导入

使用 `import type` 进行类型导入:

```typescript
// 正确
import type { Route, DataItem } from '@/lib/types';
import type { Context } from 'hono';

// 错误
import { Route, DataItem } from '@/lib/types';
```

## 类型定义

### 路由类型

```typescript
import type { Route } from '@/lib/types';

export const route: Route = {
    path: '/example/:id',
    name: 'Example Route',
    example: '/example/123',
    maintainers: ['username'],
    handler,
};
```

### 数据项类型

```typescript
import type { DataItem } from '@/lib/types';

const items: DataItem[] = [
    {
        title: 'Article Title',
        description: 'Content here',
        pubDate: new Date(),
        link: 'https://example.com/article',
    },
];
```

## 类型守卫

```typescript
function isValidItem(item: unknown): item is DataItem {
    return typeof item === 'object' && item !== null && 'title' in item && typeof item.title === 'string';
}
```

## 泛型约束

```typescript
function processItems<T extends Record<string, unknown>>(items: T[]): DataItem[] {
    return items.map((item) => ({
        title: String(item.title),
        description: String(item.description ?? ''),
    }));
}
```

## 类型别名

```typescript
type UserId = string | number;

type ApiResponse<T> = {
    data: T;
    status: number;
    message?: string;
};
```

## 接口 vs 类型别名

- 使用 `type` 定义简单类型和联合类型
- 使用 `interface` 定义需要扩展的对象结构

```typescript
// 简单类型
type Status = 'pending' | 'active' | 'completed';

// 对象类型 - 考虑扩展时用 interface
interface UserProfile {
    id: string;
    name: string;
    avatar?: string;
}

// 扩展接口
interface ExtendedUserProfile extends UserProfile {
    email: string;
}
```

## 避免 any

尽量使用 `unknown` 配合类型守卫:

```typescript
// 避免
function parse(data: any) {
    return data.title;
}

// 推荐
function parse(data: unknown) {
    if (typeof data === 'object' && data !== null && 'title' in data) {
        return String(data.title);
    }
    throw new Error('Invalid data format');
}
```

## 可选链与空值合并

```typescript
// 使用可选链
const title = item?.title ?? 'Untitled';

// 使用空值合并
const count = data.count ?? 0;

// 避免
const title = item && item.title ? item.title : 'Untitled';
```
