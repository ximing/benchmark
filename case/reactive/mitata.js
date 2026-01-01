import { run, bench, group } from 'mitata';
import { observable as formulyObservable, autorun as formulyAutorun } from '@formily/reactive';
import { observable as nxObservable, observe as nxObserve } from '@nx-js/observer-util';
import { reactive as vueReactive, effect as vueEffect } from '@vue/reactivity';
import { observable as mobxObservable, autorun as mobxAutorun, configure } from 'mobx';
// 配置 MobX
configure({ enforceActions: 'never' });

console.log('🚀 开始响应式库性能基准测试 (Mitata)\n');

// ============================================
// 测试 1: 简单对象创建
// ============================================
group('📊 测试 1: 简单对象创建', () => {
  bench('MobX', () => {
    const obj = mobxObservable({ count: 0, name: 'test' });
  });
  
  bench('Formily', () => {
    const obj = formulyObservable({ count: 0, name: 'test' });
  });
  
  bench('NX', () => {
    const obj = nxObservable({ count: 0, name: 'test' });
  });
  
  bench('Vue', () => {
    const obj = vueReactive({ count: 0, name: 'test' });
  });
});

// ============================================
// 测试 2: 读取属性
// ============================================
const formulyObj = formulyObservable({ count: 0, name: 'test' });
const nxObj = nxObservable({ count: 0, name: 'test' });
const vueObj = vueReactive({ count: 0, name: 'test' });
const mobxObj = mobxObservable({ count: 0, name: 'test' });

group('📊 测试 2: 读取属性', () => {
  bench('MobX', () => {
    const val = mobxObj.count;
  });
  
  bench('Formily', () => {
    const val = formulyObj.count;
  });
  
  bench('NX', () => {
    const val = nxObj.count;
  });
  
  bench('Vue', () => {
    const val = vueObj.count;
  });
});

// ============================================
// 测试 3: 修改属性
// ============================================
group('📊 测试 3: 修改属性', () => {
  bench('Formily', () => {
    formulyObj.count++;
  });
  
  bench('NX', () => {
    nxObj.count++;
  });
  
  bench('Vue', () => {
    vueObj.count++;
  });
  
  bench('MobX', () => {
    mobxObj.count++;
  });
});

// ============================================
// 测试 4: 响应式更新（带副作用）
// ============================================
group('📊 测试 4: 响应式更新（带副作用）', () => {
  bench('MobX', () => {
    const obj = mobxObservable({ count: 0 });
    let result = 0;
    const dispose = mobxAutorun(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    dispose();
  });
  
  bench('Formily', () => {
    const obj = formulyObservable({ count: 0 });
    let result = 0;
    const dispose = formulyAutorun(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    dispose();
  });
  
  bench('NX', () => {
    const obj = nxObservable({ count: 0 });
    let result = 0;
    const reaction = nxObserve(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    reaction();
  });
  
  bench('Vue', () => {
    const obj = vueReactive({ count: 0 });
    let result = 0;
    const stop = vueEffect(() => {
      result = obj.count * 2;
    });
    obj.count = 10;
    stop();
  });
});

// ============================================
// 测试 5: 深层嵌套对象
// ============================================
group('📊 测试 5: 深层嵌套对象操作', () => {
  bench('MobX', () => {
    const obj = mobxObservable({
      level1: { level2: { level3: { value: 0 } } }
    });
    obj.level1.level2.level3.value = 100;
  });
  
  bench('Formily', () => {
    const obj = formulyObservable({
      level1: { level2: { level3: { value: 0 } } }
    });
    obj.level1.level2.level3.value = 100;
  });
  
  bench('NX', () => {
    const obj = nxObservable({
      level1: { level2: { level3: { value: 0 } } }
    });
    obj.level1.level2.level3.value = 100;
  });
  
  bench('Vue', () => {
    const obj = vueReactive({
      level1: { level2: { level3: { value: 0 } } }
    });
    obj.level1.level2.level3.value = 100;
  });
});

// ============================================
// 测试 6: 数组操作
// ============================================
group('📊 测试 6: 数组操作', () => {
  bench('MobX', () => {
    const arr = mobxObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  });
  
  bench('Formily', () => {
    const arr = formulyObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  });
  
  bench('NX', () => {
    const arr = nxObservable([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  });
  
  bench('Vue', () => {
    const arr = vueReactive([1, 2, 3, 4, 5]);
    arr.push(6);
    arr.pop();
    arr[0] = 10;
  });
});

// ============================================
// 测试 7: 批量更新
// ============================================
group('📊 测试 7: 批量更新（100次）', () => {
  bench('MobX', () => {
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
  
  bench('Formily', () => {
    const obj = formulyObservable({ count: 0 });
    let result = 0;
    const dispose = formulyAutorun(() => {
      result = obj.count;
    });
    for (let i = 0; i < 100; i++) {
      obj.count = i;
    }
    dispose();
  });
  
  bench('NX', () => {
    const obj = nxObservable({ count: 0 });
    let result = 0;
    const reaction = nxObserve(() => {
      result = obj.count;
    });
    for (let i = 0; i < 100; i++) {
      obj.count = i;
    }
    reaction();
  });
  
  bench('Vue', () => {
    const obj = vueReactive({ count: 0 });
    let result = 0;
    const stop = vueEffect(() => {
      result = obj.count;
    });
    for (let i = 0; i < 100; i++) {
      obj.count = i;
    }
    stop();
  });
});

await run();
console.log('\n✨ 所有测试完成！');
