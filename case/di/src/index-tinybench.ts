import 'reflect-metadata';
import { Bench } from 'tinybench';
import {
  Container as InversifyContainer,
  injectable as inversifyInjectable,
  inject as inversifyInject,
} from 'inversify';
import {
  container as tsyringeContainer,
  injectable as tsyringeInjectable,
  inject as tsyringeInject,
  singleton,
} from 'tsyringe';
import {
  Container as TypeDIContainer,
  Service as typediService,
  Inject as typediInject,
} from 'typedi';

console.log('🚀 开始 DI/IOC 框架性能基准测试 (Tinybench)\n');
console.log('📖 数据说明：');
console.log('  • ops/sec: 每秒操作数，数值越大性能越好');
console.log('  • avg: 平均执行时间，数值越小越好');
console.log('  • min/max: 最小/最大执行时间');
console.log('  • p75/p99: 75%/99% 分位数\n');

// ============================================
// 测试 1: 简单依赖注入 (@injectable)
// ============================================
console.log('📊 测试 1: 简单依赖注入 - 单个类实例化');

// InversifyJS
const INVERSIFY_TYPES = {
  Database: Symbol.for('Database'),
  UserService: Symbol.for('UserService'),
  Logger: Symbol.for('Logger'),
  Repository: Symbol.for('Repository'),
  Service: Symbol.for('Service'),
};

@inversifyInjectable()
class InversifyDatabase {
  query() {
    return 'data';
  }
}

@inversifyInjectable()
class InversifyUserService {
  constructor(@inversifyInject(INVERSIFY_TYPES.Database) private db: InversifyDatabase) {}

  getUser() {
    return this.db.query();
  }
}

// TSyringe
@tsyringeInjectable()
class TsyringeDatabase {
  query() {
    return 'data';
  }
}

@tsyringeInjectable()
class TsyringeUserService {
  constructor(private db: TsyringeDatabase) {}

  getUser() {
    return this.db.query();
  }
}

// TypeDI
@typediService()
class TypeDIDatabase {
  query() {
    return 'data';
  }
}

@typediService()
class TypeDIUserService {
  constructor(private db: TypeDIDatabase) {}

  getUser() {
    return this.db.query();
  }
}

const simpleBench = new Bench({ time: 1000 });

simpleBench
  .add('InversifyJS', () => {
    const container = new InversifyContainer();
    container.bind(INVERSIFY_TYPES.Database).to(InversifyDatabase);
    container.bind(INVERSIFY_TYPES.UserService).to(InversifyUserService);
    const service = container.get<InversifyUserService>(INVERSIFY_TYPES.UserService);
    service.getUser();
  })
  .add('TSyringe', () => {
    tsyringeContainer.clearInstances();
    tsyringeContainer.register('TsyringeDatabase', { useClass: TsyringeDatabase });
    tsyringeContainer.register('TsyringeUserService', { useClass: TsyringeUserService });
    const service = tsyringeContainer.resolve(TsyringeUserService);
    service.getUser();
  })
  .add('TypeDI', () => {
    TypeDIContainer.reset();
    const service = TypeDIContainer.get(TypeDIUserService);
    service.getUser();
  });

await simpleBench.run();
printResults(simpleBench);

// ============================================
// 测试 2: 多层依赖注入
// ============================================
console.log('\n📊 测试 2: 多层依赖注入 - 3层依赖关系');

// InversifyJS
@inversifyInjectable()
class InversifyLogger {
  log(msg: string) {
    return msg;
  }
}

@inversifyInjectable()
class InversifyRepository {
  constructor(
    @inversifyInject(INVERSIFY_TYPES.Database) private db: InversifyDatabase,
    @inversifyInject(INVERSIFY_TYPES.Logger) private logger: InversifyLogger
  ) {}

  findAll() {
    this.logger.log('finding all');
    return this.db.query();
  }
}

@inversifyInjectable()
class InversifyComplexService {
  constructor(
    @inversifyInject(INVERSIFY_TYPES.Repository) private repo: InversifyRepository,
    @inversifyInject(INVERSIFY_TYPES.Logger) private logger: InversifyLogger
  ) {}

  execute() {
    this.logger.log('executing');
    return this.repo.findAll();
  }
}

// TSyringe
@tsyringeInjectable()
class TsyringeLogger {
  log(msg: string) {
    return msg;
  }
}

@tsyringeInjectable()
class TsyringeRepository {
  constructor(
    private db: TsyringeDatabase,
    private logger: TsyringeLogger
  ) {}

