import LoadingSpinner from "./loading/LoadingSpinner";
import { BookForm } from "./form/BookForm";
import { BookSearch } from "./search/BookSearch";
import styles from "./BookManager.module.scss";
import { BookTable } from "./table/BookTable";
import { apiCall } from "../libs/api";
import { useEffect, useState } from "react";
import type { BookItem, FormType } from "../types";
import type { AxiosError } from "axios";
import MessageContainer from "./MessageContainer";
import BookDetailModal from "./modal/BookDetailModal";
import { BookEditModal } from "./modal/BookEditModal";

function BookManager() {
  const [loading, setLoading] = useState(false);

  const [books, setBooks] = useState<BookItem[]>([]);
  const [edittingBook, setEdittingBook] = useState<BookItem | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  const [message, setMessage] = useState<{
    message: string;
    type: "success" | "error" | "info" | "default";
  }>({
    message: "",
    type: "info",
  });
  const initForm = {
    title: null,
    author: null,
    isbn: null,
    price: null,
    publishDate: null,
  };

  const [form, setForm] = useState<FormType>(initForm);

  const [editForm, setEditForm] = useState<FormType>(initForm);

  /**
   *@description book 정보 조회 api
   */
  const bookRefetch = async () => {
    setLoading(true);

    try {
      const res = await apiCall<BookItem[]>({
        method: "GET",
        url: "/books",
      });

      if (res.status === 200) {
        setBooks(res.data);
      }
    } catch (error) {
      const _error = error as AxiosError;
      console.log(_error);
    } finally {
      setLoading(false);
    }
  };

  /**
   *@description 제출 이벤트
   */
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || form.title.trim() === "") {
      alert("제목을 입력하세요.");
      return;
    }

    if (!form.author || form.author.trim() === "") {
      alert("저자를 입력하세요.");
      return;
    }

    if (!form.isbn || !/^\d{10}(\d{3})?$/.test(form.isbn)) {
      alert("ISBN은 10자리 또는 13자리 숫자여야 합니다.");
      return;
    }

    if (
      form.price === null ||
      isNaN(Number(form.price)) ||
      Number(form.price) <= 0
    ) {
      alert("가격은 0보다 큰 숫자여야 합니다.");
      return;
    }

    if (!form.publishDate || isNaN(Date.parse(form.publishDate))) {
      alert("출판 날짜를 올바르게 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await apiCall({
        method: "POST",
        url: "/books",
        data: form,
      });

      if (res.status === 200) {
        bookRefetch();
        setForm(initForm);
      }
    } catch (error) {
      const _error = error as AxiosError;
      console.log(_error);
    } finally {
      setLoading(false);
    }
  };

  /**
   *@description 제출 이벤트
   */
  const handlePatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!editForm.title || editForm.title.trim() === "") {
      alert("제목을 입력하세요.");
      return;
    }

    if (!editForm.author || editForm.author.trim() === "") {
      alert("저자를 입력하세요.");
      return;
    }

    if (!editForm.isbn || !/^\d{10}(\d{3})?$/.test(editForm.isbn)) {
      alert("ISBN은 10자리 또는 13자리 숫자여야 합니다.");
      return;
    }

    if (
      editForm.price === null ||
      isNaN(Number(editForm.price)) ||
      Number(editForm.price) <= 0
    ) {
      alert("가격은 0보다 큰 숫자여야 합니다.");
      return;
    }

    if (!editForm.publishDate || isNaN(Date.parse(editForm.publishDate))) {
      alert("출판 날짜를 올바르게 입력하세요.");
      return;
    }

    try {
      const res = await apiCall({
        method: "PUT",
        url: `/books/${edittingBook?.id}`,
        data: editForm,
      });

      if (res.status === 200) {
        setEdittingBook(null);
        setEditForm(initForm);
        bookRefetch();
      }
    } catch (error) {
      const _error = error as AxiosError;
      console.log(_error);
    } finally {
      setLoading(false);
    }
  };

  /**
   *@description 폼 수정 이벤트
   */
  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _target = e.target;
    setForm((prev) => ({ ...prev, [_target.name]: _target.value }));
  };

  const onChangeEditForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _target = e.target;
    setEditForm((prev) => ({ ...prev, [_target.name]: _target.value }));
  };

  /**
   *@description 테이블에서 수정 클릭 이벤트
   */
  const onSelectedEdittingBook = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: BookItem
  ) => {
    e.stopPropagation();

    setEdittingBook(item);
    setEditForm(item);
  };

  /**
   *@description 도서 삭제 이벤트
   */
  const onDelete = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    book: BookItem
  ) => {
    e.stopPropagation();
    setLoading(true);

    if (confirm(`[id: ${book.id}] 정말로 수정하시겠습니까?`)) {
      try {
        const res = await apiCall({
          method: "DELETE",
          url: `/books/${book.id}`,
        });

        if (res.status === 204) {
          setMessage({ message: "삭제가 완료되었습니다.", type: "success" });

          bookRefetch();
        }
      } catch (error) {
        //
        console.log(error);
        const _error = error as AxiosError;
        setMessage({ message: _error.message, type: "success" });
      } finally {
        setLoading(false);
      }
    }
  };

  // 도서 검색
  const onSearch = async (title: string) => {
    //
    try {
      const res = await apiCall<BookItem[]>({
        method: "GET",
        url: "/books/search/title",
        params: {
          title,
        },
      });

      if (res.status === 200) {
        setBooks(res.data);
      }
    } catch (error) {
      const _error = error as AxiosError;
      console.log(_error);
    }
  };

  useEffect(() => {
    bookRefetch();
  }, []);

  return (
    <div className={styles.container}>
      {loading && <LoadingSpinner />}

      <MessageContainer {...message} />

      <BookForm
        form={{
          title: null,
          author: null,
          isbn: null,
          price: null,
          publishDate: null,
        }}
        handleSubmit={handleCreateSubmit}
        onChangeForm={onChangeForm}
      />

      <BookSearch onSearch={onSearch} />

      <BookTable
        onSelect={(book) => setSelectedBook(book)}
        books={books}
        onDelete={onDelete}
        onEdit={onSelectedEdittingBook}
      />

      <BookDetailModal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
      />

      <BookEditModal
        isOpen={!!edittingBook}
        onClose={() => setEdittingBook(null)}
        form={editForm}
        onChangeForm={onChangeEditForm}
        onSubmit={handlePatchSubmit}
      />
    </div>
  );
}

export default BookManager;
