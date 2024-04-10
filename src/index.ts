import {Context, Schema} from 'koishi'
import {Request} from "./utils/request";
import {paramsChecker} from "./utils/paramsChecker";

export const name = 'zerotier'

export interface Config {
  CENTRAL_TOKEN: string,
  NETWORK_ID: string,
  NETWORK_MAX_MEMBERS: string
}

export const Config: Schema<Config> = Schema.object({
  CENTRAL_TOKEN: Schema.string().description("API Access Token，获取地址：https://my.zerotier.com/account").default(""),
  NETWORK_ID: Schema.string().description("需要控制的Zerotier Network ID").default(""),
  NETWORK_MAX_MEMBERS: Schema.string().description("该Zerotier Network最大容许的成员上限，免费版为25人").default("25"),
})

export function apply(ctx: Context, config: Config) {
  const request = new Request(ctx, config.CENTRAL_TOKEN)
  ctx.command('zerotier', 'zerotier管理工具').action((_) => {
    return '使用如下指令以查询插件可用功能: help zerotier'
  })
  // ctx.command('test', 'test').action(async (_) => {
  //
  // })
  /**
   * 加入网络
   */
  ctx.command('zerotier.join <id> <name>', `加入网络，格式为zerotier join {Zerotier ID} {昵称}，如: zerotier join 1919810abc admin`)
    .alias('加入')
    .action(async (_, id, name) => {
      const checker = paramsChecker(config)
      if (checker) {
        return checker;
      }
      if (!id || id.length !== 10) {
        return '请输入你的10位Zerotier Network ID'
      }
      const nameRegEx = /^[A-Za-z0-9]{1,10}$/;
      if (!name) {
        return '请输入你的昵称'
      } else if (!nameRegEx.test(name)) {
        return '昵称长度必须1到10位，只接受英文和数字'
      }
      const membersResp = await request.get(`/network/${config.NETWORK_ID}`)
      if (Number(membersResp.totalMemberCount) >= Number(config.NETWORK_MAX_MEMBERS)) {
        return '该Zerotier网络成员已达上限，请联系管理员'
      }
      const memberResp = await request.get(`/network/${config.NETWORK_ID}/member/${id}`).catch(e => e)
      if (memberResp.errMsg) {
        return memberResp.errMsg
      }
      const authorizedStatus = memberResp?.config?.authorized ?? false;
      if (authorizedStatus) {
        return '你已经加入了该网络。'
      }
      const joinResp = await request.post(`/network/${config.NETWORK_ID}/member/${id}`, {
        name,
        description: name,
        config: {authorized: true}
      }).catch(e => e)
      const joinStatus = joinResp?.config?.authorized ?? false;
      if (joinStatus) {
        return '加入成功！'
      } else return '加入失败，请联系管理员！'
    })

  /**
   * 踢出网络
   */
  ctx.command('zerotier.kick <id> <name>', `踢出网络，格式为zerotier kick {Zerotier ID}，如: zerotier kick 1919810abc`)
    .alias('踢出')
    .action(async (_, id) => {
      const checker = paramsChecker(config)
      if (checker) {
        return checker;
      }
      if (!id || id.length !== 10) {
        return '请输入10位Zerotier Network ID'
      }
      const kickResp = await request.delete(`/network/${config.NETWORK_ID}/member/${id}`).catch(e => e)
      if (kickResp) {
        return '踢出成功！'
      } else return '踢出失败，请联系管理员！'
    })
}
