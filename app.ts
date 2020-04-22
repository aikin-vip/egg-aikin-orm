import { Application } from 'egg';
import { createConnection, createConnections, getCustomRepository, useContainer } from 'typeorm';
import { Container } from 'typedi';

const hasTsLoader = typeof require.extensions['.ts'] === 'function';

function handleConfig(config: any, _env: string) {
  if (hasTsLoader) {
    return config;
  }
  const keys = [ 'entities', 'migrations', 'subscribers' ];
  for (const key of keys) {
    if (config instanceof Array) {
      for (let i = 0; i < config.length;) {
        if (config[i][key]) {
          config[i][key] = config[i][key].map((item: string) =>
            item.replace(/\.ts$/, '.js'),
          );
        }
      }
    } else {
      if (config[key]) {
        config[key] = config[key].map((item: string) =>
          item.replace(/\.ts$/, '.js'),
        );
      }
    }
  }
  return config;
}

export default class AppBootHook {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async didLoad() {
    // this.app.coreLogger.info('[egg-aikin-orm] egg-aikin-aut begin start');
    // const start = Date.now();
    const config = this.app.config.orm;
    if (!config) {
      throw new Error('please config orm in config file');
    }

    try {
      const typeormConfig = handleConfig(config, this.app.config.env);

      useContainer(Container);

      await (typeormConfig instanceof Array ? createConnections(typeormConfig) : createConnection(typeormConfig));

      this.app.logger.info('[egg-aikin-orm]', 'orm connection success!');

      this.app.loader.loadToContext(this.app.baseDir + '/app/entity', 'entity', { caseStyle: 'lower' });

      this.app.loader.loadToContext(this.app.baseDir + '/app/repository', 'repository', {
        caseStyle: 'lower',
        initializer: repository => getCustomRepository(repository as any),
      });

      if (typeormConfig instanceof Array) {
        typeormConfig.map(value => this.app.logger.info('[egg-aikin-orm]', 'connection: ' + JSON.stringify(value)));
      } else {
        this.app.logger.info('[egg-aikin-orm]', 'connection: ' + JSON.stringify(typeormConfig));
      }
      // this.app.coreLogger.info('[egg-aikin-orm] egg-aikin-auth started use %d ms', Date.now() - start);
    } catch (error) {
      this.app.logger.error('[egg-aikin-orm]', 'mysql connection error!');
      this.app.logger.error(error);
    }
  }
}
