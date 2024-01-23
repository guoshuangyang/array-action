## 功能描述
实现数据的深拷贝（数组对象中的label和key必须要存在）

1. 根据数组中的key进行批量赋予数据（数组对象的value上）
2. 获取数组中所有的value
3. 根据key值进行key值对应的item进行整体覆盖赋值
4. 根据key值获取key值对应的value的值
5. 设置根据key获取key对应的value

## 安装
```javascript
npm install array-action
```

## 使用
以下方数组为例（如无特殊描述，均采用改示例的数组）
```javascript
[{label: "测试1",key: "test1"},{label: '测试字段2',key: 'test2'}]
```
```javascript
import ArrayAction from 'array-action'
const cloneOption = new ArrayAction([
	{label: "测试1",key: "test1"},
	{label: '测试字段2',key: 'test2'}
]);
```
## 方法 (clone之后的) method
**除get开头方法外均支持链式调用包括clone**
### setKeyValue： 实现对某个key值的value进行覆盖更新
```javascript
let arr = cloneOption.clone().setKeyValue("test1", "test12");
console.log(JSON.stringify(arr)) 
// [{"label":"测试1","key":"test1","value":"test12"},{"label":"测试字段2","key":"test2"}]
```
### getKeyValue: 获取数据中某个key值的value值
```javascript
let arr = cloneOption.clone()
arr.setKeyValue("test1", "我是测试的value");
arr.getKeyValue("test1")  // 我是测试的value
```
### setArrValue: 将对象赋值给clone后的对象
```javascript
let arr = cloneOption.clone()
arr.setArrValue({
	test1: '我是test1的value',
	test2: '我是test2的value'
})
console.log(JSON.stringify(arr)) 
// [{"label":"测试1","key":"test1","value":"我是test1的value"},{"label":"测试字段2","key":"test2","value":"我是test2的value"}]
```
### getArrValue 与setArrValue对应
```javascript
let arr = cloneOption.clone()
arr.setArrValue({
	test1: "我是test1的value",
	test2: "我是test2的value"
})
console.log(arr.getArrValue()) // {test1: '我是test1的value', test2: '我是test2的value'}
```

### setKeyItem: 根据key覆盖更新该key对应的数据
```javascript
let arr = cloneOption.clone()
arr.setKeyItem("test1", {
	a: "aaa",
	b: "cccc",
	options: [{ ttt: "ttt" }]
})
console.log(JSON.stringify(arr))
// [{"key":"test1","a":"aaa","b":"cccc","options":[{"ttt":"ttt"}]},{"label":"测试字段2","key":"test2"}]
```

### addKeyItem: 根据key值添加该key对应的数据
```javascript
let arr = cloneOption.clone()
arr.addKeyItem({
	key: 'test3',
	a: "aaa",
	b: "cccc",
	options: [{ ttt: "ttt" }]
})
```

### getAll: 获取操作之后所有数组对象
```javascript
let arr = cloneOption.clone()
arr.setKeyItem("test1", {
	a: "aaa",
	b: "cccc",
	options: [{ ttt: "ttt" }]
})
console.log(arr.getAll())
// [
//   {
//     key: "test1",
//     a: "aaa",
//     b: "cccc",
//     options: [
//       {
//         ttt: "ttt"
//       }
//     ]
//   },
//   {
//     label: "测试字段2",
//     key: "test2"
//   }
// ]
```
## changeData： 修改clone的原数据的某个item（根据key）
注意：会影响到后续使用clone方法的内容，建议使用在初始化或者重新进行数据的拷贝时候使用。
场景一：我需要对某个内容进行赋值，比如我这个需要一个optipns的数组数据，以还原选择框时候可以使用changeData,这样只要是使用该数据源的，均可以拿到该item的options,如果是请求获取到的，可以节省数据源的请求次数。
```javascript
let arr = cloneOption.clone()
cloneOption.changeData("test1", {
	value: 1,
	options: [
		{
			label: "禁用",
			value: 0
		},
		{
			label: "启用",
			value: 1
		}
	]
})
console.log(arr) // 已经clone的数据，不会受到影响
console.log(JSON.stringify(cloneOption.clone().getAll())) // 会影响到后续clone的内容打印如下 [{"key":"test1","value":1,"options":[{"label":"禁用","value":0},{"label":"启用","value":1}]},{"label":"测试字段2","key":"test2"}]
```

