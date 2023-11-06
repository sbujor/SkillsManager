import log from '../services/logService.js';

const wrapAsync = (f) => {
    return async function (req, res, next) {
        try {
            await f(req, res, next);
        } catch (err) {
            log.error(
                `Wrap async caught an error. Details :  ${err.message || err} `,
            );
            next(err, req, res);
        }
    };
};

export default wrapAsync;
