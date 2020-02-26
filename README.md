### cloud-chain-demo

### 进入小程序目录，安装依赖包
```
cd cloud-chain-demo
npm  init
npm install --save icbsc.js
npm install --save buffer
npm install --save icbsc-text-encoding.js
npm install --save icbsc-fetch.js
```

### 微信开发者工具 中构建 npm包
- 点击右上角 详情 按钮，本地设置 勾选 使用npm模块
- 菜单栏中 工具点击 构建npm

### 查询服务器接口
- GetPatientInfo post数据:
```json
{"Pid": "420106201101011919", "IdType": 0}
```
response:
```json
{
  "data": [
    {
      "visitTime": "2012-11-30",
      "diagnosis": " 高血压",
      "mpiId": "f0089f5e-344c-489a-8dd1-1389e3f3746c",
      "pid": "29056",
      "times": "0",
      "label": " 门诊"
    },
    {
      "visitTime": "2013-07-24",
      "mpiId": "f0089f5e-344c-489a-8dd1-1389e3f3746c",
      "diagnosis": "白内障",
      "pid": "29053",
      "times": "1",
      "label": "住院"
    }],
  "errorMessage": "",
  "success": true
}
```

- GetPatientRecord post数据:
```json
{"mpiId": "f0089f5e-344c-489a-8dd1-1389e3f3746c", "times": 0}
```
response: 其中record字段为base64编码后的字符串
```json
{
  "data": [
    {
      "mpiId": "f0089f5e-344c-489a-8dd1-1389e3f3746c",
      "pid": "29056",
      "times": "0",
      "record": "",
    },
    {
      "mpiId": "f0089f5e-344c-489a-8dd1-1389e3f3746c",
      "pid": "29053",
      "times": "0",
      "record": "",
    }
  ],
  "errorMessage": "",
  "success": true
}
```

### record上链
- record采用context_free_data上链
```
const { Api, JsonRpc, JsSignatureProvider } = require('../../miniprogram_npm/icbsc.js/index.js')
const {fetchFunc} = require('../../miniprogram_npm/icbsc-fetch.js/index.js');
const { TextDecoder, TextEncoder } = require('../../miniprogram_npm/icbsc-text-encoding.js/index.js')
const privateKey1 = "PVT_SM2_hrjc7PFDDjSNgGdsP33uXMBeV2abGzNHumnPyMhfhiCbXoKMh"
const privateKeys = [privateKey1];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://xxx.xxx.xxx.xxx', { fetch: fetchFunc() });

const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

let context_free_data = []
try {
  // base64解码后上链
  let recordbuf = wx.base64ToArrayBuffer(record.record)
  context_free_data.push(new Uint8Array(recordbuf))
} catch(e) {
  console.log(e)
  return
}

api.transact({
  actions: [{
    account: 'icbs.test',
    name: 'addrecord',
    authorization: [{
      actor: 'xiaobaiyang3',
      permission: 'active'
    }],
    data: {
      mpId: record.mpId,
      pid: record.pid,
      times: record.times
    }
  }],
  context_free_data,
}, {
    blocksBehind: 3,
    expireSeconds: 150
  }).then(result => {
    console.log(result)
  }).catch(err => {
    console.log(JSON.stringify(err, null, 2))
  })

```
- record.js中的 getDeserializeContextFreeData 函数用于查询上链后的区块数据用于验证上链是否正确

### app.js 全局变量
- globalData.server 查询服务器地址
- globalData.nodeserver 区块链节点地址
- globalData中的info、record、recordxml 为page间数据传递
