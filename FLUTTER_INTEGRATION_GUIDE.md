# Flutter Integration Guide - StudentHub Backend API

## 📱 Panduan Lengkap Integrasi Flutter dengan Backend StudentHub API

### 🎯 Overview

Backend StudentHub API sudah siap dan berjalan di:
- **Base URL**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`
- **Authentication**: JWT Bearer Token
- **Response Format**: JSON

---

## 🚀 SETUP FLUTTER PROJECT

### 1. Tambahkan Dependencies

Di `pubspec.yaml`, tambahkan packages berikut:

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # HTTP Client
  http: ^1.2.0
  dio: ^5.4.0  # Alternative: Lebih powerful
  
  # State Management (pilih salah satu)
  provider: ^6.1.1
  riverpod: ^2.4.9
  bloc: ^8.1.3
  
  # Local Storage untuk Token
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0  # Lebih aman untuk token
  
  # JSON Serialization
  json_annotation: ^4.8.1
  
  # Untuk networking utilities
  connectivity_plus: ^5.0.2  # Check internet connection
  
dev_dependencies:
  flutter_test:
    sdk: flutter
  
  # JSON Serialization Code Generator
  build_runner: ^2.4.7
  json_serializable: ^6.7.1
```

Install dependencies:
```bash
flutter pub get
```

---

## 📁 STRUKTUR PROJECT (Clean Architecture)

```
lib/
├── core/
│   ├── constants/
│   │   └── api_constants.dart          # API endpoints
│   ├── network/
│   │   ├── api_client.dart             # HTTP client wrapper
│   │   ├── api_interceptor.dart        # Token interceptor
│   │   └── api_response.dart           # Response wrapper
│   ├── errors/
│   │   ├── exceptions.dart
│   │   └── failures.dart
│   └── utils/
│       └── token_manager.dart          # Token storage
│
├── data/
│   ├── models/
│   │   ├── user_model.dart
│   │   ├── note_model.dart
│   │   ├── task_model.dart
│   │   └── wellbeing_model.dart
│   ├── repositories/
│   │   ├── auth_repository_impl.dart
│   │   ├── notes_repository_impl.dart
│   │   ├── tasks_repository_impl.dart
│   │   └── wellbeing_repository_impl.dart
│   └── datasources/
│       ├── auth_remote_datasource.dart
│       ├── notes_remote_datasource.dart
│       ├── tasks_remote_datasource.dart
│       └── wellbeing_remote_datasource.dart
│
├── domain/
│   ├── entities/
│   │   ├── user.dart
│   │   ├── note.dart
│   │   ├── task.dart
│   │   └── wellbeing_entry.dart
│   ├── repositories/
│   │   ├── auth_repository.dart
│   │   ├── notes_repository.dart
│   │   ├── tasks_repository.dart
│   │   └── wellbeing_repository.dart
│   └── usecases/
│       ├── auth/
│       │   ├── login_usecase.dart
│       │   ├── register_usecase.dart
│       │   └── logout_usecase.dart
│       ├── notes/
│       │   ├── get_notes_usecase.dart
│       │   └── create_note_usecase.dart
│       └── ...
│
└── presentation/
    ├── providers/
    │   ├── auth_provider.dart
    │   ├── notes_provider.dart
    │   └── ...
    └── pages/
        └── ...
```

---

## 🔧 IMPLEMENTASI KODE

### 1. API Constants

**File: `lib/core/constants/api_constants.dart`**

```dart
class ApiConstants {
  // Base URL - Ganti sesuai environment
  static const String baseUrl = 'http://localhost:3000/api';
  
  // Untuk testing di device fisik, gunakan IP komputer Anda
  // static const String baseUrl = 'http://192.168.1.100:3000/api';
  
  // Untuk Android Emulator
  // static const String baseUrl = 'http://10.0.2.2:3000/api';
  
  // Auth Endpoints
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String profile = '/auth/profile';
  
  // Dashboard
  static const String dashboard = '/dashboard';
  
  // Notes Endpoints
  static const String notes = '/notes';
  static String noteById(int id) => '/notes/$id';
  
  // Tasks Endpoints
  static const String tasks = '/tasks';
  static const String upcomingTasks = '/tasks/upcoming';
  static String taskById(int id) => '/tasks/$id';
  static String toggleTask(int id) => '/tasks/$id/toggle';
  
  // Wellbeing Endpoints
  static const String wellbeing = '/wellbeing';
  static const String wellbeingStats = '/wellbeing/stats';
  static String wellbeingByDate(String date) => '/wellbeing/$date';
  
  // Profile Endpoints
  static const String updateProfile = '/profile';
  static const String updateSettings = '/profile/settings';
  
  // Headers
  static const String contentType = 'application/json';
  static const String authorization = 'Authorization';
  static const String bearerPrefix = 'Bearer ';
}
```

