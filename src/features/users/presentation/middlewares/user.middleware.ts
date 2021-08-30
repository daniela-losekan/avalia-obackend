
import { badRequest, ok } from '../../../../core/presentation';
import { HttpRequest, HttpResponse } from '../../../../core/presentation';
import { RequireFieldsValidator } from '../../../../core/presentation';
import { User } from '../../domain';

export class UserMiddleware {
    private fields = ['username', 'email', 'password'];

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const body: User = request.body;

        for (const field of this.fields) {
            const error = new RequireFieldsValidator(field).validate(body);

            if (error) {
                return badRequest(error);
            }
        }

        return ok({});
    }
}