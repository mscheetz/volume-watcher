export class PagedResponse<T> {
    constructor() {}

    data: T;
    total: number;
    pages: number;
    page: number;
    size: number;
}