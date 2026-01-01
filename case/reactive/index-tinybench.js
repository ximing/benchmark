import { Bench } from 'tinybench';
import { observable as formulyObservable, autorun as formulyAutorun } from '@formily/reactive';
import { observable as nxObservable, observe as nxObserve } from '@nx-js/observer-util';
import { reactive as vueReactive, effect as vueEffect } from '@vue/reactivity';
import { observable as mobxObservable, autorun as mobxAutorun, configure } from 'mobx';
// 配置 MobX
configure({ enforceActions: 'never' });

console.log('🚀 开始响应式库性能基准测试 (Tinybench)\n');
console.log('📖 数据说明：');
console.log('  • ops/sec: 每秒操作数，数值越大性能越好');
console.log('  • avg: 平均执行时间，数值越小越好');
console.log('  • min/max: 最小/最大执行时间');
console.log('  • p75/p99: 75%/99% 分位数\n');

// ============================================
// 测试 1: 简单对象创建
// ============================================
console.log('📊 测试 1: 简单对象创建');
const createBench = new Bench({ time: 1000 });

createBench
  .add('Formily', () => {
    const obj = formulyObservable({ count: 0, name: 'test' });
  })
  .add('NX', () => {
    const obj = nxObservable({ count: 0, name: 'test' });
  })
  .add('Vue', () => {
    const obj = vueReactive({ count: 0, name: 'test' });
  })
  .add('MobX', () => {
    const obj = mobxObservable({ count: 0, name: 'test' });
  });

await createBench.run();
printResults(createBench);

// ============================================
// 测试 2: 读取属性
// ============================================
console.log('\n📊 测试 2: 读取属性');
const readBench = new Bench({ time: 1000 });

const formulyObj = formulyObservable({ count: 0, name: 'test' });
const nxObj = nxObservable({ count: 0, name: 'test' });
const vueObj = vueReactive({ count: 0, name: 'test' });
const mobxObj = mobxObservable({ count: 0, name: 'test' });

readBench
  .add('Formily', () => {
    const val = formulyObj.count;
  })
  .add('NX', () => {
    const val = nxObj.count;
  })
  .add('Vue', () => {
    const val = vueObj.count;
  })
  .add('MobX', () => {
    const val = mobxObj.count;
  });

await readBench.run();
printResults(readBench);

// ============================================
// 测试 3: 修改属性
// ============================================
console.log('\n📊 测试 3: 修改属性');
const writeBench = new Bench({ time: 1000 });

writeBench
  .add('Formily', () => {
    formulyObj.count++;
  })
  .add('NX', () => {
    nxObj.count++;
  })
  .add('Vue', () => {
    vueObj.count++;
  })
  .add('MobX', () => {
    mobxObj.count++;
  });

await writeBench.run();
printResults(writeBench);

// ============================================
// 测试 4: 响应式更新（带副作用）
// ============================================
console.log('\n📊 测试 4: 响应式更新（带副作用）');
const reactiveBench = new Bench({ time: 1000 });