  findAll() {
    this.logger.log('finding all');
    return this.db.query();
  }
}

@tsyringeInjectable()
class TsyringeComplexService {
  constructor(
    private repo: TsyringeRepository,
    private logger: TsyringeLogger
  ) {}

  execute() {
    this.logger.log('executing');
    return this.repo.findAll();
  }
}

// TypeDI
@typediService()
class TypeDILogger {
  log(msg: string) {
    return msg;
  }
}

@typediService()
class TypeDIRepository {
  constructor(
    private db: TypeDIDatabase,
    private logger: TypeDILogger
  ) {}

  findAll() {
    this.logger.log('finding all');
    return this.db.query();
  }
}

@typediService()
class TypeDIComplexService {
  constructor(
    private repo: TypeDIRepository,
    private logger: TypeDILogger
  ) {}

  execute() {
    this.logger.log('executing');
    return this.repo.findAll();
  }
}

const complexBench = new Bench({ time: 1000 });

complexBench
  .add('InversifyJS', () => {
    const container = new InversifyContainer();
    container.bind(INVERSIFY_TYPES.Database).to(InversifyDatabase);
    container.bind(INVERSIFY_TYPES.Logger).to(InversifyLogger);
    container.bind(INVERSIFY_TYPES.Repository).to(InversifyRepository);
    container.bind(INVERSIFY_TYPES.Service).to(InversifyComplexService);
    const service = container.get<InversifyComplexService>(INVERSIFY_TYPES.Service);
    service.execute();
  })
  .add('TSyringe', () => {
    tsyringeContainer.clearInstances();
    const service = tsyringeContainer.resolve(TsyringeComplexService);
    service.execute();
  })
  .add('TypeDI', () => {
    TypeDIContainer.reset();
    const service = TypeDIContainer.get(TypeDIComplexService);
    service.execute();
  });

await complexBench.run();
printResults(complexBench);

// ============================================
// 测试 3: 单例模式
// ============================================
console.log('\n📊 测试 3: 单例模式 - 多次获取同一实例');

// InversifyJS
@inversifyInjectable()
class InversifyConfig {
  value = Math.random();
}

// TSyringe
@singleton()
class TsyringeConfig {
  value = Math.random();
}

// TypeDI
@typediService()
class TypeDIConfig {
  value = Math.random();
}

const singletonBench = new Bench({ time: 1000 });

singletonBench
  .add('InversifyJS', () => {
    const container = new InversifyContainer();
    container.bind('Config').to(InversifyConfig).inSingletonScope();
    const instance1 = container.get('Config');
    const instance2 = container.get('Config');
    const instance3 = container.get('Config');
  })
  .add('TSyringe', () => {
    tsyringeContainer.clearInstances();
    tsyringeContainer.registerSingleton('Config', TsyringeConfig);
    const instance1 = tsyringeContainer.resolve(TsyringeConfig);
    const instance2 = tsyringeContainer.resolve(TsyringeConfig);
    const instance3 = tsyringeContainer.resolve(TsyringeConfig);
  })
  .add('TypeDI', () => {
    TypeDIContainer.reset();
    const instance1 = TypeDIContainer.get(TypeDIConfig);
    const instance2 = TypeDIContainer.get(TypeDIConfig);
    const instance3 = TypeDIContainer.get(TypeDIConfig);
  });

await singletonBench.run();
printResults(singletonBench);

// ============================================
// 测试 4: 批量解析
// ============================================
console.log('\n📊 测试 4: 批量解析 - 10个不同服务实例化');

const batchBench = new Bench({ time: 1000 });

batchBench
  .add('InversifyJS', () => {
    const container = new InversifyContainer();

    for (let i = 0; i < 10; i++) {
      const symbol = Symbol.for(`Service${i}`);

      @inversifyInjectable()
      class TempService {
        execute() {
          return i;
        }
      }

      container.bind(symbol).to(TempService);
      container.get(symbol);
    }
  })
  .add('TSyringe', () => {
    tsyringeContainer.clearInstances();

    for (let i = 0; i < 10; i++) {
      @tsyringeInjectable()
      class TempService {
        execute() {
          return i;
        }
      }

      tsyringeContainer.resolve(TempService);
    }
  })
  .add('TypeDI', () => {
    TypeDIContainer.reset();

    for (let i = 0; i < 10; i++) {
      @typediService()
      class TempService {
        execute() {
          return i;
        }
      }

      TypeDIContainer.get(TempService);
    }
  });

await batchBench.run();
printResults(batchBench);

