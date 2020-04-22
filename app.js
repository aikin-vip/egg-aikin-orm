"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
const hasTsLoader = typeof require.extensions['.ts'] === 'function';
function handleConfig(config, _env) {
    if (hasTsLoader) {
        return config;
    }
    const keys = ['entities', 'migrations', 'subscribers'];
    for (const key of keys) {
        if (config instanceof Array) {
            for (let i = 0; i < config.length;) {
                if (config[i][key]) {
                    config[i][key] = config[i][key].map((item) => item.replace(/\.ts$/, '.js'));
                }
            }
        }
        else {
            if (config[key]) {
                config[key] = config[key].map((item) => item.replace(/\.ts$/, '.js'));
            }
        }
    }
    return config;
}
class AppBootHook {
    constructor(app) {
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
            typeorm_1.useContainer(typedi_1.Container);
            await (typeormConfig instanceof Array ? typeorm_1.createConnections(typeormConfig) : typeorm_1.createConnection(typeormConfig));
            this.app.logger.info('[egg-aikin-orm]', 'orm connection success!');
            this.app.loader.loadToContext(this.app.baseDir + '/app/entity', 'entity', { caseStyle: 'lower' });
            this.app.loader.loadToContext(this.app.baseDir + '/app/repository', 'repository', {
                caseStyle: 'lower',
                initializer: repository => typeorm_1.getCustomRepository(repository),
            });
            if (typeormConfig instanceof Array) {
                typeormConfig.map(value => this.app.logger.info('[egg-aikin-orm]', 'connection: ' + JSON.stringify(value)));
            }
            else {
                this.app.logger.info('[egg-aikin-orm]', 'connection: ' + JSON.stringify(typeormConfig));
            }
            // this.app.coreLogger.info('[egg-aikin-orm] egg-aikin-auth started use %d ms', Date.now() - start);
        }
        catch (error) {
            this.app.logger.error('[egg-aikin-orm]', 'mysql connection error!');
            this.app.logger.error(error);
        }
    }
}
exports.default = AppBootHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQWlHO0FBQ2pHLG1DQUFtQztBQUVuQyxNQUFNLFdBQVcsR0FBRyxPQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssVUFBVSxDQUFDO0FBRXBFLFNBQVMsWUFBWSxDQUFDLE1BQVcsRUFBRSxJQUFZO0lBQzdDLElBQUksV0FBVyxFQUFFO1FBQ2YsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUNELE1BQU0sSUFBSSxHQUFHLENBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUUsQ0FBQztJQUN6RCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUN0QixJQUFJLE1BQU0sWUFBWSxLQUFLLEVBQUU7WUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUc7Z0JBQ2xDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFLENBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUM3QixDQUFDO2lCQUNIO2FBQ0Y7U0FDRjthQUFNO1lBQ0wsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FDN0IsQ0FBQzthQUNIO1NBQ0Y7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFFRCxNQUFxQixXQUFXO0lBRzlCLFlBQVksR0FBZ0I7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1gseUVBQXlFO1FBQ3pFLDRCQUE0QjtRQUM1QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztTQUNyRDtRQUVELElBQUk7WUFDRixNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWhFLHNCQUFZLENBQUMsa0JBQVMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sQ0FBQyxhQUFhLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQywyQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsMEJBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUU1RyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztZQUVuRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsYUFBYSxFQUFFLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRWxHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsRUFBRSxZQUFZLEVBQUU7Z0JBQ2hGLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixXQUFXLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyw2QkFBbUIsQ0FBQyxVQUFpQixDQUFDO2FBQ2xFLENBQUMsQ0FBQztZQUVILElBQUksYUFBYSxZQUFZLEtBQUssRUFBRTtnQkFDbEMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDN0c7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7YUFDekY7WUFDRCxvR0FBb0c7U0FDckc7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3BFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7Q0FDRjtBQTFDRCw4QkEwQ0MifQ==