### 2. Token Manager

**File: `lib/core/utils/token_manager.dart`**

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenManager {
  static const _storage = FlutterSecureStorage();
  static const String _tokenKey = 'auth_token';
  static const String _userIdKey = 'user_id';
  
  // Save token
  static Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }
  
  // Get token
  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }
  
  // Delete token
  static Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userIdKey);
  }
  
  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
  
  // Save user ID
  static Future<void> saveUserId(int userId) async {
    await _storage.write(key: _userIdKey, value: userId.toString());
  }
  
  // Get user ID
  static Future<int?> getUserId() async {
    final userId = await _storage.read(key: _userIdKey);
    return userId != null ? int.tryParse(userId) : null;
  }
}
```

### 3. API Response Wrapper

**File: `lib/core/network/api_response.dart`**

```dart
class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;
  final dynamic errors;
  
  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    this.errors,
  });
  
  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse<T>(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null && fromJsonT != null
          ? fromJsonT(json['data'])
          : json['data'],
      errors: json['errors'],
    );
  }
}
```

### 4. API Client (dengan Dio)

**File: `lib/core/network/api_client.dart`**

```dart
import 'package:dio/dio.dart';
import '../constants/api_constants.dart';
import '../utils/token_manager.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  
  late Dio _dio;
  
  ApiClient._internal() {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': ApiConstants.contentType,
        },
      ),
    );
    
    _initializeInterceptors();
  }
  
  void _initializeInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add token to header
          final token = await TokenManager.getToken();
          if (token != null) {
            options.headers[ApiConstants.authorization] = 
                '${ApiConstants.bearerPrefix}$token';
          }
          
          print('🌐 REQUEST[${options.method}] => ${options.uri}');
          return handler.next(options);
        },
        onResponse: (response, handler) {
          print('✅ RESPONSE[${response.statusCode}] => ${response.data}');
          return handler.next(response);
        },
        onError: (error, handler) async {
          print('❌ ERROR[${error.response?.statusCode}] => ${error.message}');
          
          // Handle 401 Unauthorized - Token expired
          if (error.response?.statusCode == 401) {
            await TokenManager.deleteToken();
            // Navigate to login screen
            // You can use NavigatorKey or event bus here
          }
          
          return handler.next(error);
        },
      ),
    );
  }
  
  Dio get dio => _dio;
  
  // GET request
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      return await _dio.get(path, queryParameters: queryParameters);
    } catch (e) {
      rethrow;
    }
  }
  
  // POST request
  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      return await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
      );
    } catch (e) {
      rethrow;
    }
  }
  
  // PUT request
  Future<Response> put(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      return await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
      );
    } catch (e) {
      rethrow;
    }
  }
  
  // PATCH request
  Future<Response> patch(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      return await _dio.patch(
        path,
        data: data,
        queryParameters: queryParameters,
      );
    } catch (e) {
      rethrow;
    }
  }
  
  // DELETE request
  Future<Response> delete(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      return await _dio.delete(path, queryParameters: queryParameters);
    } catch (e) {
      rethrow;
    }
  }
}
```

### 5. Models

**File: `lib/data/models/user_model.dart`**

```dart
import 'package:json_annotation/json_annotation.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel {
  final int id;
  final String name;
  final String email;
  
  @JsonKey(name: 'avatar_url')
  final String? avatarUrl;
  
  final String theme;
  
  @JsonKey(name: 'notifications_enabled')
  final bool notificationsEnabled;
  
  final String language;
  
  @JsonKey(name: 'total_points')
  final int totalPoints;
  
  @JsonKey(name: 'current_streak')
  final int currentStreak;
  
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;
  
  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    required this.theme,
    required this.notificationsEnabled,
    required this.language,
    required this.totalPoints,
    required this.currentStreak,
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
  
  Map<String, dynamic> toJson() => _$UserModelToJson(this);
}
```

**File: `lib/data/models/note_model.dart`**

```dart
import 'package:json_annotation/json_annotation.dart';

part 'note_model.g.dart';

@JsonSerializable()
class NoteModel {
  final int id;
  
  @JsonKey(name: 'user_id')
  final int userId;
  
  final String title;
  final String content;
  final String category;
  
  @JsonKey(name: 'file_url')
  final String? fileUrl;
  
  @JsonKey(name: 'is_handwriting')
  final bool isHandwriting;
  
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;
  
  NoteModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.content,
    required this.category,
    this.fileUrl,
    required this.isHandwriting,
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory NoteModel.fromJson(Map<String, dynamic> json) =>
      _$NoteModelFromJson(json);
  
  Map<String, dynamic> toJson() => _$NoteModelToJson(this);
}
```

**File: `lib/data/models/task_model.dart`**

```dart
import 'package:json_annotation/json_annotation.dart';

part 'task_model.g.dart';

@JsonSerializable()
class TaskModel {
  final int id;
  
  @JsonKey(name: 'user_id')
  final int userId;
  
  final String title;
  final String? description;
  final String category;
  
  @JsonKey(name: 'due_date')
  final DateTime dueDate;
  
  @JsonKey(name: 'is_done')
  final bool isDone;
  
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;
  
  TaskModel({
    required this.id,
    required this.userId,
    required this.title,
    this.description,
    required this.category,
    required this.dueDate,
    required this.isDone,
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory TaskModel.fromJson(Map<String, dynamic> json) =>
      _$TaskModelFromJson(json);
  
  Map<String, dynamic> toJson() => _$TaskModelToJson(this);
}
```

### 6. Generate Model Code

Setelah membuat models dengan `@JsonSerializable`, generate kode:

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

---

## 🔐 AUTHENTICATION IMPLEMENTATION

### Auth Remote Datasource

**File: `lib/data/datasources/auth_remote_datasource.dart`**

```dart
import 'package:dio/dio.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_response.dart';
import '../../core/constants/api_constants.dart';
import '../models/user_model.dart';

class AuthRemoteDatasource {
  final ApiClient _apiClient = ApiClient();
  
  // Register
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        ApiConstants.register,
        data: {
          'name': name,
          'email': email,
          'password': password,
        },
      );
      
      final apiResponse = ApiResponse.fromJson(
        response.data,
        (data) => data,
      );
      
      if (apiResponse.success) {
        return {
          'user': UserModel.fromJson(apiResponse.data['user']),
          'token': apiResponse.data['token'],
        };
      } else {
        throw Exception(apiResponse.message);
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Registration failed');
    }
  }
  
  // Login
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        ApiConstants.login,
        data: {
          'email': email,
          'password': password,
        },
      );
      
      final apiResponse = ApiResponse.fromJson(
        response.data,
        (data) => data,
      );
      
      if (apiResponse.success) {
        return {
          'user': UserModel.fromJson(apiResponse.data['user']),
          'token': apiResponse.data['token'],
        };
      } else {
        throw Exception(apiResponse.message);
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Login failed');
    }
  }
  
  // Get Profile
  Future<UserModel> getProfile() async {
    try {
      final response = await _apiClient.get(ApiConstants.profile);
      
      final apiResponse = ApiResponse.fromJson(
        response.data,
        (data) => UserModel.fromJson(data),
      );
      
      if (apiResponse.success && apiResponse.data != null) {
        return apiResponse.data!;
      } else {
        throw Exception(apiResponse.message);
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to get profile');
    }
  }
}
```

### Auth Provider (State Management)

**File: `lib/presentation/providers/auth_provider.dart`** (dengan Provider package)

```dart
import 'package:flutter/foundation.dart';
import '../../core/utils/token_manager.dart';
import '../../data/datasources/auth_remote_datasource.dart';
import '../../data/models/user_model.dart';

class AuthProvider with ChangeNotifier {
  final AuthRemoteDatasource _authDatasource = AuthRemoteDatasource();
  
  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;
  bool _isAuthenticated = false;
  
  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated => _isAuthenticated;
  
  // Initialize - Check if user is logged in
  Future<void> initialize() async {
    final isLoggedIn = await TokenManager.isLoggedIn();
    if (isLoggedIn) {
      await loadProfile();
    }
  }
  
