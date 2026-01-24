# Postman দিয়ে API টেস্ট করার গাইড

## প্রস্তুতি

### ১. সার্ভার চালু করুন
```bash
cd c:\Users\MD.Alif Khan\Desktop\project\smart-queue-backend
npm run dev
```
সার্ভার চলবে: `http://localhost:5000`

### ২. Postman ইনস্টল করুন
- [Postman ডাউনলোড করুন](https://www.postman.com/downloads/)
- অথবা Postman Web ব্যবহার করুন

---

## 🚀 দ্রুত শুরু করার জন্য স্টেপ

### স্টেপ ১: User Registration (নতুন ইউজার তৈরি)

1. Postman এ নতুন Request তৈরি করুন
2. Method: **POST** সিলেক্ট করুন
3. URL: `http://localhost:5000/api/v1/users/register`
4. **Body** ট্যাবে যান
5. **raw** সিলেক্ট করুন এবং **JSON** সিলেক্ট করুন
6. এই JSON কপি করে পেস্ট করুন:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

7. **Send** বাটনে ক্লিক করুন

**সফল হলে Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

---

### স্টেপ ২: User Login (লগইন করা)

1. নতুন Request তৈরি করুন
2. Method: **POST**
3. URL: `http://localhost:5000/api/v1/users/login`
4. Body (JSON):

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

5. **Send** করুন

**Response থেকে Token কপি করুন:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // এই টোকেন কপি করুন
  }
}
```

---

### স্টেপ ৩: Token দিয়ে Authenticated Request পাঠানো

এখন থেকে সব Request এ Token লাগবে।

#### Service তৈরি করা

1. নতুন Request: **POST** `http://localhost:5000/api/v1/services`
2. **Headers** ট্যাবে যান
3. নতুন Header যোগ করুন:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (আপনার টোকেন পেস্ট করুন)
4. **Body** ট্যাবে যান (JSON):

```json
{
  "name": "Haircut",
  "duration": 30,
  "staffType": "Barber"
}
```

5. **Send** করুন

---

### স্টেপ ৪: Staff তৈরি করা

1. Request: **POST** `http://localhost:5000/api/v1/staff`
2. Headers এ Token যোগ করুন (আগের মতো)
3. Body (JSON):

```json
{
  "name": "Alice Smith",
  "serviceType": "Barber",
  "dailyCapacity": 10,
  "availabilityStatus": "Available"
}
```

4. **Send** করুন
5. Response থেকে Staff ID কপি করুন

---

### স্টেপ ৫: Appointment তৈরি করা

1. Request: **POST** `http://localhost:5000/api/v1/appointments`
2. Headers এ Token যোগ করুন
3. Body (JSON):

```json
{
  "customerName": "Jane Doe",
  "serviceId": "আপনার_service_id_এখানে",
  "staffId": "আপনার_staff_id_এখানে",
  "appointmentDate": "2024-01-25T14:00:00.000Z"
}
```

4. **Send** করুন

---

## 📝 সব Endpoints এর তালিকা

### User Endpoints
| Method | Endpoint | বিবরণ | Auth প্রয়োজন? |
|--------|----------|-------|----------------|
| POST | `/api/v1/users/register` | নতুন ইউজার তৈরি | ❌ |
| POST | `/api/v1/users/login` | লগইন | ❌ |

### Service Endpoints
| Method | Endpoint | বিবরণ | Auth প্রয়োজন? |
|--------|----------|-------|----------------|
| POST | `/api/v1/services` | নতুন সার্ভিস তৈরি | ✅ |
| GET | `/api/v1/services` | সব সার্ভিস দেখা | ✅ |

### Staff Endpoints
| Method | Endpoint | বিবরণ | Auth প্রয়োজন? |
|--------|----------|-------|----------------|
| POST | `/api/v1/staff` | নতুন স্টাফ তৈরি | ✅ |
| GET | `/api/v1/staff` | সব স্টাফ দেখা | ✅ |
| PUT | `/api/v1/staff/:id` | স্টাফ স্ট্যাটাস আপডেট | ✅ |

### Appointment Endpoints
| Method | Endpoint | বিবরণ | Auth প্রয়োজন? |
|--------|----------|-------|----------------|
| POST | `/api/v1/appointments` | নতুন অ্যাপয়েন্টমেন্ট তৈরি | ✅ |
| GET | `/api/v1/appointments` | সব অ্যাপয়েন্টমেন্ট দেখা | ✅ |
| PUT | `/api/v1/appointments/:id` | অ্যাপয়েন্টমেন্ট স্ট্যাটাস আপডেট | ✅ |
| POST | `/api/v1/appointments/assign-queue` | Queue থেকে Assign করা | ✅ |

### Audit Log Endpoints
| Method | Endpoint | বিবরণ | Auth প্রয়োজন? |
|--------|----------|-------|----------------|
| GET | `/api/v1/audit-logs` | Audit logs দেখা | ✅ |

---

## 🎯 Postman Collection তৈরি করা

### Collection তৈরি:
1. Postman এ **Collections** এ ক্লিক করুন
2. **Create Collection** এ ক্লিক করুন
3. নাম দিন: "Smart Queue API"

### Folder তৈরি:
- Users
- Services
- Staff
- Appointments
- Audit Logs

