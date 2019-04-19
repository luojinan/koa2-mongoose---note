/* 简易koa服务器（没有服务器，没有响应）
const Koa = require('koa') // 引入koa类，主要要大写（是个类class）
const bodyParser = require('koa-bodyparser') // 引入post请求解析
import { router } from './router/routes'

const app = new Koa() // 实例化Koa

app.use(bodyParser()) // 调用kao实例的use方法（插入中间件-堆积木）
app.use(router.routes()) // 调用use堆积木，传入路由模块的route方法

app.listen(9000)
console.log('app start at port 9000...')
*/

import Koa from 'koa' // 引入koa类，主要要大写（是个类class）
import bodyParser from 'koa-bodyparser' // 引入post请求解析
const Router = require('koa-router') // 引入koa路由模块（是个对象函数，函数内设置原型）--注意这里再加一个()
const router = new Router() // 把对象函数转为普通对象
import cors from 'koa2-cors' // 引入跨域
import mongoose from 'mongoose'
import { string } from '_postcss-selector-parser@5.0.0@postcss-selector-parser'

const app = new Koa() // 实例化Koa
// 处理跨域的配置
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous']
}))

app.use(bodyParser()) // 调用kao实例的use方法（插入中间件-堆积木）
app.use(router.routes()) // 调用use堆积木，传入路由模块的route方法

const db = mongoose.connect('mongodb://localhost/testDB', { useNewUrlParser: true }) // 连接或创建testDB数据库
// 创建数据库的表头实例
var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
})
var User = mongoose.model('User', UserSchema) // 创建表格User,并传入表头实例

// 手造表格User的数据变量
var user = {
  username: '123',
  password: '123',
  email: ''
}
var newUser = new User(user) // 写入表格数据，要new
newUser.save() // 更新表格

router.get('/', async(ctx, next) => {
  const data = await User.findOne({ username: '123' }) // 调用表格的查找方法
  const result = { // 创建响应返回的数据结构
    code: 200,
    response: data,
    ts: 12345
  }
  ctx.response.body = result // 直接把响应写进页面
  return result // return干嘛，return到network吗？
})

app.listen(9000)
console.log('app start at port 9000...')
