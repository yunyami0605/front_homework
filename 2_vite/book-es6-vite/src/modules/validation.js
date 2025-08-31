import { stringUtils } from "../utils/helpers";

//destructuring assignment
const { isEmpty, safeTrim } = stringUtils;

// 유효성 검사 모듈 - 구조분해할당과 화살표 함수 사용

// 에러 메시지들을 타입별로 분류하여 관리
export const messages = {
  // 필수 입력 필드가 비어있을 때 표시할 메시지들
  required: {
    title: "제목을 입력해주세요.",
    author: "저자를 입력해주세요.",
    isbn: "isbn를 입력해주세요.",
    price: "가격을 입력해주세요.",
    publishDate: "출판일을 입력해주세요.",
  },
};

// 개별 필드별 검증 함수들을 담은 객체 (화살표 함수 사용)
const validators = {
  title: (_title) => {
    // 1단계: 필수 입력 확인 - 값이 없거나 공백만 있는 경우
    if (isEmpty(_title)) {
      return {
        isValid: false, // 검증 실패
        message: messages.required.title, // 에러 메시지
        field: "title", // 문제가 발생한 필드명
      };
    }

    // 2단계: 최소 길이 확인 - 이름은 최소 2글자 이상이어야 함
    if (safeTrim(_title).length < 2) {
      return {
        isValid: false,
        message: "제목은 최소 2글자 이상이어야 합니다.",
        field: "title",
      };
    }

    // 3단계: 모든 검증 통과
    return { isValid: true };
  },

  // 저자 이름 필드 검증 함수
  author: (_author) => {
    // 1단계: 필수 입력 확인
    if (isEmpty(_author)) {
      return {
        isValid: false,
        message: messages.required.author,
        field: "author",
      };
    }

    // 2단계:
    if (safeTrim(_author).length < 2) {
      return {
        isValid: false,
        message: "저자이름은 최소 1글자 이상이어야 합니다.",
        field: "author",
      };
    }

    // 3단계: 모든 검증 통과
    return { isValid: true };
  },

  // 주소 필드 검증 함수
  isbn: (_isbn) => {
    // 1단계: 필수 입력 확인
    if (isEmpty(_isbn)) {
      return {
        isValid: false,
        message: messages.required.isbn,
        field: "isbn",
      };
    }

    // const pattern = /^(?:\d{9}[\dX]|\d{13})$/;
    // if (!pattern.test(_isbn)) {
    //   return {
    //     isValid: false,
    //     message: "isbn은 10자리나 13자리만 입력 가능해요.",
    //     field: "isbn",
    //   };
    // }

    if (_isbn.length !== 10 && _isbn.length !== 13) {
      return {
        isValid: false,
        message: "isbn은 10자리나 13자리만 입력 가능해요.",
        field: "isbn",
      };
    }

    // 3단계: 모든 검증 통과
    return { isValid: true };
  },

  // 가격 필드 검증 함수
  price: (_price) => {
    // 1단계: 필수 입력 확인
    if (isEmpty(_price)) {
      return {
        isValid: false,
        message: messages.required.price,
        field: "price",
      };
    }

    if (_price < 0) {
      return {
        isValid: false,
        message: "가격은 0원 이상이여야합니다.",
        field: "price",
      };
    }

    // 3단계: 모든 검증 통과
    return { isValid: true };
  },

  // 이메일 필드 검증 함수
  publishDate: (_publishDate) => {
    // 1단계: 필수 입력 확인
    if (isEmpty(_publishDate)) {
      return {
        isValid: false,
        message: messages.required.publishDate,
        field: "publishDate",
      };
    }

    // 2단계: 형식 검증 (yyyy-mm-dd)
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(_publishDate)) {
      return {
        isValid: false,
        message: "날짜 형식은 YYYY-MM-DD 이어야 합니다.",
        field: "publishDate",
      };
    }

    // 3단계: 모든 검증 통과
    return { isValid: true };
  },
};

// 메인 검증 함수 - 객체 전체를 검증 (구조분해할당 사용)
export const validate = (book) => {
  // 1단계: 입력 데이터 자체가 존재하는지 확인
  if (!book) {
    return { isValid: false, message: "도서 데이터가 필요합니다." };
  }

  // 2단계: 구조분해할당으로 필요한 데이터 추출
  const { title, author, isbn, price, publishDate } = book;

  // 3단계: 기본 필드들 순차적 검증

  // 제목 검증
  const titleResult = validators.title(title);
  if (!titleResult.isValid) {
    return titleResult;
  }

  // 저자 검증
  const authorResult = validators.author(author);
  if (!authorResult.isValid) {
    return authorResult;
  }

  // isbn 검증
  const isbnResult = validators.isbn(isbn);
  if (!isbnResult.isValid) {
    return isbnResult;
  }

  // price 검증
  const priceResult = validators.price(price);
  if (!priceResult.isValid) {
    return priceResult;
  }

  // publishDate 검증
  const publishDateResult = validators.isbn(publishDate);
  if (!publishDateResult.isValid) {
    return publishDateResult;
  }

  // 5단계: 모든 검증을 통과한 경우
  return { isValid: true };
};

// 실시간 검증 함수 - 사용자가 입력하는 중에 개별 필드를 검증할 때 사용
export const validateField = (fieldName, value) => {
  // 1단계: 해당 필드명에 대응하는 검증 함수가 있는지 확인
  // validators 객체에서 fieldName에 해당하는 함수를 찾음
  const validator = validators[fieldName];

  // 2단계: 검증 함수가 없는 경우 (잘못된 필드명)
  if (!validator) {
    return {
      isValid: true, // 알 수 없는 필드는 일단 통과로 처리
      message: "알 수 없는 필드입니다.",
    };
  }

  // 3단계: 해당 검증 함수 실행하여 결과 반환
  return validator(value);
};
