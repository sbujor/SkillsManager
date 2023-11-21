'use strict';

import log from '../services/logService.js';

const errorJsonReponse = (f) => {
    return function (err, req, res, next) {
        log.error(`Error. Formatting error as json. ${err.message || err}`);

        if (res.headersSent) return next(err);

        const errorJsonResponseMessage = {
            statusCode: err.statusCode || 500,
            message: err.message || err,
        };

        res.status(err.statusCode || 500).json(errorJsonResponseMessage);
    };
};

export default errorJsonReponse;
