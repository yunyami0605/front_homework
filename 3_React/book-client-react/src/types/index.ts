export type FormType = {
  title: string | null;
  author: string | null;
  isbn: string | null;
  price: number | null;
  publishDate: string | null;
};

export type BookItem = {
  author: string;
  // detail: {id: number, description: string; language: string pageCount: 416}
  id: number;
  isbn: string;
  price: number;
  publishDate: string;
  title: string;
  detail: BookDetail;
};

export type BookDetail = {
  coverImageUrl: string | null;
  description: string | null;
  edition: string | null;
  id: number;
  language: string | null;
  pageCount: number;
  publisher: string | null;
};