### Environment Variable সেটআপ:
1. **Environments** এ ক্লিক করুন
2. নতুন Environment তৈরি করুন: "Local"
3. Variables যোগ করুন:
   - `base_url`: `http://localhost:5000/api/v1`
   - `token`: (লগইন করার পর এখানে টোকেন সেভ করবেন)

### URL এ Variable ব্যবহার:
```
{{base_url}}/users/login
{{base_url}}/services
```

### Headers এ Token Variable:
```
Authorization: Bearer {{token}}
```

---

## 🔧 সাধারণ সমস্যা ও সমাধান

### ১. "Cannot POST /api/v1/users/register"
**সমাধান:** সার্ভার চালু আছে কিনা চেক করুন (`npm run dev`)

### ২. "Unauthorized" Error
**সমাধান:** 
- লগইন করে নতুন টোকেন নিন
- Headers এ সঠিকভাবে টোকেন যোগ করেছেন কিনা চেক করুন
- Format: `Bearer <token>` (Bearer এর পরে স্পেস দিতে হবে)

### ৩. Validation Error
**সমাধান:** 
- Request Body সঠিক আছে কিনা চেক করুন
- Required fields দিয়েছেন কিনা চেক করুন
- Data type সঠিক আছে কিনা চেক করুন

### ৪. CORS Error
**সমাধান:** 
- সার্ভার রিস্টার্ট করুন
- Postman Desktop App ব্যবহার করুন (Web version এ CORS issue হতে পারে)

---

## 📦 Postman Collection Import করার জন্য JSON

নিচের JSON কপি করে Postman এ Import করতে পারেন:

1. Postman এ **Import** বাটনে ক্লিক করুন
2. **Raw text** সিলেক্ট করুন
3. নিচের JSON পেস্ট করুন
4. **Import** করুন

```json
{
  "info": {
    "name": "Smart Queue API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/users/register",
              "host": ["{{base_url}}"],
              "path": ["users", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/users/login",
              "host": ["{{base_url}}"],
              "path": ["users", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Services",
      "item": [
        {
          "name": "Create Service",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Haircut\",\n  \"duration\": 30,\n  \"staffType\": \"Barber\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/services",
              "host": ["{{base_url}}"],
              "path": ["services"]
            }
          }
        },
        {
          "name": "Get Services",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/services",
              "host": ["{{base_url}}"],
              "path": ["services"]
            }
          }
        }
      ]
    },
    {
      "name": "Staff",
      "item": [
        {
          "name": "Create Staff",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Alice Smith\",\n  \"serviceType\": \"Barber\",\n  \"dailyCapacity\": 10,\n  \"availabilityStatus\": \"Available\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/staff",
              "host": ["{{base_url}}"],
              "path": ["staff"]
            }
          }
        },
        {
          "name": "Get Staff",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/staff",
              "host": ["{{base_url}}"],
              "path": ["staff"]
            }
          }
        },
        {
          "name": "Update Staff Status",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"On Leave\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/staff/:id",
              "host": ["{{base_url}}"],
              "path": ["staff", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "staff_id_here"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Appointments",
      "item": [
        {
          "name": "Create Appointment",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"customerName\": \"Jane Doe\",\n  \"serviceId\": \"service_id_here\",\n  \"staffId\": \"staff_id_here\",\n  \"appointmentDate\": \"2024-01-25T14:00:00.000Z\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/appointments",
              "host": ["{{base_url}}"],
              "path": ["appointments"]
            }
          }
        },
        {
          "name": "Get Appointments",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/appointments",
              "host": ["{{base_url}}"],
              "path": ["appointments"]
            }
          }
        },
        {
          "name": "Update Appointment Status",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"Completed\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/appointments/:id",
              "host": ["{{base_url}}"],
              "path": ["appointments", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "appointment_id_here"
                }
              ]
            }
          }
        },
        {
          "name": "Assign from Queue",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"staffId\": \"staff_id_here\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/appointments/assign-queue",
              "host": ["{{base_url}}"],
              "path": ["appointments", "assign-queue"]
            }
          }
        }
      ]
    },
    {
      "name": "Audit Logs",
      "item": [
        {
          "name": "Get Audit Logs",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/audit-logs",
              "host": ["{{base_url}}"],
              "path": ["audit-logs"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 💡 টিপস

1. **Collection Runner ব্যবহার করুন:** একসাথে সব API টেস্ট করার জন্য
2. **Tests Script লিখুন:** Automatic validation এর জন্য
3. **Pre-request Script:** Token automatically set করার জন্য
4. **Environment ব্যবহার করুন:** Development, Staging, Production এর জন্য আলাদা environment

### Example Test Script (Login Request এ):
```javascript
// Tests ট্যাবে এই কোড লিখুন
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Token is present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.token).to.exist;
    
    // Token automatically save করা
    pm.environment.set("token", jsonData.data.token);
});
```

এখন লগইন করলে Token automatically Environment Variable এ সেভ হবে!

---

## 📞 সাহায্য দরকার?

- API Documentation দেখুন: `API_DOCUMENTATION.md`
- সার্ভার লগ চেক করুন
- Postman Console খুলুন (View → Show Postman Console) request/response দেখার জন্য
