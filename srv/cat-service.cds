using my.bookshop as my from '../db/data-model';

service CatalogService {
    @readonly entity Books as projection on my.Books;
    entity Employees as projection on my.Employees; 
    entity Comments as projection on my.Comments;
}
