var editingId = null;

document.addEventListener("DOMContentLoaded", function () {
  loadBooks();
});

const bookForm = document.getElementById("book-form");

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const bookData = {
    title: formData.get("title").trim(),
    author: formData.get("author").trim(),
    isbn: formData.get("isbn").trim(),
    price: formData.get("price").trim(),
    publishDate: formData.get("publishDate").trim(),
    // detailRequest: formData.get("detailRequest"),
  };

  if (!validateBook(bookData)) {
    return;
  }

  if (editingId) {
    // 수정 모드
    editBook(editingId, bookData);
  } else {
    // 등록 모드
    createBooks(bookData);
  }
});

const API_BASE_URL = "http://localhost:8080";

function loadBooks() {
  console.log("책 목록 Load 중.....");

  fetch(`${API_BASE_URL}/api/books`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          //중복 오류 처리
          throw new Error(errorData.message || "중복 되는 정보가 있습니다.");
        } else {
          //기타 오류 처리
          throw new Error(errorData.message || "도서 등록에 실패했습니다.");
        }
      }
      return response.json();
    })
    .then((books) => renderTable(books))
    .catch((error) => {
      console.log(error);
      alert(">>> 도서 목록을 불러오는데 실패했습니다!.");
    });
}

function renderTable(books) {
  console.log(books);
  const tablebody = document.getElementById("tablebody");

  tablebody.innerHTML = "";

  books.forEach((book) => {
    const row = document.createElement("tr");

    row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>${book.price}</td>
                    <td>${book.publishDate}</td>
                    <td>
                        <button class="edit-btn" onclick="editButtonClick(${book.id})">수정</button>
                        <button class="delete-btn" onclick="deleteBook(${book.id},'${book.title}')">삭제</button>
                    </td>
                `;

    tablebody.appendChild(row);
  });
}

function createBooks(bookData) {
  fetch(`${API_BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          //중복 오류 처리
          throw new Error(errorData.message || "중복 되는 정보가 있습니다.");
        } else {
          //기타 오류 처리
          throw new Error(errorData.message || "도서 등록에 실패했습니다.");
        }
      }
      return response.json();
    })
    .then((result) => {
      bookForm.reset();

      loadBooks();
    })
    .catch((error) => {
      console.log("Error : ", error);
      alert(error.message);
    });
}

// 삭제 함수
function deleteBook(id, title) {
  if (!confirm(`제목 = ${title} 학생을 정말로 삭제하시겠습니까?`)) {
    return;
  }

  fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: "DELETE",
  }).then(async (response) => {
    if (!response.ok) {
      //응답 본문을 읽어서 에러 메시지 추출
      const errorData = await response.json();
      //status code와 message를 확인하기
      if (response.status === 404) {
        //중복 오류 처리
        throw new Error(errorData.message || "존재하지 않는 책입니다다.");
      } else {
        //기타 오류 처리
        throw new Error(errorData.message || "도서 삭제에 실패했습니다.");
      }
    }
    alert("학생이 성공적으로 삭제되었습니다!");
    //목록 새로 고침
    loadBooks();
  });
}

function editButtonClick(id) {
  //
  fetch(`${API_BASE_URL}/api/books/${id}`)
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error(errorData.message || "존재하지 않는 도서입니다.");
        }
      }
      return response.json();
    })
    .then((book) => {
      bookForm.elements["title"].value = book.title;
      bookForm.elements["author"].value = book.author;
      bookForm.elements["isbn"].value = book.isbn;
      bookForm.elements["price"].value = book.price;
      bookForm.elements["publishDate"].value = book.publishDate;

      let submitButton = document.getElementById("submit-button");
      let cancelButton = document.getElementById("cancel-button");
      console.log(cancelButton);

      editingId = id;
      submitButton.textContent = "수정";
      cancelButton.style.display = "inline-block";
    })
    .catch((error) => {
      console.log("Error : ", error);
      alert(error.message);
    });
}

//학생 수정전에 데이터를 로드하는 함수
function editBook(id, bookData) {
  fetch(`${API_BASE_URL}/api/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  })
    .then(async (response) => {
      const data = await response.json(); // ✅ 한 번만 읽음
      if (!response.ok) {
        const errorData = data;
        if (response.status === 404) {
          throw new Error(errorData.message || "존재하지 않는 도서입니다.");
        }
      }
      return data;
    })
    .then((book) => {
      alert("수정됬음");
      loadBooks();

      bookForm.reset();
      editingId = null;

      document.getElementById("submit-button").textContent = "등록";
      document.getElementById("cancel-button").style.display = "none";
    })
    .catch((error) => {
      console.log("Error : ", error);
      alert(error.message);
    });
}

function validateBook(bookData) {
  if (!bookData.title) {
    alert("제목을 입력해주세요.");
    return false;
  }

  if (!bookData.author) {
    alert("저자를 입력해주세요.");
    return false;
  }

  const pattern = /^(?:\d{9}[\dX]|\d{13})$/;
  if (!pattern.test(bookData.isbn)) {
    alert("isbn은 10자리나 13자리만 입력 가능해요.");

    return false;
  }

  if (!bookData.price) {
    alert("가격을 입력해주세요.");
    return false;
  }
  if (!bookData.publishDate) {
    alert("출판일을 입력해주세요.");
    return false;
  }

  return true;
}
