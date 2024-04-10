import {Context} from 'koishi'
import RequestConfig from 'undios'

export class Request {
  private ctx: any;
  private readonly CENTRAL_TOKEN: string;
  private readonly AUTH_HEADERS: any;
  private readonly CENTRAL_ENDPOINT = 'https://api.zerotier.com/api/v1'

  constructor(ctx: Context, CENTRAL_TOKEN: string) {
    this.ctx = ctx;
    this.CENTRAL_TOKEN = CENTRAL_TOKEN;
    this.AUTH_HEADERS = {Authorization: `token ${this.CENTRAL_TOKEN}`}
  }

  async get(url: string, config?: RequestConfig) {
    try {
      return await this.ctx.http.get(
        `${this.CENTRAL_ENDPOINT}${url}`,
        {headers: this.AUTH_HEADERS, ...config}
      );
    } catch (e) {
      const status = e?.response?.status ?? -1;
      if (status === 401 || status === 403) {
        throw {
          errMsg: 'CENTRAL_TOKEN配置错误，请检查！'
        };
      } else if (status === 404) {
        throw {
          errMsg: '参数错误，请检查！'
        };
      } else throw {
        errMsg: '未知错误。'
      };
    }
  }

  async post(url: string, data?: any, config?: RequestConfig) {
    try {
      return await this.ctx.http.post(
        `${this.CENTRAL_ENDPOINT}${url}`,
        data || {},
        {headers: this.AUTH_HEADERS, ...config}
      );
    } catch (e) {
      const status = e?.response?.status ?? -1;
      if (status === 401 || status === 403) {
        throw {
          errMsg: 'CENTRAL_TOKEN配置错误，请检查！'
        };
      } else if (status === 404) {
        throw {
          errMsg: '参数错误，请检查！'
        };
      } else throw {
        errMsg: '未知错误。'
      };
    }
  }

  async delete(url: string, config?: RequestConfig) {
    try {
      return await this.ctx.http.delete(
        `${this.CENTRAL_ENDPOINT}${url}`,
        {headers: this.AUTH_HEADERS, ...config}
      );
    } catch (e) {
      const status = e?.response?.status ?? -1;
      if (status === 401 || status === 403) {
        throw {
          errMsg: 'CENTRAL_TOKEN配置错误，请检查！'
        };
      } else if (status === 404) {
        throw {
          errMsg: '参数错误，请检查！'
        };
      } else throw {
        errMsg: '未知错误。'
      };
    }
  }
}