reactiveBench
  .add('Formily', () => {
    const obj = formulyObservable({ count: 0 });
    let result = 0;
    const dispose = formulyAutorun(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    dispose();
  })
  .add('NX', () => {
    const obj = nxObservable({ count: 0 });
    let result = 0;
    const reaction = nxObserve(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    reaction();
  })
  .add('Vue', () => {
    const obj = vueReactive({ count: 0 });
    let result = 0;
    const stop = vueEffect(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    stop();
  })
  .add('MobX', () => {
    const obj = mobxObservable({ count: 0 });
    let result = 0;
    const dispose = mobxAutorun(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    dispose();
  });

await reactiveBench.run();
printResults(reactiveBench);

// ============================================
// 测试 5: 深层嵌套对象
// ============================================
console.log('\n📊 测试 5: 深层嵌套对象操作');
const nestedBench = new Bench({ time: 1000 });

nestedBench
  .add('Formily', () => {
    const obj = formulyObservable({
      level1: { level2: { level3: { value: 0 } } }
    });
    obj.level1.level2.level3.value = 100;
  })
  .add('NX', () => {
    const obj = nxObservable({
      level1: { level2: { level3: { value: 0 } } }
    });
    obj.level1.level2.level3.value = 100;
  })
  .add('Vue', () => {
    const obj = vueReactive({
      level1: { level2: { level3: { value: 0 } } }
    });
    obj.level1.level2.level3.value = 100;
  })
  .add('MobX', () => {
    const obj = mobxObservable({
      level1: { level2: { level3: { value: 0 } } }
    });
    obj.level1.level2.level3.value = 100;
  });

await nestedBench.run();
printResults(nestedBench);

// ============================================
// 测试 6: 数组操作
// ============================================
console.log('\n📊 测试 6: 数组操作');
const arrayBench = new Bench({ time: 1000 });

arrayBench
  .add('Formily', () => {
    const arr = formulyObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  })
  .add('NX', () => {
    const arr = nxObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  })
  .add('Vue', () => {
    const arr = vueReactive([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  })
  .add('MobX', () => {
    const arr = mobxObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  });

await arrayBench.run();
printResults(arrayBench);

// ============================================
// 测试 7: 批量更新
// ============================================
console.log('\n📊 测试 7: 批量更新（100次）');
const batchBench = new Bench({ time: 1000 });

batchBench
  .add('Formily', () => {
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
  .add('NX', () => {
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
  .add('Vue', () => {
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
  .add('MobX', () => {
    const obj = mobxObservable({ count: 0 });
    let result = 0;
    const dispose = mobxAutorun(() => {
      result = obj.count;
    });
    for (let i = 0; i < 100; i++) {
      obj.count = i;
    }
    dispose();
  });

await batchBench.run();
printResults(batchBench);

console.log('\n✨ 所有测试完成！');

// ============================================
// 辅助函数：打印结果
// ============================================
function printResults(bench) {
  const tasks = bench.tasks.map(task => ({
    name: task.name,
    hz: task.result?.hz || 0,
    mean: task.result?.mean || 0,
    min: task.result?.min || 0,
    max: task.result?.max || 0,
    p75: task.result?.p75 || 0,
    p99: task.result?.p99 || 0,
    samples: task.result?.samples?.length || 0
  }));

  // 找出最快的
  const fastest = tasks.reduce((a, b) => a.hz > b.hz ? a : b);

  // 打印表格
  console.log('\n┌─────────────┬──────────────────┬──────────────┬──────────────┬──────────────┐');
  console.log('│ 库名称      │ ops/sec          │ 平均时间     │ p75          │ p99          │');
  console.log('├─────────────┼──────────────────┼──────────────┼──────────────┼──────────────┤');
  
  tasks.forEach(task => {
    const isFastest = task.name === fastest.name;
    const marker = isFastest ? '🏆' : '  ';
    const name = task.name.padEnd(9);
    const hz = formatNumber(task.hz).padStart(14);
    const mean = formatTime(task.mean).padStart(10);
    const p75 = formatTime(task.p75).padStart(10);
    const p99 = formatTime(task.p99).padStart(10);
    
    console.log(`│ ${marker}${name} │ ${hz} │ ${mean} │ ${p75} │ ${p99} │`);
  });
  
  console.log('└─────────────┴──────────────────┴──────────────┴──────────────┴──────────────┘');
  console.log(`\n✅ 最快: ${fastest.name} (${formatNumber(fastest.hz)} ops/sec)`);
  
  // 性能对比
  console.log('\n📊 相对性能:');
  tasks
    .sort((a, b) => b.hz - a.hz)
    .forEach(task => {
      const ratio = (task.hz / fastest.hz * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(ratio / 5));
      console.log(`  ${task.name.padEnd(10)} ${bar} ${ratio}%`);
    });
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return num.toFixed(0);
}

function formatTime(ms) {
  if (ms < 0.001) {
    return (ms * 1000000).toFixed(2) + 'ns';
  } else if (ms < 1) {
    return (ms * 1000).toFixed(2) + 'μs';
  }
  return ms.toFixed(2) + 'ms';
}
