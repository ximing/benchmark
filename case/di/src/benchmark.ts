import 'reflect-metadata';
import Benchmark from 'benchmark';
import { Container as InversifyContainer, injectable as inversifyInjectable, inject as inversifyInject } from 'inversify';
import { container as tsyringeContainer, injectable as tsyringeInjectable, inject as tsyringeInject, singleton } from 'tsyringe';
import { Container as TypeDIContainer, Service as typediService, Inject as typediInject } from 'typedi';

console.log('🚀 开始 DI/IOC 框架性能基准测试 (Benchmark.js)\n');
console.log('📖 数据说明：');
console.log('  • ops/sec: 每秒操作数，数值越大性能越好');
console.log('  • runs sampled: 测试运行次数');
console.log('  • ±%: 相对误差百分比\n');

// InversifyJS Types
const INVERSIFY_TYPES = {
  Database: Symbol.for('Database'),
  UserService: Symbol.for('UserService'),
  Logger: Symbol.for('Logger'),
  Repository: Symbol.for('Repository'),
  Service: Symbol.for('Service')
};

// ============================================
// 测试 1: 简单依赖注入
// ============================================
console.log('📊 测试 1: 简单依赖注入 - 单个类实例化\n');

// InversifyJS
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

const suite1 = new Benchmark.Suite('简单依赖注入');

suite1
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
  })
  .on('cycle', (event: Benchmark.Event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function(this: Benchmark.Suite) {
    console.log('  ✅ 最快: ' + this.filter('fastest').map('name'));
    printComparison(this);
  })
  .run({ async: false });

// ============================================
// 测试 2: 多层依赖注入
// ============================================
console.log('\n📊 测试 2: 多层依赖注入 - 3层依赖关系\n');

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
  constructor(private db: TsyringeDatabase, private logger: TsyringeLogger) {}
  
  findAll() {
    this.logger.log('finding all');
    return this.db.query();
  }
}

@tsyringeInjectable()
class TsyringeComplexService {
  constructor(private repo: TsyringeRepository, private logger: TsyringeLogger) {}
  
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
  constructor(private db: TypeDIDatabase, private logger: TypeDILogger) {}
  
  findAll() {
    this.logger.log('finding all');
    return this.db.query();
  }
}

@typediService()
class TypeDIComplexService {
  constructor(private repo: TypeDIRepository, private logger: TypeDILogger) {}
  
  execute() {
    this.logger.log('executing');
    return this.repo.findAll();
  }
}

const suite2 = new Benchmark.Suite('多层依赖注入');

suite2
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
  })
  .on('cycle', (event: Benchmark.Event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function(this: Benchmark.Suite) {
    console.log('  ✅ 最快: ' + this.filter('fastest').map('name'));
    printComparison(this);
  })
  .run({ async: false });

// ============================================
// 测试 3: 单例模式
// ============================================
console.log('\n📊 测试 3: 单例模式 - 多次获取同一实例\n');

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

const suite3 = new Benchmark.Suite('单例模式');

suite3
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
  })
  .on('cycle', (event: Benchmark.Event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function(this: Benchmark.Suite) {
    console.log('  ✅ 最快: ' + this.filter('fastest').map('name'));
    printComparison(this);
  })
  .run({ async: false });

// ============================================
// 测试 4: 批量解析
// ============================================
console.log('\n📊 测试 4: 批量解析 - 10个不同服务实例化\n');

const suite4 = new Benchmark.Suite('批量解析');

suite4
  .add('InversifyJS', () => {
    const container = new InversifyContainer();
    
    for (let i = 0; i < 10; i++) {
      const symbol = Symbol.for(`Service${i}`);
      
      @inversifyInjectable()
      class TempService {
        execute() { return i; }
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
        execute() { return i; }
      }
      
      tsyringeContainer.resolve(TempService);
    }
  })
  .add('TypeDI', () => {
    TypeDIContainer.reset();
    
    for (let i = 0; i < 10; i++) {
      @typediService()
      class TempService {
        execute() { return i; }
      }
      
      TypeDIContainer.get(TempService);
    }
  })
  .on('cycle', (event: Benchmark.Event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function(this: Benchmark.Suite) {
    console.log('  ✅ 最快: ' + this.filter('fastest').map('name'));
    printComparison(this);
  })
  .run({ async: false });

// ============================================
// 测试 5: 容器创建和销毁
// ============================================
console.log('\n📊 测试 5: 容器创建和销毁开销\n');

const suite5 = new Benchmark.Suite('容器创建销毁');

suite5
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
  })
  .on('cycle', (event: Benchmark.Event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function(this: Benchmark.Suite) {
    console.log('  ✅ 最快: ' + this.filter('fastest').map('name'));
    printComparison(this);
  })
  .run({ async: false });

// ============================================
// 测试 6: 纯解析性能
// ============================================
console.log('\n📊 测试 6: 纯解析性能 - 预配置容器\n');

// 预先配置容器
const inversifyContainerPre = new InversifyContainer();
inversifyContainerPre.bind(INVERSIFY_TYPES.Database).to(InversifyDatabase);
inversifyContainerPre.bind(INVERSIFY_TYPES.UserService).to(InversifyUserService);

tsyringeContainer.clearInstances();
tsyringeContainer.registerSingleton(TsyringeDatabase);
tsyringeContainer.registerSingleton(TsyringeUserService);

TypeDIContainer.reset();
// TypeDI 使用装饰器自动注册

const suite6 = new Benchmark.Suite('纯解析性能');

suite6
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
  })
  .on('cycle', (event: Benchmark.Event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function(this: Benchmark.Suite) {
    console.log('  ✅ 最快: ' + this.filter('fastest').map('name'));
    printComparison(this);
  })
  .run({ async: false });

console.log('\n✨ 所有测试完成！');
console.log('\n📝 总结：');
console.log('  • InversifyJS: 功能最完善，但配置较复杂');
console.log('  • TSyringe: 微软出品，API简洁');
console.log('  • TypeDI: 轻量级，装饰器友好\n');

// ============================================
// 辅助函数
// ============================================
function printComparison(suite: Benchmark.Suite) {
  const results = suite.map((bench: Benchmark) => ({
    name: bench.name,
    hz: bench.hz || 0
  }));
  
  const fastest = results.reduce((a, b) => a.hz > b.hz ? a : b);
  
  console.log('\n  📊 相对性能:');
  results
    .sort((a, b) => b.hz - a.hz)
    .forEach(result => {
      const ratio = (result.hz / fastest.hz * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(parseFloat(ratio) / 5));
      console.log(`    ${result.name.padEnd(12)} ${bar} ${ratio}%`);
    });
  console.log('');
}