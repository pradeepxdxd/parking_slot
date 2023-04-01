import {validationResult} from "express-validator";

export const validation = (validations) => {
    return async (req, res, next) => {
        try {
            await Promise.all(validations.map(validation => validation.run(req)));
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                next();
            }
            else {
                res.status(400).json({
                    error: 1,
                    errors: errors.array()
                })
            }
        }
        catch (err) {
            res.status(400).json({
                'statusCode': 400,
                'err': 'Something went wrong'
            })
        }
    }
}
