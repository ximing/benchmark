import Benchmark from 'benchmark';
import { observable as formulyObservable, autorun as formulyAutorun } from '@formily/reactive';
import { observable as nxObservable, observe as nxObserve } from '@nx-js/observer-util';
import { reactive as vueReactive, effect as vueEffect } from '@vue/reactivity';
import { observable as mobxObservable, autorun as mobxAutorun, configure } from 'mobx';
// 配置 MobX
configure({ enforceActions: 'never' });

const suite = new Benchmark.Suite();

console.log('🚀 开始响应式库性能基准测试...\n');
console.log('📖 数据说明：');
console.log('  • ops/sec: 每秒操作数，数值越大性能越好');
console.log('  • ±%: 误差范围，数值越小结果越稳定（理想 <5%）');
console.log('  • runs sampled: 采样次数，次数越多结果越可靠');
console.log('  • 综合考虑性能和稳定性来判断"最快"\n');

// ============================================
// 测试 1: 简单对象创建
// ============================================
console.log('📊 测试 1: 简单对象创建');
const createSuite = new Benchmark.Suite();

createSuite
  .add('Formily - 创建响应式对象', () => {
    const obj = formulyObservable({ count: 0, name: 'test' });
  })
  .add('NX - 创建响应式对象', () => {
    const obj = nxObservable({ count: 0, name: 'test' });
  })
  .add('Vue - 创建响应式对象', () => {
    const obj = vueReactive({ count: 0, name: 'test' });
  })
  .add('MobX - 创建响应式对象', () => {
    const obj = mobxObservable({ count: 0, name: 'test' });
  })
  .on('cycle', (event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest');
    console.log('  ✅ 最快: ' + fastest.map('name'));
    
    // 显示详细分析
    const results = this.map(bench => ({
      name: bench.name,
      hz: bench.hz,
      rme: bench.stats.rme,
      samples: bench.stats.sample.length
    }));
    
    console.log('  📈 稳定性分析:');
    results.forEach(r => {
      const stability = r.rme < 1 ? '⭐⭐⭐⭐⭐' : 
                       r.rme < 5 ? '⭐⭐⭐⭐' : 
                       r.rme < 10 ? '⭐⭐⭐' : 
                       r.rme < 50 ? '⭐⭐' : '⭐';
      console.log(`     ${r.name.split(' - ')[0]}: ${stability} (误差 ±${r.rme.toFixed(2)}%)`);
    });
    console.log('');
  })
  .run();

// ============================================
// 测试 2: 读取属性
// ============================================
console.log('📊 测试 2: 读取属性');
const readSuite = new Benchmark.Suite();

const formulyObj = formulyObservable({ count: 0, name: 'test' });
const nxObj = nxObservable({ count: 0, name: 'test' });
const vueObj = vueReactive({ count: 0, name: 'test' });
const mobxObj = mobxObservable({ count: 0, name: 'test' });

readSuite
  .add('Formily - 读取属性', () => {
    const val = formulyObj.count;
  })
  .add('NX - 读取属性', () => {
    const val = nxObj.count;
  })
  .add('Vue - 读取属性', () => {
    const val = vueObj.count;
  })
  .add('MobX - 读取属性', () => {
    const val = mobxObj.count;
  })
  .on('cycle', (event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest');
    console.log('  ✅ 最快: ' + fastest.map('name'));
    
    // 显示详细分析
    const results = this.map(bench => ({
      name: bench.name,
      hz: bench.hz,
      rme: bench.stats.rme,
      samples: bench.stats.sample.length
    }));
    
    console.log('  📈 稳定性分析:');
    results.forEach(r => {
      const stability = r.rme < 1 ? '⭐⭐⭐⭐⭐' : 
                       r.rme < 5 ? '⭐⭐⭐⭐' : 
                       r.rme < 10 ? '⭐⭐⭐' : 
                       r.rme < 50 ? '⭐⭐' : '⭐';
      console.log(`     ${r.name.split(' - ')[0]}: ${stability} (误差 ±${r.rme.toFixed(2)}%)`);
    });
    console.log('');
  })
  .run();

// ============================================
// 测试 3: 修改属性
// ============================================
console.log('📊 测试 3: 修改属性');
const writeSuite = new Benchmark.Suite();

