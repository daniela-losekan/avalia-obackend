import { badRequest, ok } from '../../../../core/presentation';
import { HttpRequest, HttpResponse } from '../../../../core/presentation';
import { RequireFieldsValidator } from '../../../../core/presentation';
import { Scrap } from '../../domain';

export class ScrapMiddleware {
    private fields = ['title', 'userUID'];

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const body: Scrap = request.body;

        for (const field of this.fields) {
            const error = new RequireFieldsValidator(field).validate(body);

            if (error) {
                return badRequest(error);
            }
        }

        return ok({});
    }
}