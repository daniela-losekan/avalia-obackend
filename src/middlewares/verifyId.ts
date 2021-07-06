import { NextFunction, Request, Response } from 'express';

export default function VerifyId(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'o id do recado não foi enviado.',
        });
    }
    next();
}