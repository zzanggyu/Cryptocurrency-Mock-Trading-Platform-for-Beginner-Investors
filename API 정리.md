### Board Controller API

- **GET /api/boards**
  - **Description**: 게시글 목록 조회
  - **Response**:
    - **Success**: 200 OK, 게시글 목록
    - **Failure**: 400 Bad Request, 오류 메시지

- **GET /api/boards/{id}**
  - **Description**: 게시글 상세 조회
  - **Request Parameters**:
    - **PathVariable id**: 게시글 ID
  - **Response**:
    - **Success**: 200 OK, 게시글 정보
    - **Failure**: 400 Bad Request, 오류 메시지

- **POST /api/boards**
  - **Description**: 새 게시글 작성
  - **Request Body**:
    - **BoardDTO board**: 게시글 정보
  - **Response**:
    - **Success**: 200 OK, 작성된 게시글 정보
    - **Failure**: 400 Bad Request, 오류 메시지

- **PUT /api/boards/{id}**
  - **Description**: 게시글 수정
  - **Request Parameters**:
    - **PathVariable id**: 게시글 ID
  - **Request Body**:
    - **BoardDTO board**: 수정된 게시글 정보
  - **Response**:
    - **Success**: 200 OK, 수정된 게시글 정보
    - **Failure**: 400 Bad Request, 오류 메시지

- **POST /api/boards/{id}/like**
  - **Description**: 게시글 좋아요
  - **Request Parameters**:
    - **PathVariable id**: 게시글 ID
  - **Response**:
    - **Success**: 200 OK
    - **Failure**: 400 Bad Request, 오류 메시지

- **DELETE /api/boards/{id}**
  - **Description**: 게시글 삭제
  - **Request Parameters**:
    - **PathVariable id**: 게시글 ID
  - **Response**:
    - **Success**: 200 OK
    - **Failure**: 400 Bad Request, 오류 메시지

- **POST /api/boards/{boardId}/comments**
  - **Description**: 댓글 작성
  - **Request Parameters**:
    - **PathVariable boardId**: 게시글 ID
  - **Request Body**:
    - **CommentDTO commentDto**: 댓글 정보
  - **Response**:
    - **Success**: 200 OK, 작성된 댓글 정보
    - **Failure**: 400 Bad Request, 오류 메시지

- **PUT /api/boards/comments/{id}**
  - **Description**: 댓글 수정
  - **Request Parameters**:
    - **PathVariable id**: 댓글 ID
  - **Request Body**:
    - **CommentDTO commentDto**: 수정된 댓글 정보
  - **Response**:
    - **Success**: 200 OK, 수정된 댓글 정보
    - **Failure**: 400 Bad Request, 오류 메시지

- **DELETE /api/boards/comments/{id}**
  - **Description**: 댓글 삭제
  - **Request Parameters**:
    - **PathVariable id**: 댓글 ID
  - **Response**:
    - **Success**: 200 OK
    - **Failure**: 400 Bad Request, 오류 메시지

### Favorite Controller API

- **GET /api/favorites**
  - **Description**: 즐겨찾기 목록 조회
  - **Response**:
    - **Success**: 200 OK, 즐겨찾기 목록
    - **Failure**: 400 Bad Request, 오류 메시지
    - **Unauthorized**: 401 Unauthorized, "로그인이 필요합니다."

- **POST /api/favorites**
  - **Description**: 새 즐겨찾기 추가
  - **Request Body**:
    - **Map<String, String> request**: 즐겨찾기 정보 (symbol, coinname)
  - **Response**:
    - **Success**: 200 OK
    - **Failure**: 400 Bad Request, 오류 메시지
    - **Unauthorized**: 401 Unauthorized, "로그인이 필요합니다."

- **DELETE /api/favorites/{symbol}**
  - **Description**: 즐겨찾기 삭제
  - **Request Parameters**:
    - **PathVariable symbol**: 즐겨찾기 심볼
  - **Response**:
    - **Success**: 200 OK
    - **Failure**: 400 Bad Request, 오류 메시지
    - **Unauthorized**: 401 Unauthorized, "로그인이 필요합니다."

### Market Controller API

- **GET /api/market/ticker**
  - **Description**: 코인 시세 조회
  - **Response**:
    - **Success**: 200 OK, 시세 정보
    - **Failure**: 400 Bad Request, 오류 메시지

- **GET /api/market/news**
  - **Description**: 최신 뉴스 조회
  - **Response**:
    - **Success**: 200 OK, 뉴스 목록
    - **Failure**: 400 Bad Request, 오류 메시지

### User Controller API

- **POST /api/signup**
  - **Description**: 회원가입
  - **Request Body**:
    - **SignupDTO userDto**: 사용자 정보
  - **Response**:
    - **Success**: 200 OK, 사용자 정보
    - **Failure**: 400 Bad Request, 오류 메시지

- **POST /api/login**
  - **Description**: 로그인
  - **Request Body**:
    - **LoginRequestDTO loginDto**: 로그인 정보
  - **Response**:
    - **Success**: 200 OK, 사용자 정보
    - **Failure**: 400 Bad Request, 오류 메시지

- **GET /api/user/info**
  - **Description**: 사용자 정보 조회
  - **Response**:
    - **Success**: 200 OK, 사용자 정보
    - **Failure**: 401 Unauthorized, "로그인이 필요합니다."

- **POST /api/logout**
  - **Description**: 로그아웃
  - **Response**:
    - **Success**: 200 OK, "로그아웃 완료"

- **PUT /api/user/password**
  - **Description**: 비밀번호 변경
  - **Request Body**:
    - **PasswordChangeDTO passwordDto**: 비밀번호 변경 정보
  - **Response**:
    - **Success**: 200 OK, "비밀번호가 성공적으로 변경되었습니다."
    - **Failure**: 400 Bad Request, 오류 메시지

- **PUT /api/user/style**
  - **Description**: 투자 성향 업데이트
  - **Request Body**:
    - **StyleDTO styleDto**: 투자 성향 정보
  - **Response**:
    - **Success**: 200 OK, "투자 성향이 업데이트 되었습니다."
    - **Failure**: 400 Bad Request, 오류 메시지

- **GET /api/check-session**
  - **Description**: 세션 상태 확인
  - **Response**:
    - **Success**: 200 OK, 사용자 정보
    - **Failure**: 401 Unauthorized, "로그인이 필요합니다."

- **PUT /api/user/nickname**
  - **Description**: 닉네임 변경
  - **Request Body**:
    - **Map<String, String> request**: 닉네임 정보
  - **Response**:
    - **Success**: 200 OK, "닉네임이 변경되었습니다."
    - **Failure**: 400 Bad Request, 오류 메시지
