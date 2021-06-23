// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';

const resetMainPath = function (routes: any[], mainPath: string) {
  let newPath = mainPath;
  // 把用户输入/abc/ 转成 /abc
  if (newPath !== '/' && newPath.slice(-1) === '/') {
    newPath = newPath.slice(0, -1);
  }
  // 把用户输入abc 转成 /abc
  if (newPath !== '/' && newPath.slice(0, 1) !== '/') {
    newPath = `/${newPath}`;
  }
  return routes.map((element) => {
    if (element.isResetMainEdit) {
      return element;
    }
    if (element.path === '/' && !element.routes) {
      element.path = '/index';
      element.isResetMainEdit = true;
    }
    if (element.path === newPath) {
      element.path = '/';
      element.isResetMainEdit = true;
    }
    if (Array.isArray(element.routes)) {
      element.routes = resetMainPath(element.routes, mainPath);
    }
    return element;
  });
}

export default function (api: IApi) {
  api.logger.info('use plugin');

  api.modifyHTML(($) => {
    $('body').prepend(`<h1>hello umi plugin</h1>`);
    return $;
  });

  api.describe({
    key: 'mainPath',
    config: {
      schema(joi) {
        return joi.string();
      },
    },
  });

  if (api.userConfig.mainPath) {
    api.modifyRoutes((routes: any[]) => {
      return resetMainPath(routes, api.config.mainPath);
    });
  }
}
