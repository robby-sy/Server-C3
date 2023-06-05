# Endpoints:

### list of all available endpoints

- POST/register
- POST/login
- GET/categories
- POST/articles
- GET/articles
- GET/articles/:id
- DELETE/articles/:id
- GET/histories

### 1.POST/register

1. request :

- body

```json
{
    "username":"aza01", // required
    "password":"12345", // required
    "addres":"Sumatra street no 78", // optional
    "phoneNumber":"0851-5222-8001", // optional
    "email":"aza@test.com",// required
    "profile_picture":"www.imageUrl.com/picture.jpeg" // optional
}
```

2. *Response (201-Created)*

```json
{
    "message":"Success Create Account",
    "data":{
            "username":"aza01", 
            "password":"hased password",
            "addres":"Sumatra street no 78",
            "phoneNumber":"0851-5222-8001",
            "email":"aza@test.com",
            "profile_picture":"www.imageUrl.com/picture.jpeg"
            }
}
```

3. *Response (400-Bad Request)*

- empty field

```json
{
    "message": [
        "user name required",
        "email required",
        "password required"
    ]
}
```

error yang muncul dalam array tergantung dari field yang kosong

- email not unique

```json
{
    "message": "This email has already been registered"
}
```

### 2.POST /login

1. Request

- body :

```json
{
    "email":"aza@test.com",
    "password":"12345"
}
```

2. *Response (200-ok)*

```json
{
"message": "success login",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.      eyJhdXRob3JJZCI6MSwiaWF0IjoxNjg0Mjk0NzMyfQ.8Z16wCs29r-OqjTG1rNLa_vZ7wLOAOQ2SJmCX1oO5LQ",
"user":{
    "id":"user id",
    "name":"user full name",
    "picture":"user profile picture",
    "role":"user role"
}
}
```

3. *Response (400-Bad Request)*

- empty field

```json
{
"message": "Email required to login"
}
or
{
"message": "Password required to login"
}
```

- wrong email / password

```json
{
"message": "Incorrect email or password"
}
```

### 3.POST/articles

1. Request

- headers:

```json
{
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6MSwiaWF0IjoxNjg0Mjk2MDEyfQ.DVZcdYoem7ucM6LT4H84EMFf0_skc0spzXpqoSKmvB8"
}
```

- body:

```json
{
    "title":"news title",
    "content":"news content",
    "imgUrl":"url of image",
    "categoryId":"news type id"
}
```

2. *Response (200-ok)*

```json
{
    "message": "success create new article",
    "article": {
        "id": 22,
        "title": "ini judul",
        "content": "ini content",
        "imgUrl": "url gambar",
        "categoryId": 2,
        "authorId": 1,
        "updatedAt": "2023-05-17T04:15:35.329Z",
        "createdAt": "2023-05-17T04:15:35.329Z"
    }
}
```

3. *Response (400-Bad Request)*

- empty field

```json
{
"message": [
    "title cannot empty",
    "content cannot empty",
    "categoryId cannot empty"
]
}
error dalam array tergantung dari field yang kosong
```

4. *Response (401-Unauthorized)*

```json
{
"message": "Authentication Error"
}
```

### 4.GET/articles

1. request

- headers

```json
    {
        "token":""
    }
```

2. response

- (200 - ok)

```json
    {
    "message": "success read data",
    "data": [
        {
            "id": 26,
            "title": "Gempa Bumi Magnitudo 6,9 Guncang Wilayah Jakarta, Korban Jiwa Terus Bertambah",
            "content": "Gempa bumi berkekuatan 6,9 magnitudo mengguncang wilayah Jakarta pada pagi hari tadi. Pusat gempa terletak di kedalaman 10 kilometer dan berdampak luas. Sampai saat ini, korban jiwa terus bertambah dengan ribuan orang terluka dan sejumlah bangunan hancur.",
            "imgUrl": "https://images.pexels.com/photos/14000727/pexels-photo-14000727.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            "categoryId": 5,
            "authorId": 1,
            "createdAt": "2023-05-18T08:35:13.355Z",
            "updatedAt": "2023-05-18T08:35:13.355Z",
            "Category": {
                "id": 5,
                "name": "Bencana Alam",
                "createdAt": "2023-05-18T08:34:25.903Z",
                "updatedAt": "2023-05-18T08:34:25.903Z"
            },
            "Author": {
                "id": 1,
                "username": "dkuhnel0",
                "email": "dkuhnel0@geocities.com",
                "first_name": "Demott",
                "last_name": "Kuhnel",
                "phoneNumber": "408-308-9317",
                "profile_picture": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg",
                "address": "8 Hanover Hill",
                "role": "Admin",
                "createdAt": "2023-05-18T08:34:50.138Z",
                "updatedAt": "2023-05-18T08:34:50.138Z"
            }
        },.......]
    }
```

- (401 - unauthorize)

```json
    {
        "message": "Authentication Error"
    }
```

### 5. DELETE/article/:id

1. request
   -headers

```json
    {
        "token":""
    }
```

2. response

- (200 - ok)

```json
{ "message": " Succes Delete Article 'article name' " }
```

- (404 - not found)

```json
    {
        "message":"Data not found"
    }
```

- (403 - forbidden)

```json
    {
        "message":"Authorization Denied"
    }
```


### 6.GET/categories

1. request
- headers
```json
    {
        "token":""
    }
```

2. response
   -(200 - ok)

```json
    {
    "message": "success read data",
    "data": [
        {
            "id": 5,
            "name": "Bencana Alam",
            "createdAt": "2023-05-18T08:34:25.903Z",
            "updatedAt": "2023-05-18T08:34:25.903Z",
            "Articles": [
                {
                    "id": 26,
                    "title": "Gempa Bumi Magnitudo 6,9 Guncang Wilayah Jakarta, Korban Jiwa Terus Bertambah",
                    "content": "Gempa bumi berkekuatan 6,9 magnitudo mengguncang wilayah Jakarta pada pagi hari tadi. Pusat gempa terletak di kedalaman 10 kilometer dan berdampak luas. Sampai saat ini, korban jiwa terus bertambah dengan ribuan orang terluka dan sejumlah bangunan hancur.",
                    "imgUrl": "https://images.pexels.com/photos/14000727/pexels-photo-14000727.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                    "categoryId": 5,
                    "authorId": 1,
                    "createdAt": "2023-05-18T08:35:13.355Z",
                    "updatedAt": "2023-05-18T08:35:13.355Z"
                },.......]
        },......]
    }
```

- (401 - unauthorize)

```json
    {
        "message": "Authentication Error"
    }
```

### 7. GET/histories
1. request
- headers
```json
    {"token":""}
```

2. response
- (200 - ok)
```json
    {
        "message":"success get histories",
        "data":["history1,history2,......"]
    }
