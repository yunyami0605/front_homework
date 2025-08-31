// CSS 파일 불러오기
import "./css/style.css";

// 모듈들 불러오기 (구조분해할당 사용)
import { apiService } from "./modules/api.js";
import { validate } from "./modules/validation.js";
import { uiService } from "./modules/ui.js";
import { formatDate } from "./utils/helpers.js";

// 전역 상태
let editingBookId = null;

// DOM 요소들
let elements = {};

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", async () => {
  console.log("페이지가 로드되었습니다.");

  // DOM 요소 찾기
  findElements();

  // 이벤트 설정
  setupEvents();

  // 목록 로드
  await loadBooks();
});

// DOM 요소들 찾기
const findElements = () => {
  elements = {
    form: document.getElementById("book-form"),
    tableBody: document.getElementById("tablebody"),
    submitButton: document.getElementById("submit-button"),
    cancelButton: document.getElementById("cancel-button"),
    errorSpan: document.getElementById("formError"),
  };
};

// 이벤트 설정 (화살표 함수 사용)
const setupEvents = () => {
  // 폼 제출 이벤트
  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleFormSubmit();
  });

  // 취소 버튼 이벤트
  elements.cancelButton.addEventListener("click", () => {
    resetForm();
  });
};

// 폼 제출 처리 (async/await 사용)
const handleFormSubmit = async () => {
  console.log("폼이 제출되었습니다.");

  try {
    // 폼 데이터 가져오기
    const bookData = getFormData();

    // 유효성 검사
    const validation = validate(bookData);
    if (!validation.isValid) {
      uiService.showError(validation.message);
      focusField(validation.field);
      return;
    }

    // 수정 또는 생성 처리 TODO
    if (editingBookId) {
      await updateBook(editingBookId, bookData);
    } else {
      await createBook(bookData);
    }
  } catch (error) {
    console.error("폼 제출 오류:", error);
    uiService.showError(error.message);
  }
};

// 폼 데이터 가져오기 (구조분해할당 활용)
const getFormData = () => {
  const formData = new FormData(elements.form);

  // 기본값과 함께 구조분해할당
  const title = formData.get("title") || "";
  const author = formData.get("author") || "";
  const isbn = formData.get("isbn") || "";
  const price = formData.get("price") || "";
  const publishDate = formData.get("publishDate") || "";

  return {
    title: title.trim(),
    author: author.trim(),
    isbn: isbn.trim(),
    price: price.trim(),
    publishDate: publishDate.trim(),
  };
};

// 도서 등록
const createBook = async (bookData) => {
  console.log("등록 시작");

  try {
    uiService.setButtonLoading(elements.submitButton, true, "등록 중...");

    const result = await apiService.create(bookData);
    console.log("등록 성공:", result);

    uiService.showSuccess("도서정보가 성공적으로 등록되었습니다!");
    elements.form.reset();
    await loadBooks();
  } catch (error) {
    console.error("등록 오류:", error);
    uiService.showError(error.message);
  } finally {
    uiService.setButtonLoading(elements.submitButton, false, "도서 등록");
  }
};

// 도서 정보 수정
const updateBook = async (bookId, bookData) => {
  console.log("도서 수정 시작:", bookId);

  try {
    uiService.setButtonLoading(elements.submitButton, true, "수정 중...");

    const result = await apiService.update(bookId, bookData);
    console.log("수정 성공:", result);

    uiService.showSuccess("도서정보가 성공적으로 수정되었습니다!");
    resetForm();
    await loadBooks();
  } catch (error) {
    console.error("수정 오류:", error);
    uiService.showError(error.message);
  } finally {
    uiService.setButtonLoading(elements.submitButton, false, "도서 등록");
  }
};

// 도서 삭제
window.deleteBook = async (bookId, name) => {
  if (!confirm(`이름 = ${name} 도서를 정말로 삭제하시겠습니까?`)) {
    return;
  }

  console.log("도서를 삭제 시작:", bookId);

  try {
    await apiService.delete(bookId);
    console.log("삭제 성공");

    uiService.showSuccess("도서 성공적으로 삭제되었습니다!");
    await loadBooks();
  } catch (error) {
    console.error("삭제 오류:", error);
    uiService.showError(error.message);
  }
};

// 편집 모드
window.editBook = async (bookId) => {
  console.log("편집 시작:", bookId);

  try {
    const _book = await apiService.getOne(bookId);
    console.log("도서 정보:", _book);

    fillFormWithData(_book);
    setEditMode(bookId);
  } catch (error) {
    console.error("편집 오류:", error);
    uiService.showError(error.message);
  }
};

// 폼에 데이터 채우기
const fillFormWithData = (book) => {
  const {
    title = "",
    author = "",
    isbn = "",
    price = 0,
    publishDate = "-",
  } = book;

  elements.form.elements.title.value = title;
  elements.form.elements.author.value = author;
  elements.form.elements.isbn.value = isbn;
  elements.form.elements.price.value = price;
  elements.form.elements.publishDate.value = publishDate;
};

// 편집 모드 설정 (화살표 함수)
const setEditMode = (bookId) => {
  editingBookId = bookId;
  elements.submitButton.textContent = "도서 수정";
  elements.cancelButton.style.display = "inline-block";
  elements.form.elements.title.focus();
};

// 폼 리셋 (화살표 함수)
const resetForm = () => {
  elements.form.reset();
  editingBookId = null;
  elements.submitButton.textContent = "도서 등록";
  elements.cancelButton.style.display = "none";
  uiService.hideMessage();
  elements.form.elements.title.focus();
};

// 도서 목록 로드
const loadBooks = async () => {
  console.log("도서 목록 불러오는 중...");

  try {
    const books = await apiService.getList();
    console.log(`${books.length}명의 도서 데이터를 받았습니다.`);

    renderTable(books);
  } catch (error) {
    console.error("목록 로드 오류:", error);
    uiService.showError(error.message);
    renderErrorTable(error.message);
  }
};

// 도서 목록 테이블 렌더링
const renderTable = (books) => {
  // 테이블 내용 초기화
  elements.tableBody.innerHTML = "";

  if (books.length === 0) {
    renderErrorTable("등록된 도서가 없습니다.");
    return;
  }

  for (let _book of books) {
    const row = createRow(_book);
    elements.tableBody.appendChild(row);
  }
  //}
};

// 테이블 행 생성
const createRow = (book) => {
  const { title = "", author = "", isbn = "", price = 0, id } = book;

  let publishDate = book.publishDate ? formatDate(book.publishDate) : "-";

  const row = document.createElement("tr");

  // 템플릿 리터럴 사용
  row.innerHTML = `
        <td>${title}</td>
        <td>${author}</td>
        <td>${isbn}</td>
        <td>${price}</td>
        <td>${publishDate}</td>
        <td class="action-buttons">
            <button class="edit-btn" onclick="editBook(${id})">수정</button>
            <button class="delete-btn" onclick="deleteBook(${id}, '${name}')">삭제</button>
        </td>
    `;

  return row;
};

// 에러 테이블 렌더링 (템플릿 리터럴)
const renderErrorTable = (errorMessage) => {
  elements.tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; color: #dc3545; padding: 20px;">
                오류: 데이터를 불러올 수 없습니다.<br>
                ${errorMessage}
            </td>
        </tr>
    `;
};

// 필드에 포커스 주기 (화살표 함수)
const focusField = (fieldName) => {
  const field = elements.form.elements[fieldName];
  if (field) {
    field.focus();
  }
};
