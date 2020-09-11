# Docker-Todo-App

## Server

### Server-Docker

---

## Client

### Clent-Docker

Single Page Application인 React에의 index.html 하나의 정적 파일에 접근해서 라우팅을 시켜야 하는데 nginx에서는 자동으로 이를 알 수 없다.

그러기에 `nginx` 폴더를 client root에 생성 후 안에 `default.conf` 파일을 아래와 같이 작성하여 라우팅에 있어 매칭할 수 있도록 임의 설정을 해주어야 한다.

```conf
# nginx/default.conf

server {
  listen 3000

  location / {
    # HTML 파일이 위치할 루트 설정
    root /usr/share/nginx/html;

    # 사이트의 index 페이지로 할 파일명 설정
    index index.html index.htm;

    # React Router를 사용해서 페이지간 이동할때 이 부분이 필요
    try_files $uri $uri/ /index.html;
  }
}
```

```Dockerfile
# ...

FROM nginx

EXPOSE 3000

# Ngnix를 가동하고 위 단계에서 생성된 빌드 제공되며, default.conf 설정을 nginx 컨테이너 안에 있는 설정이 되도록 복사해준다.
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY  --from=builder /app/build /usr/share/nginx/html
```

---

## DB

### DB Docker

Mysql 데이터 베이스를 위한 도커 파일 생성하기 위해 개발 환경과 운영 환경 각각에서 DB구성

> 개발 환경 -> 도커 환경 이용</br>
> 운영 환경 -> AWS RDS 서비스 이용

DB 작업은 중요 데이터들을 보관하는 부분이기에 조금의 실수를 미연의 방지하고자 실제 중요한 데이터들을 다루는 운영 환경에서는 안정적인 AWS RDS를 이용

`mysql` 폴더를 root 폴더에 생성 후 `Dockerfile` 파일 생성

```Dockerfile
# 베이스 이미지를 도커 허브에서 가져온다.
FROM mysql:5.7
```

Mysql에 Database와 Table을 만들 장소로 mysql/`sqls` 폴더 생성 후 `initalize.sql` 파일 생성

```sql
DROP DATABASE IF EXISTS myapp;

CREATE DATABASE myapp
USE myapp;

CREATE TABLE lists (
  id INTEEGR AUTO_INCREMENT,
  value TEXT,
  PREIMARY KEY (id)
);
```

cline nginx의 default.conf와 같이 미리 mysql을 설정하기 위해 `myslq/my.cnf` 파일을 생성한다.

이는 어떤 글을 데이터베이스에 넣어줄때 한글이 깨지게 되어서 저장을 할때 오류가 발생한다. 그래서 한글도 저장할 수 있도록 설절을 해주어야 한다.

```my.cnf

```

## Nginx

현재 Nginx가 쓰잉는 곳은 두군데 이며 서로 다른 이유로 쓰이고있다.
하나는 `Proxy`를 위한 다른 하나는 `Static 파일을 제공`해주는 역할을 하고 있다.

클라이언트에 요청을 보낼때 정적 파일을 원할때는 Nginx의설정에 따라 자동적으로 React JS로 보내주며, API 요청일 경우에Node JS 보내준다.

Nginx가 요청을 나눠서 보내주는 기준은 location이 /로 시작하는지, /api로 시작하는지에 따라 나눠준다.

/로 시작하면 React JS /api로 시작하면 Node JS로 보내준다.

root에 `nginx` 폴더를 생성 후 `default.conf` 파일을 생성한다.

```conf
# 3000번 포트에서 frontend가 돌아가고 있다는 것을 명시
upstream frontend {
  server frontend: 3000;
}

# 5000번 포트에서 backend가 돌아가고 있다는 것을 명시
upstream backend {
  server backend: 5000;
}

server {
  # Nginx 서버 포트
  listen: 80;

  # location에는 우선 순위가 있는데 / 그냥 이렇게만 되는 것은 우선 순위가 가장 낮기에 /api로 시작하는 것을 먼저 찾고 그게 없다면 / 시작되는 것으로 해당 요청은 http://frontend로 보내준다.
  location / {
    proxy_pass http://frontend;
  }

  # /api로 들어오는 요청을 http://backend로 보내준다.
  location /api {
    proxy_pass http://backend;
  }

  # 아래 부분이 없다면 이러한 에러가 일어난다.(개발 환경에서만 발생) 에러 처리를 위한 부분
  location /sockjs-node {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $hhtp_upgrade;
    proxy_set_header Connection "Upgrade";
  }
}
```

위의 `stream frontend / backend`와 같이 명시되 있는 부분은 `docker-compose.yml`의 services에 설정한 값을 의미한다. 따라서 해당 명을 바꾸려면 docker-compose.yml 파일내 수정하여 명시한다.

## Docker Compose

위 컨테이너들을 다 작동 시킨다고 해도 컨테이너 특성상 서로 나눠져있기 때문에 아무런 조치 없이는 서로 통신을 할 수가 없다.

컨테이너들을 서로 연결시켜주기 위한 Docekr Compose 생성한다.

```yml
# docker-compose.yml
```