writeSuite
  .add('Formily - 修改属性', () => {
    formulyObj.count++;
  })
  .add('NX - 修改属性', () => {
    nxObj.count++;
  })
  .add('Vue - 修改属性', () => {
    vueObj.count++;
  })
  .add('MobX - 修改属性', () => {
    mobxObj.count++;
  })
  .on('cycle', (event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest');
    console.log('  ✅ 最快: ' + fastest.map('name'));
    
    // 显示详细分析
    const results = this.map(bench => ({
      name: bench.name,
      hz: bench.hz,
      rme: bench.stats.rme,
      samples: bench.stats.sample.length
    }));
    
    console.log('  📈 稳定性分析:');
    results.forEach(r => {
      const stability = r.rme < 1 ? '⭐⭐⭐⭐⭐' : 
                       r.rme < 5 ? '⭐⭐⭐⭐' : 
                       r.rme < 10 ? '⭐⭐⭐' : 
                       r.rme < 50 ? '⭐⭐' : '⭐';
      console.log(`     ${r.name.split(' - ')[0]}: ${stability} (误差 ±${r.rme.toFixed(2)}%)`);
    });
    console.log('');
  })
  .run();

// ============================================
// 测试 4: 响应式更新（带副作用）
// ============================================
console.log('📊 测试 4: 响应式更新（带副作用）');
const reactiveSuite = new Benchmark.Suite();

