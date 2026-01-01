# DI/IOC 框架性能基准测试

这个项目对三个流行的 TypeScript 依赖注入框架进行性能基准测试：

- **InversifyJS** - 功能最完善的 IoC 容器
- **TSyringe** - 微软出品的轻量级 DI 框架
- **TypeDI** - 装饰器友好的依赖注入库

## 测试场景

测试涵盖了 DI/IOC 常见的使用场景：

1. **简单依赖注入** - 单个类实例化，带有一个依赖
2. **多层依赖注入** - 3层依赖关系，模拟实际应用场景
3. **单例模式** - 多次获取同一实例的性能
4. **批量解析** - 一次性实例化10个不同服务
5. **容器创建和销毁** - 容器生命周期管理开销
6. **纯解析性能** - 预配置容器的解析速度

## 安装依赖

```bash
npm install
# 或
pnpm install
```

## 运行测试

### 使用 Tinybench（推荐）

Tinybench 是一个现代化的基准测试库，提供详细的统计信息：

```bash
npm run bench:tinybench
```

输出包括：
- ops/sec（每秒操作数）
- 平均时间、最小/最大时间
- p75、p99 分位数
- 相对性能对比

### 使用 Benchmark.js

经典的 JavaScript 基准测试库：

```bash
npm run bench:benchmark
```

输出包括：
- ops/sec（每秒操作数）
- 测试运行次数
- 相对误差百分比
- 相对性能对比

## 构建

手动编译 TypeScript：

```bash
npm run build
```

编译后的文件将输出到 `dist/` 目录。

## 技术细节

### 为什么要先编译？

测试使用 TypeScript 编写，通过 `tsc` 预编译为 JavaScript，然后运行编译后的代码。这样做的好处：

1. **排除运行时编译干扰** - 避免 ts-node 等工具的编译开销影响测试结果
2. **更接近生产环境** - 生产环境使用的是编译后的代码
3. **测试更准确** - 只测试 DI 框架本身的性能

### 装饰器配置

所有三个框架都使用装饰器（`@injectable`、`@Service` 等），因此 TypeScript 配置中启用了：

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

### Reflect Metadata

InversifyJS 和 TypeDI 依赖 `reflect-metadata` 进行依赖注入元数据的运行时反射。每个测试文件开头都导入了：

```typescript
import 'reflect-metadata';
```

## 预期结果

不同框架在不同场景下的表现会有所差异：

- **简单场景**: TSyringe 通常表现较好，因为其设计简洁
- **复杂依赖**: InversifyJS 的优化在复杂场景下更明显
- **单例模式**: 各框架差异不大，主要取决于缓存实现
- **容器管理**: TypeDI 较轻量，创建销毁开销更小

## 框架对比

| 框架 | 优点 | 缺点 |
|------|------|------|
| InversifyJS | 功能完善、文档详细、企业级 | 配置复杂、学习曲线陡峭 |
| TSyringe | API简洁、微软维护、易上手 | 功能相对简单 |
| TypeDI | 轻量级、装饰器友好、性能好 | 社区相对较小 |

## 注意事项

1. 性能测试结果会受到系统负载、Node.js 版本等因素影响
2. 建议在相对空闲的环境下运行测试
3. 多次运行取平均值会更准确
4. 实际项目选型应综合考虑功能、生态、团队熟悉度等因素

## License

MIT