// ============================================
// 测试 5: 容器创建和销毁
// ============================================
console.log('\n📊 测试 5: 容器创建和销毁开销');

const containerBench = new Bench({ time: 1000 });

containerBench
  .add('InversifyJS', () => {
    const container = new InversifyContainer();
    container.bind('Test').to(InversifyDatabase);
    container.unbindAll();
  })
  .add('TSyringe', () => {
    tsyringeContainer.clearInstances();
    tsyringeContainer.register('Test', { useClass: TsyringeDatabase });
  })
  .add('TypeDI', () => {
    TypeDIContainer.reset();
    TypeDIContainer.set('Test', new TypeDIDatabase());
    TypeDIContainer.remove('Test');
  });

await containerBench.run();
printResults(containerBench);

// ============================================
// 测试 6: 构造函数注入 vs 属性注入
// ============================================
console.log('\n📊 测试 6: 纯解析性能 - 预配置容器');

// 预先配置容器
const inversifyContainerPre = new InversifyContainer();
inversifyContainerPre.bind(INVERSIFY_TYPES.Database).to(InversifyDatabase);
inversifyContainerPre.bind(INVERSIFY_TYPES.UserService).to(InversifyUserService);

tsyringeContainer.clearInstances();
tsyringeContainer.registerSingleton(TsyringeDatabase);
tsyringeContainer.registerSingleton(TsyringeUserService);

TypeDIContainer.reset();
// TypeDI 使用装饰器自动注册

const resolveBench = new Bench({ time: 1000 });

resolveBench
  .add('InversifyJS', () => {
    const service = inversifyContainerPre.get<InversifyUserService>(INVERSIFY_TYPES.UserService);
    service.getUser();
  })
  .add('TSyringe', () => {
    const service = tsyringeContainer.resolve(TsyringeUserService);
    service.getUser();
  })
  .add('TypeDI', () => {
    const service = TypeDIContainer.get(TypeDIUserService);
    service.getUser();
  });

await resolveBench.run();
printResults(resolveBench);

console.log('\n✨ 所有测试完成！');
console.log('\n📝 总结：');
console.log('  • InversifyJS: 功能最完善，但配置较复杂');
console.log('  • TSyringe: 微软出品，API简洁');
console.log('  • TypeDI: 轻量级，装饰器友好\n');

// ============================================
// 辅助函数：打印结果
// ============================================
function printResults(bench: Bench) {
  const tasks = bench.tasks.map((task) => ({
    name: task.name,
    hz: task.result?.hz || 0,
    mean: task.result?.mean || 0,
    min: task.result?.min || 0,
    max: task.result?.max || 0,
    p75: task.result?.p75 || 0,
    p99: task.result?.p99 || 0,
    samples: task.result?.samples?.length || 0,
  }));

  // 找出最快的
  const fastest = tasks.reduce((a, b) => (a.hz > b.hz ? a : b));

  // 打印表格
  console.log('\n┌──────────────┬──────────────────┬──────────────┬──────────────┬──────────────┐');
  console.log('│ 框架名称     │ ops/sec          │ 平均时间     │ p75          │ p99          │');
  console.log('├──────────────┼──────────────────┼──────────────┼──────────────┼──────────────┤');

  tasks.forEach((task) => {
    const isFastest = task.name === fastest.name;
    const marker = isFastest ? '🏆' : '  ';
    const name = task.name.padEnd(10);
    const hz = formatNumber(task.hz).padStart(14);
    const mean = formatTime(task.mean).padStart(10);
    const p75 = formatTime(task.p75).padStart(10);
    const p99 = formatTime(task.p99).padStart(10);

    console.log(`│ ${marker}${name} │ ${hz} │ ${mean} │ ${p75} │ ${p99} │`);
  });

  console.log('└──────────────┴──────────────────┴──────────────┴──────────────┴──────────────┘');
  console.log(`\n✅ 最快: ${fastest.name} (${formatNumber(fastest.hz)} ops/sec)`);

  // 性能对比
  console.log('\n📊 相对性能:');
  tasks
    .sort((a, b) => b.hz - a.hz)
    .forEach((task) => {
      const ratio = ((task.hz / fastest.hz) * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(parseFloat(ratio) / 5));
      console.log(`  ${task.name.padEnd(12)} ${bar} ${ratio}%`);
    });
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(0);
}

function formatTime(ms: number): string {
  if (ms < 0.001) {
    return (ms * 1000000).toFixed(2) + 'ns';
  } else if (ms < 1) {
    return (ms * 1000).toFixed(2) + 'μs';
  }
  return ms.toFixed(2) + 'ms';
}
