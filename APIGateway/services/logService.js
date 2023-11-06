'use strict';
import winston from 'winston';
import 'winston-daily-rotate-file';

//by default, a new instance of a class is created each time it is imported, therefore we create a single instance
const LogService = (function () {
    let instance = null;
    function LogService() {
        const winstonFormat = winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.align(),
            winston.format.printf(
                (info) => `${info.timestamp} ${info.level}: ${info.message}`,
            ),
        );

        const fileTransport = new winston.transports.DailyRotateFile({
            levels: winston.config.syslog.levels,
            level: 'error',
            format: winstonFormat,
            filename: './logs/auth-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: false,
            maxSize: 10240000,
            maxFiles: 100,
            timestamp: () => {
                const today = new Date();
                return '[' + process.pid + '] ' + today.toISOString();
            },
            silent: false,
        });

        const t = {
            console: new winston.transports.Console({
                levels: winston.config.syslog.levels,
                level: 'debug',
                format: winstonFormat,
            }),
            file: fileTransport,
        };
        const logger = winston.createLogger({
            transports: [t.console, t.file],
        });
        this.logger = logger;
    }

    return {
        getInstance: function () {
            if (instance === null) {
                instance = new LogService();
                instance.constructor = null;
            }
            return instance.logger;
        },
    };
})();

export default LogService.getInstance();