  // Register
  Future<bool> register({
    required String name,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    
    try {
      final result = await _authDatasource.register(
        name: name,
        email: email,
        password: password,
      );
      
      _user = result['user'];
      await TokenManager.saveToken(result['token']);
      await TokenManager.saveUserId(_user!.id);
      _isAuthenticated = true;
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  // Login
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    
    try {
      final result = await _authDatasource.login(
        email: email,
        password: password,
      );
      
      _user = result['user'];
      await TokenManager.saveToken(result['token']);
      await TokenManager.saveUserId(_user!.id);
      _isAuthenticated = true;
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  // Load Profile
  Future<void> loadProfile() async {
    try {
      _user = await _authDatasource.getProfile();
      _isAuthenticated = true;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isAuthenticated = false;
      notifyListeners();
    }
  }
  
  // Logout
  Future<void> logout() async {
    await TokenManager.deleteToken();
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}
```

---

## 📝 CONTOH PENGGUNAAN DI UI

### Login Screen

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = context.read<AuthProvider>();
      
      final success = await authProvider.login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );

      if (success && mounted) {
        // Navigate to home screen
        Navigator.pushReplacementNamed(context, '/home');
      } else if (mounted) {
        // Show error
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(authProvider.errorMessage ?? 'Login failed'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              Consumer<AuthProvider>(
                builder: (context, authProvider, child) {
                  return ElevatedButton(
                    onPressed: authProvider.isLoading ? null : _handleLogin,
                    child: authProvider.isLoading
                        ? const CircularProgressIndicator()
                        : const Text('Login'),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### Main.dart Setup

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'presentation/providers/auth_provider.dart';
import 'presentation/pages/login_screen.dart';
import 'presentation/pages/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..initialize()),
        // Add other providers here
      ],
      child: MaterialApp(
        title: 'StudentHub',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          useMaterial3: true,
        ),
        home: Consumer<AuthProvider>(
          builder: (context, authProvider, child) {
            if (authProvider.isAuthenticated) {
              return const HomeScreen();
            } else {
              return const LoginScreen();
            }
          },
        ),
        routes: {
          '/login': (context) => const LoginScreen(),
          '/home': (context) => const HomeScreen(),
        },
      ),
    );
  }
}
```

---

## 🎯 TESTING BACKEND CONNECTION

### Test Connection

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> testConnection() async {
  try {
    final response = await http.get(
      Uri.parse('http://localhost:3000/health'),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      print('✅ Connection successful: ${data['message']}');
    } else {
      print('❌ Connection failed: ${response.statusCode}');
    }
  } catch (e) {
    print('❌ Error: $e');
  }
}
```

---

## 📱 KONFIGURASI UNTUK BERBAGAI PLATFORM

### Android Emulator
```dart
static const String baseUrl = 'http://10.0.2.2:3000/api';
```

### iOS Simulator
```dart
static const String baseUrl = 'http://localhost:3000/api';
```

### Physical Device
```dart
// Ganti dengan IP komputer Anda di network yang sama
static const String baseUrl = 'http://192.168.1.100:3000/api';
```

Untuk mendapatkan IP komputer:
```bash
# Linux/Mac
hostname -I | awk '{print $1}'

# Windows
ipconfig
```

### Android Manifest (untuk HTTP requests)

**File: `android/app/src/main/AndroidManifest.xml`**

```xml
<manifest>
    <application
        android:usesCleartextTraffic="true"
        ...>
    </application>
</manifest>
```

---

## 🔍 ERROR HANDLING

```dart
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  
  ApiException(this.message, [this.statusCode]);
  
  @override
  String toString() => message;
}

// Usage in datasource
try {
  final response = await _apiClient.get('/endpoint');
  // process response
} on DioException catch (e) {
  if (e.response != null) {
    throw ApiException(
      e.response?.data['message'] ?? 'Something went wrong',
      e.response?.statusCode,
    );
  } else {
    throw ApiException('Network error: ${e.message}');
  }
}
```

---

## ✅ CHECKLIST INTEGRATION

- [ ] Install dependencies di pubspec.yaml
- [ ] Setup project structure (folders)
- [ ] Buat ApiConstants dengan base URL yang benar
- [ ] Implementasi TokenManager
- [ ] Setup ApiClient dengan interceptors
- [ ] Buat models untuk semua entities
- [ ] Generate model code dengan build_runner
- [ ] Implementasi datasources (auth, notes, tasks, dll)
- [ ] Setup state management (Provider/Riverpod/Bloc)
- [ ] Buat UI untuk login/register
- [ ] Test connection ke backend
- [ ] Implementasi error handling
- [ ] Test di emulator dan physical device

---

## 🚀 NEXT STEPS

Setelah setup dasar selesai, Anda bisa:

1. Implementasi CRUD untuk Notes
2. Implementasi CRUD untuk Tasks
3. Implementasi Wellbeing tracking
4. Add pagination untuk list views
5. Add pull-to-refresh
6. Add offline support dengan local database
7. Add push notifications
8. Optimize dengan caching

---

## 📚 RESOURCES

- Backend API Documentation: `API_TESTING.md`
- Database Schema: `prisma/schema.prisma`
- Error Responses: Lihat `API_TESTING.md`

Jika ada masalah atau pertanyaan, check logs di console dan pastikan:
1. Backend server running di http://localhost:3000
2. Base URL di Flutter sesuai dengan platform (emulator/device)
3. Token tersimpan dengan benar setelah login
4. Network permission ada di AndroidManifest.xml

---

**Happy Coding! 🎉**
