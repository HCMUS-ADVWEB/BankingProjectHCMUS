# Fitness App Services

Dự án quản lý các microservice của ứng dụng Fitness.

## Cấu trúc dự án

- `[text]-service`: Quản lý thông tin liên quan đến [text] service

## Cài đặt và Chạy

### Yêu cầu

- Docker và Docker Compose
- Git

### Cấu hình biến môi trường

1. Sao chép file `.env` (lấy từ disord) thành `.env` (nếu chưa tồn tại):

2. Điều chỉnh các biến môi trường trong file `.env`:

```
# Thay đổi mật khẩu của PostgreSQL
POSTGRES_PASSWORD=your_secure_password

# Thay đổi các cấu hình khác nếu cần
```

### Cách chạy

1. Clone dự án:

```
git clone <repository-url>
cd <project-folder>
```

2. Chạy tất cả các service bằng Docker Compose:

```
Nếu chạy lần đầu
docker-compose up -d --build
```

```
Các lần tiếp theo
docker-compose up -d
```

3. Kiểm tra trạng thái các container:

```
docker-compose ps
```

4. Xem logs của các service:

```
docker-compose logs -f
```

### Dừng các service

```
docker-compose down
```

Để xóa tất cả volumes (cơ sở dữ liệu):

```
docker-compose down -v
```

## Bảo mật

- Không commit file `.env` chứa thông tin nhạy cảm lên hệ thống quản lý mã nguồn
- Thay đổi các mật khẩu mặc định trước khi triển khai vào môi trường production
- Hạn chế truy cập vào port của database từ bên ngoài hệ thống (chỉ mở khi cần thiết)


## Thông tin thêm

- Mỗi service có file cấu hình riêng trong thư mục của nó.


## Với 1 service

### Requirements
- Java 17
- Maven
- Docker
- PostgreSQL

### Configuration
Edit the `.env` file to set up connection

### Running with Docker

#### Using docker-compose (recommended)
```bash
# Build and run both PostgreSQL and the service
docker-compose up -d
```

#### Or using Docker individually
```bash
# Build the application
./mvnw clean package -DskipTests

# Build Docker image
docker build -t fit-service .

# Run container
docker run -p 8080:8080 --env-file .env fit-service
```

### Running in development environment

```bash
./mvnw spring-boot:run
```