reactiveSuite
  .add('Formily - 响应式更新', () => {
    const obj = formulyObservable({ count: 0 });
    let result = 0;
    const dispose = formulyAutorun(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    dispose();
  })
  .add('NX - 响应式更新', () => {
    const obj = nxObservable({ count: 0 });
    let result = 0;
    const reaction = nxObserve(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    reaction();
  })
  .add('Vue - 响应式更新', () => {
    const obj = vueReactive({ count: 0 });
    let result = 0;
    const stop = vueEffect(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    stop();
  })
  .add('MobX - 响应式更新', () => {
    const obj = mobxObservable({ count: 0 });
    let result = 0;
    const dispose = mobxAutorun(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    dispose();
  })
  .on('cycle', (event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest');
    console.log('  ✅ 最快: ' + fastest.map('name'));
    
    // 显示详细分析
    const results = this.map(bench => ({
      name: bench.name,
      hz: bench.hz,
      rme: bench.stats.rme,
      samples: bench.stats.sample.length
    }));
    
    console.log('  📈 稳定性分析:');
    results.forEach(r => {
      const stability = r.rme < 1 ? '⭐⭐⭐⭐⭐' : 
                       r.rme < 5 ? '⭐⭐⭐⭐' : 
                       r.rme < 10 ? '⭐⭐⭐' : 
                       r.rme < 50 ? '⭐⭐' : '⭐';
      console.log(`     ${r.name.split(' - ')[0]}: ${stability} (误差 ±${r.rme.toFixed(2)}%)`);
    });
    console.log('');
  })
  .run();

// ============================================
// 测试 5: 深层嵌套对象
// ============================================
console.log('📊 测试 5: 深层嵌套对象操作');
const nestedSuite = new Benchmark.Suite();

nestedSuite
  .add('Formily - 深层嵌套对象', () => {
    const obj = formulyObservable({
      level1: {
        level2: {
          level3: {
            value: 0
          }
        }
      }
    });
    obj.level1.level2.level3.value = 100;
  })
  .add('NX - 深层嵌套对象', () => {
    const obj = nxObservable({
      level1: {
        level2: {
          level3: {
            value: 0
          }
        }
      }
    });
    obj.level1.level2.level3.value = 100;
  })
  .add('Vue - 深层嵌套对象', () => {
    const obj = vueReactive({
      level1: {
        level2: {
          level3: {
            value: 0
          }
        }
      }
    });
    obj.level1.level2.level3.value = 100;
  })
  .add('MobX - 深层嵌套对象', () => {
    const obj = mobxObservable({
      level1: {
        level2: {
          level3: {
            value: 0
          }
        }
      }
    });
    obj.level1.level2.level3.value = 100;
  })
  .on('cycle', (event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest');
    console.log('  ✅ 最快: ' + fastest.map('name'));
    
    // 显示详细分析
    const results = this.map(bench => ({
      name: bench.name,
      hz: bench.hz,
      rme: bench.stats.rme,
      samples: bench.stats.sample.length
    }));
    
    console.log('  📈 稳定性分析:');
    results.forEach(r => {
      const stability = r.rme < 1 ? '⭐⭐⭐⭐⭐' : 
                       r.rme < 5 ? '⭐⭐⭐⭐' : 
                       r.rme < 10 ? '⭐⭐⭐' : 
                       r.rme < 50 ? '⭐⭐' : '⭐';
      console.log(`     ${r.name.split(' - ')[0]}: ${stability} (误差 ±${r.rme.toFixed(2)}%)`);
    });
    console.log('');
  })
  .run();

// ============================================
// 测试 6: 数组操作
// ============================================
console.log('📊 测试 6: 数组操作');
const arraySuite = new Benchmark.Suite();

arraySuite
  .add('Formily - 数组操作', () => {
    const arr = formulyObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  })
  .add('NX - 数组操作', () => {
    const arr = nxObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  })
  .add('Vue - 数组操作', () => {
    const arr = vueReactive([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  })
  .add('MobX - 数组操作', () => {
    const arr = mobxObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  })
  .on('cycle', (event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest');
    console.log('  ✅ 最快: ' + fastest.map('name'));
    
    // 显示详细分析
    const results = this.map(bench => ({
      name: bench.name,
      hz: bench.hz,
      rme: bench.stats.rme,
      samples: bench.stats.sample.length
    }));
    
    console.log('  📈 稳定性分析:');
    results.forEach(r => {
      const stability = r.rme < 1 ? '⭐⭐⭐⭐⭐' : 
                       r.rme < 5 ? '⭐⭐⭐⭐' : 
                       r.rme < 10 ? '⭐⭐⭐' : 
                       r.rme < 50 ? '⭐⭐' : '⭐';
      console.log(`     ${r.name.split(' - ')[0]}: ${stability} (误差 ±${r.rme.toFixed(2)}%)`);
    });
    console.log('');
  })
  .run();

// ============================================
// 测试 7: 批量更新
// ============================================
console.log('📊 测试 7: 批量更新（100次）');
const batchSuite = new Benchmark.Suite();

batchSuite
  .add('Formily - 批量更新', () => {
    const obj = formulyObservable({ count: 0 });
    let result = 0;
    const dispose = formulyAutorun(() => {
      result = obj.count;
    });
    for (let i = 0; i < 100; i++) {
      obj.count = i;
    }
    dispose();
  })
  .add('NX - 批量更新', () => {
    const obj = nxObservable({ count: 0 });
    let result = 0;
    const reaction = nxObserve(() => {
      result = obj.count;
    });
    for (let i = 0; i < 100; i++) {
      obj.count = i;
    }
    reaction();
  })
  .add('Vue - 批量更新', () => {
    const obj = vueReactive({ count: 0 });
    let result = 0;
    const stop = vueEffect(() => {
      result = obj.count;
    });
    for (let i = 0; i < 100; i++) {
      obj.count = i;
    }
    stop();
  })
  .add('MobX - 批量更新', () => {
    const obj = mobxObservable({ count: 0 });
    let result = 0;
    const dispose = mobxAutorun(() => {
      result = obj.count;
    });
    for (let i = 0; i < 100; i++) {
      obj.count = i;
    }
    dispose();
  })
  .on('cycle', (event) => {
    console.log('  ' + String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest');
    console.log('  ✅ 最快: ' + fastest.map('name'));
    
    // 显示详细分析
    const results = this.map(bench => ({
      name: bench.name,
      hz: bench.hz,
      rme: bench.stats.rme,
      samples: bench.stats.sample.length
    }));
    
    console.log('  📈 稳定性分析:');
    results.forEach(r => {
      const stability = r.rme < 1 ? '⭐⭐⭐⭐⭐' : 
                       r.rme < 5 ? '⭐⭐⭐⭐' : 
                       r.rme < 10 ? '⭐⭐⭐' : 
                       r.rme < 50 ? '⭐⭐' : '⭐';
      console.log(`     ${r.name.split(' - ')[0]}: ${stability} (误差 ±${r.rme.toFixed(2)}%)`);
    });
    console.log('');
  })
  .run();

console.log('✨ 所有测试完成！');
